import { CalendarPlus, Church, Clock, ExternalLink, MapPin } from "lucide-react";
import { evento } from "../../data/evento";
import { descargarCalendario } from "../../lib/calendario";
import { useAparecer } from "./useAparecer";

const botonContorno =
  "inline-flex items-center justify-center rounded-md border border-wedding-accent/30 text-wedding-accent hover:bg-wedding-accent/10 transition-colors px-4 h-9 text-xs md:text-sm w-full sm:w-auto";

export default function Detalles() {
  const { detalles } = evento;
  // El mapa de Google pesa bastante: se carga solo cuando el invitado se acerca
  const cerca = useAparecer<HTMLDivElement>(0, "600px");
  const mapaSrc = `https://maps.google.com/maps?q=${encodeURIComponent(detalles.mapaQuery)}&t=&z=16&ie=UTF8&iwloc=B&output=embed`;

  return (
    <section id="detalles" className="py-12 md:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-8 md:mb-16">
          <p className="text-wedding-accent tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-sm mb-3 md:mb-4">
            {detalles.subtitulo}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-wedding-olive mb-4 md:mb-6">{detalles.titulo}</h2>
          <p className="text-wedding-text/70 max-w-2xl mx-auto text-sm md:text-base px-2">{detalles.descripcion}</p>
        </div>

        <div className="mb-8 md:mb-16">
          <div className="bg-wedding-cream rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-wedding-accent/10 rounded-full mb-4 md:mb-6">
              <Church className="w-6 h-6 md:w-8 md:h-8 text-wedding-accent" />
            </div>
            <h3 className="font-serif text-xl md:text-2xl text-wedding-text mb-3 md:mb-4">{detalles.ceremonia}</h3>
            <div className="space-y-2 md:space-y-3 text-wedding-text/70 mb-4 md:mb-6 text-sm md:text-base">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>
                  {evento.fechaTexto} · {detalles.hora}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-center">{detalles.lugar}</span>
              </div>
              <p className="text-xs md:text-sm">{detalles.direccion}</p>
              <p className="text-xs md:text-sm">{detalles.ciudad}</p>
            </div>

            <div
              ref={cerca.ref}
              className="aspect-video rounded-lg md:rounded-xl overflow-hidden shadow-lg mb-4 md:mb-6 bg-wedding-paper"
            >
              {cerca.visible && (
                <iframe
                  src={mapaSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${detalles.lugar} - ${detalles.direccion}`}
                  className="w-full h-full"
                />
              )}
            </div>

            <p className="text-wedding-text/60 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 px-2">
              {detalles.ceremoniaDesc}
            </p>

            <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row justify-center">
              <a href={detalles.mapaLink} target="_blank" rel="noopener noreferrer" className={botonContorno}>
                <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                Abrir en Maps
              </a>
              <button onClick={descargarCalendario} className={botonContorno}>
                <CalendarPlus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                Agregar al calendario
              </button>
            </div>
          </div>
        </div>

        <div className="text-center bg-wedding-olive rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8">
          <h3 className="font-serif text-xl md:text-2xl text-wedding-gold mb-3 md:mb-4">{detalles.vestimenta}</h3>
          <p className="text-wedding-gold mb-2 text-sm md:text-base">{detalles.vestimentaTipo}</p>
          <p className="text-wedding-gold/70 text-xs md:text-sm px-2">{detalles.vestimentaDesc}</p>
        </div>
      </div>
    </section>
  );
}
