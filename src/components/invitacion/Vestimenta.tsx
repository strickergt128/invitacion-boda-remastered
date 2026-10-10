import { useState } from "react";
import { Expand } from "lucide-react";
import { evento } from "../../data/evento";
import Lightbox from "./Lightbox";
import Revelar from "./Revelar";
import VideoPerezoso from "./VideoPerezoso";

type Video = (typeof evento.vestimenta.videos)[number];

/**
 * Las ilustraciones son muy anchas (2:1 y ~2.85:1): a lo ancho de un celular quedarían diminutas.
 * En móvil van a una altura cómoda dentro de una franja que se desliza de lado; en escritorio, a todo el ancho.
 */
function Franja({ video, onAmpliar }: { video: Video; onAmpliar: () => void }) {
  const [deslizado, setDeslizado] = useState(false);

  return (
    <figure>
      <figcaption className="flex items-center justify-between px-5 md:px-0 mb-3">
        <span className="font-script text-3xl text-boda-cafe">{video.titulo}</span>
        <span
          className={`md:hidden text-[11px] tracking-[0.25em] uppercase text-boda-terracota transition-opacity duration-300 ${
            deslizado ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden="true"
        >
          Desliza →
        </span>
      </figcaption>

      <div
        className="overflow-x-auto md:overflow-visible sin-barra px-5 md:px-0"
        onScroll={(e) => !deslizado && e.currentTarget.scrollLeft > 12 && setDeslizado(true)}
      >
        <div
          className="relative h-[280px] md:h-auto md:w-full rounded-xl overflow-hidden shadow-lg shadow-boda-cafe/10 bg-boda-marfil"
          style={{ aspectRatio: String(video.proporcion) }}
        >
          <VideoPerezoso
            fuentes={[
              { src: video.webm, tipo: "video/webm" },
              { src: video.mp4, tipo: "video/mp4" },
            ]}
            poster={video.poster}
            alt={`Ejemplos de vestimenta: ${video.titulo.toLowerCase()}`}
            className="absolute inset-0"
          />
          <button
            onClick={onAmpliar}
            aria-label={`Ver en grande: ${video.titulo}`}
            className="presionable absolute bottom-3 right-3 w-10 h-10 rounded-full bg-boda-cafe/70 text-white flex items-center justify-center backdrop-blur-sm hover:bg-boda-cafe"
          >
            <Expand className="w-4 h-4" />
          </button>
        </div>
      </div>
    </figure>
  );
}

export default function Vestimenta() {
  const { vestimenta } = evento;
  const [ampliada, setAmpliada] = useState<number | null>(null);
  const imagenesHD = vestimenta.videos.map((v) => ({ src: v.hd, alt: `Vestimenta: ${v.titulo}` }));

  return (
    <section id="vestimenta" className="bg-boda-marfil py-20 md:py-28 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center px-5 mb-10">
          <Revelar>
            <p className="text-[11px] tracking-[0.4em] uppercase text-boda-terracota mb-2">{vestimenta.titulo}</p>
          </Revelar>
          <Revelar retraso={60}>
            <h2 className="font-script text-5xl md:text-6xl text-boda-cafe mb-6">{vestimenta.tipo} ✨</h2>
          </Revelar>
          <div className="max-w-xl mx-auto space-y-3">
            {vestimenta.texto.map((p, i) => (
              <Revelar key={i} retraso={120 + i * 60}>
                <p className="font-serif text-xl leading-relaxed text-boda-texto/80">{p}</p>
              </Revelar>
            ))}
          </div>
        </div>

        {/* Colores reservados */}
        <Revelar className="flex justify-center gap-6 md:gap-10 px-5 mb-14">
          {vestimenta.reservados.map((c) => (
            <div key={c.etiqueta} className="flex flex-col items-center text-center w-24">
              <span
                className="w-14 h-14 rounded-full shadow-inner border border-boda-cafe/15 mb-2"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-sm font-medium text-boda-texto">{c.etiqueta}</span>
              <span className="text-[11px] leading-tight text-boda-texto/60 mt-1">{c.nota}</span>
            </div>
          ))}
        </Revelar>

        <div className="space-y-10 md:px-5">
          {vestimenta.videos.map((v, i) => (
            <Revelar key={v.titulo} retraso={i * 80}>
              <Franja video={v} onAmpliar={() => setAmpliada(i)} />
            </Revelar>
          ))}
        </div>
      </div>

      <Lightbox imagenes={imagenesHD} indice={ampliada} onCambiar={setAmpliada} />
    </section>
  );
}
