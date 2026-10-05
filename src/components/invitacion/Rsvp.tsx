import { useEffect, useState, type FormEvent } from "react";
import { CalendarPlus, Send } from "lucide-react";
import { evento } from "../../data/evento";
import { descargarCalendario } from "../../lib/calendario";
import { confetiCelebracion } from "../../lib/confeti";
import { textoPases, urlWhatsApp, type Invitado } from "../../lib/invitados";
import Ornamento from "./Ornamento";

type Respuesta = { nombre: string; asiste: boolean; personas: number };

type Props = {
  invitado?: Invitado;
  /** Se llama al confirmar asistencia, para mostrar la animación de celebración. */
  onCelebrar: () => void;
  /** Mientras la celebración está en pantalla no lanzamos el confeti. */
  celebrando: boolean;
};

const claveRespuesta = (invitado?: Invitado) => `invitacion-rsvp-${invitado?.id ?? "generico"}`;

function leerRespuesta(invitado?: Invitado): Respuesta | null {
  try {
    const crudo = localStorage.getItem(claveRespuesta(invitado));
    return crudo ? JSON.parse(crudo) : null;
  } catch {
    return null;
  }
}

function guardarRespuesta(invitado: Invitado | undefined, respuesta: Respuesta | null) {
  try {
    if (respuesta) localStorage.setItem(claveRespuesta(invitado), JSON.stringify(respuesta));
    else localStorage.removeItem(claveRespuesta(invitado));
  } catch {
    // Sin almacenamiento: la respuesta solo dura mientras la página esté abierta.
  }
}

function mensajeConfirmacion(r: Respuesta, invitado?: Invitado): string {
  if (!r.asiste) {
    return `Hola, soy ${r.nombre}. Lamentablemente no podré asistir a su boda. ¡Les deseo lo mejor en este gran día! 💛`;
  }
  if (invitado) {
    return `¡Hola! Soy ${r.nombre}. Con mucho gusto confirmo nuestra asistencia a su boda con ${r.personas} de ${textoPases(invitado.pases)}. 🎉`;
  }
  const personas = r.personas === 1 ? "1 persona" : `${r.personas} personas`;
  return `¡Hola! Soy ${r.nombre}. Con mucho gusto confirmo mi asistencia a su boda para ${personas}. 🎉`;
}

const estiloCampo =
  "flex h-11 w-full rounded-md border border-wedding-sage/50 bg-white px-3 py-2 text-base focus:outline-none focus:border-wedding-accent focus:ring-1 focus:ring-wedding-accent disabled:bg-wedding-paper disabled:text-wedding-text/80";

export default function Rsvp({ invitado, onCelebrar, celebrando }: Props) {
  const { rsvp } = evento;
  const maxPersonas = invitado?.pases ?? rsvp.maxPersonasGenerico;

  const [respuesta, setRespuesta] = useState<Respuesta | null>(() => leerRespuesta(invitado));
  const [nombre, setNombre] = useState(invitado?.nombre ?? "");
  const [asistencia, setAsistencia] = useState<"si" | "no" | "">("");
  const [personas, setPersonas] = useState(maxPersonas);
  const [recienEnviada, setRecienEnviada] = useState(false);

  useEffect(() => {
    if (recienEnviada && respuesta?.asiste && !celebrando) {
      confetiCelebracion();
      setRecienEnviada(false);
    }
  }, [recienEnviada, respuesta, celebrando]);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!asistencia || !nombre.trim()) return;

    const nueva: Respuesta = {
      nombre: nombre.trim(),
      asiste: asistencia === "si",
      personas: asistencia === "si" ? personas : 0,
    };

    // Se abre en el mismo clic para que el navegador no lo bloquee.
    window.open(urlWhatsApp(rsvp.whatsappNovios, mensajeConfirmacion(nueva, invitado)), "_blank", "noopener");

    if (nueva.asiste) onCelebrar();
    guardarRespuesta(invitado, nueva);
    setRespuesta(nueva);
    setRecienEnviada(true);
    document.getElementById("rsvp")?.scrollIntoView();
  };

  const cambiarRespuesta = () => {
    guardarRespuesta(invitado, null);
    setRespuesta(null);
    setAsistencia("");
  };

  if (respuesta) {
    const si = respuesta.asiste;
    return (
      <section id="rsvp" className="min-h-screen bg-wedding-cream flex items-center justify-center relative overflow-hidden">
        <div className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <h2 className="font-script text-5xl md:text-6xl lg:text-7xl text-foreground mb-8 text-center opacity-0 animate-[fade-in_0.8s_ease-out_0.2s_forwards]">
            {si ? rsvp.graciasTitulo : rsvp.noAsistiraTitulo}
          </h2>
          <div className="space-y-6 max-w-2xl text-center opacity-0 animate-[fade-in_0.8s_ease-out_0.5s_forwards]">
            <p className="text-foreground/90 text-lg md:text-xl leading-relaxed">
              {si ? rsvp.graciasDesc1 : rsvp.noAsistiraDesc1}
            </p>
            <p className="text-foreground/90 text-lg md:text-xl leading-relaxed">
              {si ? rsvp.graciasDesc2 : rsvp.noAsistiraDesc2}
            </p>
            {si && (
              <p className="text-muted-foreground text-base md:text-lg">
                Te esperamos el {evento.fechaTexto} en {evento.detalles.lugar}.
              </p>
            )}
          </div>
          <p className="text-muted-foreground font-script text-3xl md:text-4xl mt-10 opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards]">
            {evento.novios.novia} &amp; {evento.novios.novio}
          </p>

          <div className="mt-12 flex flex-col items-center gap-6 opacity-0 animate-[fade-in_0.8s_ease-out_1.1s_forwards]">
            {si && (
              <button
                onClick={descargarCalendario}
                className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-4 h-10 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <CalendarPlus className="w-5 h-5" />
                Agregar al calendario
              </button>
            )}
            {si && <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">{rsvp.notaCambio}</p>}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm">
              <a
                href={urlWhatsApp(rsvp.whatsappNovios, mensajeConfirmacion(respuesta, invitado))}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wedding-accent underline underline-offset-4 hover:text-wedding-accent/80"
              >
                ¿No se abrió WhatsApp? Envía tu respuesta aquí
              </a>
              <button
                onClick={cambiarRespuesta}
                className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Cambiar respuesta
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="pt-20 pb-6 md:pt-32 md:pb-8 bg-wedding-cream">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <p className="text-wedding-accent tracking-[0.3em] uppercase text-sm mb-4">{rsvp.subtitulo}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-wedding-olive mb-6">{rsvp.titulo}</h2>
          <Ornamento className="mb-6" />
          <p className="text-wedding-text/70">{rsvp.fechaLimite}</p>
        </div>

        <form onSubmit={enviar} className="bg-white rounded-2xl p-8 md:p-12 shadow-lg space-y-6">
          <div className="space-y-2">
            <label htmlFor="nombre" className="text-sm font-medium text-wedding-text">
              Nombre completo *
            </label>
            <input
              id="nombre"
              required
              value={nombre}
              disabled={!!invitado}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre completo"
              className={estiloCampo}
            />
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-wedding-text mb-3">¿Nos acompañarás? *</legend>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              {(
                [
                  ["si", "Con gusto asistiré"],
                  ["no", "Lamentablemente no podré"],
                ] as const
              ).map(([valor, etiqueta]) => (
                <label key={valor} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="asistencia"
                    value={valor}
                    required
                    checked={asistencia === valor}
                    onChange={() => setAsistencia(valor)}
                    className="w-4 h-4 accent-[hsl(var(--wedding-accent))]"
                  />
                  {etiqueta}
                </label>
              ))}
            </div>
          </fieldset>

          {asistencia === "si" && (
            <div className="space-y-2 animate-fade-in">
              <label htmlFor="personas" className="text-sm font-medium text-wedding-text">
                {invitado ? "¿Cuántos pases utilizarán? *" : "¿Cuántas personas asistirán? *"}
              </label>
              <select
                id="personas"
                value={personas}
                onChange={(e) => setPersonas(Number(e.target.value))}
                className={estiloCampo}
              >
                {Array.from({ length: maxPersonas }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {invitado ? `${n} de ${textoPases(invitado.pases)}` : n === 1 ? "1 persona" : `${n} personas`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-md bg-wedding-olive text-white h-12 px-4 text-sm tracking-[0.08em] uppercase hover:bg-wedding-olive/90 transition-colors"
          >
            <Send className="w-5 h-5 mr-2" />
            Confirmar por WhatsApp
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Se abrirá WhatsApp con tu respuesta lista para enviarnos.
          </p>
        </form>
      </div>
    </section>
  );
}
