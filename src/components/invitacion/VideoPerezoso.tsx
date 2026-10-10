import { useEffect, useRef, useState } from "react";
import { prepararVideoSilencioso } from "../../lib/video";
import { useAparecer } from "./useAparecer";

type Props = {
  fuentes: { src: string; tipo: "video/webm" | "video/mp4" }[];
  poster: string;
  alt: string;
  /** Debe posicionar el contenedor (relative o absolute); por defecto "relative". */
  className?: string;
};

/**
 * Video decorativo en loop que no compite con lo importante:
 * - muestra su primer cuadro (poster) de inmediato,
 * - descarga el video solo cuando el invitado se acerca,
 * - y se pausa fuera de pantalla para ahorrar batería y datos.
 */
export default function VideoPerezoso({ fuentes, poster, alt, className = "relative" }: Props) {
  const cerca = useAparecer<HTMLDivElement>(0, "600px");
  const video = useRef<HTMLVideoElement | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    observer.observe(v);
    return () => observer.disconnect();
  }, [cerca.visible]);

  return (
    <div ref={cerca.ref} className={className}>
      <img src={poster} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      {cerca.visible && (
        <video
          ref={(el) => {
            video.current = el;
            prepararVideoSilencioso(el);
          }}
          muted
          loop
          playsInline
          preload="auto"
          // Se muestra cuando de verdad corre: un video pausado sin cuadro decodificado se ve negro en iOS
          onPlaying={() => setListo(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out"
          style={{ opacity: listo ? 1 : 0 }}
        >
          {fuentes.map((f) => (
            <source key={f.src} src={f.src} type={f.tipo} />
          ))}
        </video>
      )}
    </div>
  );
}
