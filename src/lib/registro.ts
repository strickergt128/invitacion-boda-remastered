import { useCallback, useState } from "react";

// Registro manual del panel: si la invitación se envió y qué respondió cada invitado.
// Vive en el navegador (localStorage); por eso el panel ofrece descargar y restaurar un respaldo.

export type Respuesta = "pendiente" | "confirmo" | "no";

export type RegistroInvitado = {
  enviado?: boolean;
  respuesta?: Respuesta;
  pasesConfirmados?: number;
};

export type Registro = Record<string, RegistroInvitado>;

const CLAVE = "invitacion-registro-v1";
const CLAVE_ANTERIOR = "invitacion-enviados"; // versión previa: solo { id: true }

function leer(): Registro {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (crudo) return JSON.parse(crudo);

    // Migra lo marcado como "enviado" en la versión anterior del panel
    const anterior = localStorage.getItem(CLAVE_ANTERIOR);
    if (anterior) {
      const enviados: Record<string, boolean> = JSON.parse(anterior);
      return Object.fromEntries(Object.keys(enviados).map((id) => [id, { enviado: true }]));
    }
  } catch {
    // Datos dañados o sin acceso al almacenamiento: se empieza vacío
  }
  return {};
}

function guardar(registro: Registro) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(registro));
  } catch {
    // Sin almacenamiento (modo privado, etc.): el registro vive solo en memoria
  }
}

/** Quita lo que está en su valor por defecto, para que el respaldo quede limpio. */
function limpiar(r: RegistroInvitado): RegistroInvitado | null {
  const limpio: RegistroInvitado = {};
  if (r.enviado) limpio.enviado = true;
  if (r.respuesta && r.respuesta !== "pendiente") limpio.respuesta = r.respuesta;
  if (r.respuesta === "confirmo" && r.pasesConfirmados) limpio.pasesConfirmados = r.pasesConfirmados;
  return Object.keys(limpio).length ? limpio : null;
}

export function useRegistro() {
  const [registro, setRegistro] = useState<Registro>(leer);

  const actualizar = useCallback((id: string, cambios: RegistroInvitado) => {
    setRegistro((prev) => {
      const siguiente = { ...prev };
      const nuevo = limpiar({ ...prev[id], ...cambios });
      if (nuevo) siguiente[id] = nuevo;
      else delete siguiente[id];
      guardar(siguiente);
      return siguiente;
    });
  }, []);

  const reemplazar = useCallback((nuevo: Registro) => {
    guardar(nuevo);
    setRegistro(nuevo);
  }, []);

  return { registro, actualizar, reemplazar };
}

// ─── Respaldo ───────────────────────────────────────────────

export function descargarArchivo(nombre: string, contenido: string, tipo: string) {
  const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const fechaArchivo = () => new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-");

export function descargarRespaldo(registro: Registro) {
  const datos = { version: 1, fecha: new Date().toISOString(), registro };
  descargarArchivo(`respaldo-invitados-${fechaArchivo()}.json`, JSON.stringify(datos, null, 2), "application/json");
}

/** Lee un respaldo y valida su forma; lanza un error con un mensaje legible si no sirve. */
export async function leerRespaldo(archivo: File): Promise<Registro> {
  let datos: unknown;
  try {
    datos = JSON.parse(await archivo.text());
  } catch {
    throw new Error("El archivo no es un respaldo válido (no es JSON).");
  }
  const registro = (datos as { registro?: unknown })?.registro;
  if (!registro || typeof registro !== "object" || Array.isArray(registro)) {
    throw new Error("El archivo no tiene el formato de respaldo del panel.");
  }
  const limpio: Registro = {};
  for (const [id, valor] of Object.entries(registro as Record<string, RegistroInvitado>)) {
    const r = limpiar({
      enviado: valor?.enviado === true,
      respuesta: ["confirmo", "no"].includes(valor?.respuesta ?? "") ? valor.respuesta : "pendiente",
      pasesConfirmados: Number(valor?.pasesConfirmados) || undefined,
    });
    if (r) limpio[id] = r;
  }
  return limpio;
}

export { fechaArchivo };
