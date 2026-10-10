import { useEffect, useState } from "react";
import type { FuenteVideo } from "../../lib/video";
import ImagenSuave from "./ImagenSuave";
import VideoDesbloqueado from "./VideoDesbloqueado";
import { useAparecer } from "./useAparecer";

type Props = {
  /** Usar `fuentesVideo` de lib/media para que coincida con el desbloqueo de iPhone. */
  fuentes: FuenteVideo[];
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
  const [listo, setListo] = useState(false);
  const [enPantalla, setEnPantalla] = useState(false);

  // Corre solo mientras se ve; fuera de pantalla se pausa
  useEffect(() => {
    const el = cerca.ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setEnPantalla(e.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [cerca.ref]);

  return (
    <div ref={cerca.ref} className={className}>
      <ImagenSuave src={poster} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      {cerca.visible && (
        // Video ya desbloqueado con el primer toque: corre también en iPhone con bajo consumo
        <VideoDesbloqueado
          fuentes={fuentes}
          reproducir={enPantalla}
          visible={listo}
          onPlaying={() => setListo(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out"
        />
      )}
    </div>
  );
}
