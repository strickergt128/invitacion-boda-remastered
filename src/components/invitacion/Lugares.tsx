import { CalendarPlus, Clock, MapPin } from "lucide-react";
import { evento } from "../../data/evento";
import { descargarCalendario } from "../../lib/calendario";
import { fuentesVideo } from "../../lib/media";
import Revelar from "./Revelar";
import VideoPerezoso from "./VideoPerezoso";

const boton =
  "presionable inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full text-sm font-medium";

export default function Lugares() {
  return (
    <section id="lugares" className="bg-boda-crema py-20 md:py-28 px-5">
      <div className="text-center mb-12">
        <Revelar>
          <p className="text-[11px] tracking-[0.4em] uppercase text-boda-terracota mb-2">Dónde</p>
        </Revelar>
        <Revelar retraso={60}>
          <h2 className="font-script text-5xl md:text-6xl text-boda-cafe">Ceremonia y Recepción</h2>
        </Revelar>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10">
        {evento.lugares.map((lugar, i) => (
          <Revelar key={lugar.nombre} retraso={i * 80}>
            <article className="bg-boda-marfil rounded-2xl overflow-hidden shadow-xl shadow-boda-cafe/10 h-full flex flex-col">
              <Revelar variante="imagen" className="relative aspect-video overflow-hidden">
                <VideoPerezoso
                  fuentes={fuentesVideo.lugar(lugar)}
                  poster={lugar.poster}
                  alt={lugar.nombre}
                  className="absolute inset-0"
                />
              </Revelar>

              <div className="p-6 md:p-8 text-center flex-1 flex flex-col">
                <p className="text-[11px] tracking-[0.35em] uppercase text-boda-terracota mb-2">{lugar.tipo}</p>
                <h3 className="font-serif text-3xl text-boda-cafe mb-4">{lugar.nombre}</h3>
                <div className="space-y-1 text-boda-texto/75 mb-5">
                  <p className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4 text-boda-terracota shrink-0" />
                    {lugar.direccion}
                  </p>
                  <p>{lugar.ciudad}</p>
                </div>
                <p className="inline-flex items-center justify-center gap-2 font-serif text-2xl text-boda-oxido mb-6">
                  <Clock className="w-5 h-5" strokeWidth={1.5} />
                  {lugar.hora}
                </p>

                <div className="mt-auto flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={lugar.mapa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${boton} bg-boda-terracota text-white hover:bg-boda-oxido`}
                  >
                    <MapPin className="w-4 h-4" />
                    Ver ubicación
                  </a>
                  {lugar.calendario && (
                    <button
                      onClick={descargarCalendario}
                      className={`${boton} border border-boda-terracota/40 text-boda-terracota hover:bg-boda-terracota/10`}
                    >
                      <CalendarPlus className="w-4 h-4" />
                      Agregar al calendario
                    </button>
                  )}
                </div>
              </div>
            </article>
          </Revelar>
        ))}
      </div>
    </section>
  );
}
