import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, CheckCircle2, Circle, Copy, ExternalLink, MessageCircle, Search, Ticket, Users, X } from "lucide-react";
import { evento } from "../data/evento";
import {
  invitados,
  linkInvitado,
  mensajeInvitacion,
  normalizar,
  textoPases,
  urlWhatsApp,
  type Invitado,
} from "../lib/invitados";
import { useEnviados } from "../lib/enviados";

type Filtro = "todos" | "pendientes" | "enviados";

function Resumen({ etiqueta, valor, icono }: { etiqueta: string; valor: number; icono: ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-wedding-accent/10">
      <div className="flex items-center gap-2 text-wedding-accent text-xs tracking-[0.15em] uppercase mb-2">
        {icono}
        {etiqueta}
      </div>
      <p className="font-serif text-3xl md:text-4xl text-wedding-olive leading-none">{valor}</p>
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
    <button
      onClick={copiar}
      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-wedding-accent/30 text-wedding-accent text-xs hover:bg-wedding-accent/10 transition-colors"
      title="Copiar link"
    >
      {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copiado ? "Copiado" : "Copiar"}
    </button>
  );
}

function FilaInvitado({
  invitado,
  enviado,
  onAlternar,
}: {
  invitado: Invitado;
  enviado: boolean;
  onAlternar: () => void;
}) {
  const link = linkInvitado(invitado);
  const whatsapp = urlWhatsApp(invitado.telefono, mensajeInvitacion(invitado));

  return (
    <li
      className={`bg-white rounded-xl p-4 md:px-5 shadow-sm border transition-colors ${
        enviado ? "border-wedding-olive/20" : "border-wedding-accent/10"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif text-xl text-wedding-text leading-tight">{invitado.nombre}</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-wedding-gold/40 text-wedding-olive px-2 py-0.5 text-xs font-medium">
              <Ticket className="w-3 h-3" />
              {textoPases(invitado.pases)}
            </span>
          </div>
          <p className="text-xs text-wedding-text/50 truncate mt-1" title={link}>
            {link}
            {invitado.telefono ? ` · ${invitado.telefono}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <BotonCopiar texto={link} />
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-wedding-accent/30 text-wedding-accent text-xs hover:bg-wedding-accent/10 transition-colors"
            title="Ver invitación"
          >
            <ExternalLink className="w-4 h-4" />
            Ver
          </a>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-[#25D366] text-white text-xs font-medium hover:bg-[#1ebe5b] transition-colors"
            title={invitado.telefono ? "Enviar por WhatsApp" : "Elegir contacto en WhatsApp"}
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          <button
            onClick={onAlternar}
            aria-pressed={enviado}
            className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-medium transition-colors ${
              enviado
                ? "bg-wedding-olive text-white hover:bg-wedding-olive/90"
                : "border border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/5"
            }`}
          >
            {enviado ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            {enviado ? "Enviado" : "Marcar enviado"}
          </button>
        </div>
      </div>
    </li>
  );
}

export default function Panel() {
  const { enviados, alternar } = useEnviados();
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  useEffect(() => {
    document.title = "Panel de invitados";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const totalEnviados = invitados.filter((i) => enviados[i.id]).length;
  const totalPases = invitados.reduce((suma, i) => suma + i.pases, 0);

  const visibles = useMemo(() => {
    const q = normalizar(busqueda);
    return invitados.filter((i) => {
      if (filtro === "enviados" && !enviados[i.id]) return false;
      if (filtro === "pendientes" && enviados[i.id]) return false;
      return !q || normalizar(i.nombre).includes(q) || i.id.includes(q);
    });
  }, [busqueda, filtro, enviados]);

  const filtros: { valor: Filtro; etiqueta: string; cuenta: number }[] = [
    { valor: "todos", etiqueta: "Todos", cuenta: invitados.length },
    { valor: "pendientes", etiqueta: "Pendientes", cuenta: invitados.length - totalEnviados },
    { valor: "enviados", etiqueta: "Enviados", cuenta: totalEnviados },
  ];

  return (
    <div className="min-h-screen bg-wedding-cream">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <header className="text-center mb-10">
          <p className="text-wedding-accent tracking-[0.3em] uppercase text-xs mb-3">Panel de invitados</p>
          <h1 className="font-script text-5xl md:text-6xl text-wedding-olive">
            {evento.novios.novia} &amp; {evento.novios.novio}
          </h1>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <Resumen etiqueta="Invitados" valor={invitados.length} icono={<Users className="w-4 h-4" />} />
          <Resumen etiqueta="Pases" valor={totalPases} icono={<Ticket className="w-4 h-4" />} />
          <Resumen etiqueta="Enviados" valor={totalEnviados} icono={<CheckCircle2 className="w-4 h-4" />} />
          <Resumen
            etiqueta="Pendientes"
            valor={invitados.length - totalEnviados}
            icono={<Circle className="w-4 h-4" />}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-wedding-text/40" />
            <input
              type="text"
              enterKeyHint="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar invitado…"
              className="w-full h-11 rounded-lg border border-wedding-accent/20 bg-white pl-10 pr-10 text-base focus:outline-none focus:border-wedding-accent focus:ring-1 focus:ring-wedding-accent"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-wedding-text/40 hover:text-wedding-text"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 md:flex gap-2">
            {filtros.map((f) => (
              <button
                key={f.valor}
                onClick={() => setFiltro(f.valor)}
                className={`h-11 px-2 md:px-4 rounded-lg text-xs md:text-sm whitespace-nowrap transition-colors ${
                  filtro === f.valor
                    ? "bg-wedding-olive text-white"
                    : "bg-white text-wedding-text/70 border border-wedding-accent/20 hover:border-wedding-accent/50"
                }`}
              >
                {f.etiqueta} <span className="opacity-70">({f.cuenta})</span>
              </button>
            ))}
          </div>
        </div>

        {visibles.length === 0 ? (
          <p className="text-center text-wedding-text/60 py-16 font-serif italic text-lg">
            No hay invitados que coincidan con la búsqueda.
          </p>
        ) : (
          <ul className="space-y-3">
            {visibles.map((i) => (
              <FilaInvitado key={i.id} invitado={i} enviado={!!enviados[i.id]} onAlternar={() => alternar(i.id)} />
            ))}
          </ul>
        )}

        <p className="text-center text-xs text-wedding-text/40 mt-10">
          El estado “enviado” se guarda en este navegador.
        </p>
      </div>
    </div>
  );
}
