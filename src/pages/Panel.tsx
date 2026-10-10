import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Check,
  CheckCircle2,
  Circle,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  MessageCircle,
  Search,
  Send,
  Ticket,
  Upload,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { evento } from "../data/evento";
import {
  invitados,
  linkGeneral,
  linkInvitado,
  mensajeInvitacion,
  mensajeInvitacionGeneral,
  normalizar,
  textoPases,
  urlWhatsApp,
  type Invitado,
  type Lado,
} from "../lib/invitados";
import {
  descargarArchivo,
  descargarRespaldo,
  fechaArchivo,
  leerRespaldo,
  useRegistro,
  type Registro,
  type RegistroInvitado,
  type Respuesta,
} from "../lib/registro";

type FiltroLado = "todos" | Lado;
type FiltroEnvio = "todos" | "pendientes" | "enviados";
type FiltroRespuesta = "todas" | Respuesta;

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

const nombreLado: Record<Lado, string> = { giovanni: "Giovanni", mariana: "Mariana" };

const botonContorno =
  "presionable inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-md border border-boda-terracota/30 text-boda-terracota text-xs hover:bg-boda-terracota/10";

// ─── Piezas pequeñas ────────────────────────────────────────

function Resumen({ etiqueta, valor, detalle, icono }: { etiqueta: string; valor: ReactNode; detalle?: string; icono: ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-boda-terracota/10">
      <div className="flex items-center gap-2 text-boda-terracota text-[11px] tracking-[0.15em] uppercase mb-2">
        {icono}
        {etiqueta}
      </div>
      <p className="font-serif text-3xl md:text-4xl text-boda-cafe leading-none tabular-nums">{valor}</p>
      {detalle && <p className="text-xs text-boda-texto/60 mt-1.5">{detalle}</p>}
    </div>
  );
}

function BotonCopiar({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const area = document.createElement("textarea");
      area.value = texto;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };

  return (
    <button onClick={copiar} className={botonContorno} title="Copiar link">
      {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copiado ? "Copiado" : "Copiar"}
    </button>
  );
}

function BotonWhatsApp({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="presionable inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-[#25D366] text-white text-xs font-medium hover:bg-[#1ebe5b]"
    >
      <MessageCircle className="w-4 h-4" />
      WhatsApp
    </a>
  );
}

function Chips<T extends string>({
  opciones,
  valor,
  onCambiar,
}: {
  opciones: { valor: T; etiqueta: string; cuenta: number }[];
  valor: T;
  onCambiar: (v: T) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto sin-barra -mx-4 px-4 md:mx-0 md:px-0">
      {opciones.map((o) => (
        <button
          key={o.valor}
          onClick={() => onCambiar(o.valor)}
          aria-pressed={valor === o.valor}
          className={`presionable h-9 px-3 rounded-full text-xs whitespace-nowrap ${
            valor === o.valor
              ? "bg-boda-cafe text-white"
              : "bg-white text-boda-texto/70 border border-boda-terracota/20 hover:border-boda-terracota/50"
          }`}
        >
          {o.etiqueta} <span className="opacity-60 tabular-nums">{o.cuenta}</span>
        </button>
      ))}
    </div>
  );
}

const opcionesRespuesta: { valor: Respuesta; etiqueta: string; activo: string }[] = [
  { valor: "pendiente", etiqueta: "Sin respuesta", activo: "bg-boda-arena text-boda-cafe" },
  { valor: "confirmo", etiqueta: "Confirmó", activo: "bg-emerald-700 text-white" },
  { valor: "no", etiqueta: "No asistirá", activo: "bg-boda-oxido text-white" },
];

// ─── Fila de invitado ───────────────────────────────────────

function FilaInvitado({
  invitado,
  reg,
  onActualizar,
}: {
  invitado: Invitado;
  reg: RegistroInvitado;
  onActualizar: (cambios: RegistroInvitado) => void;
}) {
  const link = linkInvitado(invitado);
  const respuesta = reg.respuesta ?? "pendiente";
  const pasesConfirmados = reg.pasesConfirmados ?? invitado.pases;

  return (
    <li className="bg-white rounded-xl p-4 md:px-5 shadow-sm border border-boda-terracota/10">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif text-xl text-boda-texto leading-tight">{invitado.nombre}</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-boda-arena text-boda-cafe px-2 py-0.5 text-xs font-medium">
              <Ticket className="w-3 h-3" />
              {textoPases(invitado.pases)}
            </span>
            <span className="text-[10px] tracking-[0.15em] uppercase text-boda-texto/50">{nombreLado[invitado.lado]}</span>
          </div>
          <p className="text-xs text-boda-texto/45 truncate mt-1" title={link}>
            {link}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <BotonCopiar texto={link} />
          <a href={link} target="_blank" rel="noopener noreferrer" className={botonContorno} title="Ver invitación">
            <ExternalLink className="w-4 h-4" />
            Ver
          </a>
          <BotonWhatsApp href={urlWhatsApp(invitado.telefono, mensajeInvitacion(invitado))} />
          <button
            onClick={() => onActualizar({ enviado: !reg.enviado })}
            aria-pressed={!!reg.enviado}
            className={`presionable inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-medium ${
              reg.enviado ? "bg-boda-cafe text-white" : "border border-boda-cafe/30 text-boda-cafe hover:bg-boda-cafe/5"
            }`}
          >
            {reg.enviado ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            {reg.enviado ? "Enviada" : "Marcar enviada"}
          </button>
        </div>
      </div>

      {/* Respuesta registrada a mano */}
      <div className="mt-3 pt-3 border-t border-boda-arena flex flex-wrap items-center gap-2">
        <span className="text-[11px] tracking-[0.15em] uppercase text-boda-texto/50 mr-1">Respuesta</span>
        <div className="inline-flex rounded-lg bg-boda-crema p-0.5" role="radiogroup" aria-label={`Respuesta de ${invitado.nombre}`}>
          {opcionesRespuesta.map((o) => (
            <button
              key={o.valor}
              role="radio"
              aria-checked={respuesta === o.valor}
              onClick={() =>
                onActualizar({
                  respuesta: o.valor,
                  pasesConfirmados: o.valor === "confirmo" ? reg.pasesConfirmados ?? invitado.pases : undefined,
                })
              }
              className={`presionable h-8 px-3 rounded-md text-xs ${
                respuesta === o.valor ? o.activo : "text-boda-texto/60 hover:text-boda-texto"
              }`}
            >
              {o.etiqueta}
            </button>
          ))}
        </div>
        {respuesta === "confirmo" && (
          <label className="inline-flex items-center gap-2 text-xs text-boda-texto/70">
            Pases que usarán
            <select
              value={pasesConfirmados}
              onChange={(e) => onActualizar({ pasesConfirmados: Number(e.target.value) })}
              className="h-8 rounded-md border border-boda-terracota/30 bg-white px-2 text-base md:text-sm"
            >
              {Array.from({ length: invitado.pases }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} de {invitado.pases}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </li>
  );
}

// ─── Exportar ───────────────────────────────────────────────

function exportarCSV(registro: Registro) {
  const celda = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const etiquetaRespuesta: Record<Respuesta, string> = { pendiente: "Sin respuesta", confirmo: "Confirmó", no: "No asistirá" };
  const filas = [
    ["Nombre", "Lado", "Pases asignados", "Enviada", "Respuesta", "Pases confirmados", "Link"],
    ...invitados.map((i) => {
      const r = registro[i.id] ?? {};
      const respuesta = r.respuesta ?? "pendiente";
      return [
        i.nombre,
        nombreLado[i.lado],
        i.pases,
        r.enviado ? "Sí" : "No",
        etiquetaRespuesta[respuesta],
        respuesta === "confirmo" ? r.pasesConfirmados ?? i.pases : "",
        linkInvitado(i),
      ];
    }),
  ];
  // BOM para que Excel respete los acentos
  const csv = "﻿" + filas.map((f) => f.map(celda).join(",")).join("\r\n");
  descargarArchivo(`invitados-${fechaArchivo()}.csv`, csv, "text/csv;charset=utf-8");
}

// ─── Página ─────────────────────────────────────────────────

export default function Panel() {
  const { registro, actualizar, reemplazar } = useRegistro();
  const [busqueda, setBusqueda] = useState("");
  const [lado, setLado] = useState<FiltroLado>("todos");
  const [envio, setEnvio] = useState<FiltroEnvio>("todos");
  const [respuesta, setRespuesta] = useState<FiltroRespuesta>("todas");
  const archivo = useRef<HTMLInputElement>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Panel de invitados";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const reg = (i: Invitado) => registro[i.id] ?? {};
  const respuestaDe = (i: Invitado): Respuesta => reg(i).respuesta ?? "pendiente";

  // Totales generales
  const totalPases = invitados.reduce((s, i) => s + i.pases, 0);
  const enviadas = invitados.filter((i) => reg(i).enviado).length;
  const confirmados = invitados.filter((i) => respuestaDe(i) === "confirmo");
  const pasesConfirmados = confirmados.reduce((s, i) => s + (reg(i).pasesConfirmados ?? i.pases), 0);
  const noAsistiran = invitados.filter((i) => respuestaDe(i) === "no");
  const pasesLiberados = noAsistiran.reduce((s, i) => s + i.pases, 0);
  const sinRespuesta = invitados.length - confirmados.length - noAsistiran.length;

  // Cada grupo de filtros cuenta sobre lo que dejan pasar los otros, así los números siempre cuadran
  const pasa = (i: Invitado, omitir?: "lado" | "envio" | "respuesta") => {
    const q = normalizar(busqueda);
    if (q && !normalizar(i.nombre).includes(q)) return false;
    if (omitir !== "lado" && lado !== "todos" && i.lado !== lado) return false;
    if (omitir !== "envio" && envio === "enviados" && !reg(i).enviado) return false;
    if (omitir !== "envio" && envio === "pendientes" && reg(i).enviado) return false;
    if (omitir !== "respuesta" && respuesta !== "todas" && respuestaDe(i) !== respuesta) return false;
    return true;
  };
  const contar = (omitir: "lado" | "envio" | "respuesta", condicion: (i: Invitado) => boolean) =>
    invitados.filter((i) => pasa(i, omitir) && condicion(i)).length;

  const visibles = invitados.filter((i) => pasa(i));

  const restaurar = async (f: File | undefined) => {
    if (!f) return;
    try {
      const nuevo = await leerRespaldo(f);
      const n = Object.keys(nuevo).length;
      if (window.confirm(`¿Reemplazar el registro actual con este respaldo (${n} invitados con datos)?`)) {
        reemplazar(nuevo);
        setAviso("Respaldo restaurado.");
      }
    } catch (e) {
      setAviso((e as Error).message);
    } finally {
      if (archivo.current) archivo.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-boda-crema">
      <div
        className="max-w-5xl mx-auto px-4 py-10 md:py-14"
        style={{ paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <header className="text-center mb-8">
          <p className="text-boda-terracota tracking-[0.3em] uppercase text-[11px] mb-2">Panel de invitados</p>
          <h1 className="font-script text-5xl md:text-6xl text-boda-cafe">
            {evento.novios.novia} &amp; {evento.novios.novio}
          </h1>
        </header>

        {/* Resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <Resumen etiqueta="Invitaciones" valor={invitados.length} detalle={`${plural(totalPases, "pase", "pases")} en total`} icono={<Users className="w-4 h-4" />} />
          <Resumen
            etiqueta="Enviadas"
            valor={`${enviadas}/${invitados.length}`}
            detalle={`${invitados.length - enviadas} por enviar`}
            icono={<Send className="w-4 h-4" />}
          />
          <Resumen
            etiqueta="Confirmados"
            valor={pasesConfirmados}
            detalle={`${pasesConfirmados === 1 ? "pase" : "pases"} · ${plural(confirmados.length, "invitación", "invitaciones")}`}
            icono={<CheckCircle2 className="w-4 h-4" />}
          />
          <Resumen
            etiqueta="No asistirán"
            valor={noAsistiran.length}
            detalle={`${plural(pasesLiberados, "pase liberado", "pases liberados")} · ${sinRespuesta} sin respuesta`}
            icono={<XCircle className="w-4 h-4" />}
          />
        </div>

        {/* Barra de pases confirmados */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-boda-terracota/10 mb-6">
          <div className="flex justify-between text-xs text-boda-texto/70 mb-2">
            <span>Pases confirmados</span>
            <span className="tabular-nums">
              {pasesConfirmados} de {totalPases} ({Math.round((pasesConfirmados / totalPases) * 100)}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-boda-arena overflow-hidden">
            <div
              className="h-full rounded-full bg-boda-terracota origin-left transition-transform duration-300 ease-out-fuerte"
              style={{ transform: `scaleX(${pasesConfirmados / totalPases})` }}
            />
          </div>
        </div>

        {/* Invitación general */}
        <div className="bg-boda-terracota text-white rounded-xl p-4 md:px-5 mb-8 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-serif text-xl">Invitación general</p>
            <p className="text-xs text-white/75">Sin nombre ni pases, para quien se haya quedado sin la suya.</p>
          </div>
          <div className="flex flex-wrap gap-2 [&_a]:border-white/40 [&_button]:border-white/40 [&_a]:text-white [&_button]:text-white">
            <BotonCopiar texto={linkGeneral()} />
            <a href={linkGeneral()} target="_blank" rel="noopener noreferrer" className={botonContorno}>
              <ExternalLink className="w-4 h-4" />
              Ver
            </a>
            <BotonWhatsApp href={urlWhatsApp("", mensajeInvitacionGeneral())} />
          </div>
        </div>

        {/* Búsqueda y filtros */}
        <div className="space-y-3 mb-5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-boda-texto/40" />
            <input
              type="text"
              enterKeyHint="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar invitado…"
              className="w-full h-11 rounded-lg border border-boda-terracota/20 bg-white pl-10 pr-10 focus:outline-none focus:border-boda-terracota focus:ring-1 focus:ring-boda-terracota"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-boda-texto/40 hover:text-boda-texto"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Chips
            valor={lado}
            onCambiar={setLado}
            opciones={[
              { valor: "todos", etiqueta: "Todos", cuenta: contar("lado", () => true) },
              { valor: "giovanni", etiqueta: "De Giovanni", cuenta: contar("lado", (i) => i.lado === "giovanni") },
              { valor: "mariana", etiqueta: "De Mariana", cuenta: contar("lado", (i) => i.lado === "mariana") },
            ]}
          />
          <Chips
            valor={envio}
            onCambiar={setEnvio}
            opciones={[
              { valor: "todos", etiqueta: "Envío: todas", cuenta: contar("envio", () => true) },
              { valor: "pendientes", etiqueta: "Por enviar", cuenta: contar("envio", (i) => !reg(i).enviado) },
              { valor: "enviados", etiqueta: "Enviadas", cuenta: contar("envio", (i) => !!reg(i).enviado) },
            ]}
          />
          <Chips
            valor={respuesta}
            onCambiar={setRespuesta}
            opciones={[
              { valor: "todas", etiqueta: "Respuesta: todas", cuenta: contar("respuesta", () => true) },
              { valor: "confirmo", etiqueta: "Confirmaron", cuenta: contar("respuesta", (i) => respuestaDe(i) === "confirmo") },
              { valor: "no", etiqueta: "No asistirán", cuenta: contar("respuesta", (i) => respuestaDe(i) === "no") },
              { valor: "pendiente", etiqueta: "Sin respuesta", cuenta: contar("respuesta", (i) => respuestaDe(i) === "pendiente") },
            ]}
          />
        </div>

        {visibles.length === 0 ? (
          <p className="text-center text-boda-texto/60 py-16 font-serif italic text-lg">No hay invitados que coincidan.</p>
        ) : (
          <ul className="space-y-3">
            {visibles.map((i) => (
              <FilaInvitado key={i.id} invitado={i} reg={reg(i)} onActualizar={(c) => actualizar(i.id, c)} />
            ))}
          </ul>
        )}

        {/* Respaldo */}
        <section className="mt-12 bg-white rounded-xl p-5 shadow-sm border border-boda-terracota/10">
          <h2 className="font-serif text-2xl text-boda-cafe mb-1">Respaldo</h2>
          <p className="text-sm text-boda-texto/60 mb-4">
            El registro se guarda solo en este navegador. Descarga un respaldo de vez en cuando, y restáuralo si cambias de
            dispositivo.
          </p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => descargarRespaldo(registro)} className={botonContorno}>
              <Download className="w-4 h-4" />
              Descargar respaldo
            </button>
            <button onClick={() => archivo.current?.click()} className={botonContorno}>
              <Upload className="w-4 h-4" />
              Restaurar respaldo
            </button>
            <button onClick={() => exportarCSV(registro)} className={botonContorno}>
              <FileSpreadsheet className="w-4 h-4" />
              Exportar a Excel (CSV)
            </button>
            <input
              ref={archivo}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => restaurar(e.target.files?.[0])}
            />
          </div>
          {aviso && (
            <p className="text-sm text-boda-oxido mt-3" role="status">
              {aviso}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
