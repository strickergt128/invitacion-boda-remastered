import { useCallback, useState } from "react";

const CLAVE = "invitacion-enviados";

function leer(): Record<string, boolean> {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? JSON.parse(crudo) : {};
  } catch {
    return {};
  }
}

function guardar(estado: Record<string, boolean>) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // Sin almacenamiento disponible (modo privado, etc.): el estado vive solo en memoria.
  }
}

export function useEnviados() {
  const [enviados, setEnviados] = useState<Record<string, boolean>>(leer);

  const alternar = useCallback((id: string) => {
    setEnviados((prev) => {
      const siguiente = { ...prev, [id]: !prev[id] };
      if (!siguiente[id]) delete siguiente[id];
      guardar(siguiente);
      return siguiente;
    });
  }, []);

  return { enviados, alternar };
}
