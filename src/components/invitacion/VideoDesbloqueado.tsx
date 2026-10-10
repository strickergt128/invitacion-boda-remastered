import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cargarFuentes, obtenerVideo, pausar, reproducirSiSePuede, type FuenteVideo } from "../../lib/video";

type Props = {
  fuentes: FuenteVideo[];
  /** Clases del <video> (posición, tamaño, object-fit…). */
  className?: string;
  /** Se muestra solo cuando de verdad corre: un video pausado sin cuadro decodificado se ve negro en iOS. */
  visible: boolean;
  /** Si debe estar reproduciéndose ahora (p. ej. está en pantalla). */
  reproducir: boolean;
  loop?: boolean;
  onPlaying?: () => void;
  onEnded?: () => void;
  onError?: () => void;
  onTimeUpdate?: (video: HTMLVideoElement) => void;
};

/**
 * Coloca en la página el <video> compartido de `lib/video.ts`, que ya fue desbloqueado con el
 * primer toque del invitado. Así se reproduce también en iPhone con modo de bajo consumo.
 */
export default function VideoDesbloqueado({ fuentes, className = "", visible, reproducir, loop = true, ...eventos }: Props) {
  const contenedor = useRef<HTMLSpanElement>(null);
  const [video] = useState(() => obtenerVideo(fuentes));
  // Los manejadores cambian en cada render; se leen siempre los últimos
  const manejadores = useRef(eventos);
  manejadores.current = eventos;

  useLayoutEffect(() => {
    video.loop = loop;
    // Si se vuelve a mostrar un video de una sola pasada (p. ej. la celebración), empieza de nuevo
    if (!loop && video.currentTime > 0) video.currentTime = 0;
    contenedor.current?.appendChild(video);
    const recienCargado = cargarFuentes(video, fuentes);

    const alCorrer = () => manejadores.current.onPlaying?.();
    const alTerminar = () => manejadores.current.onEnded?.();
    const alFallar = () => manejadores.current.onError?.();
    const alAvanzar = () => manejadores.current.onTimeUpdate?.(video);
    video.addEventListener("playing", alCorrer);
    video.addEventListener("ended", alTerminar);
    video.addEventListener("error", alFallar);
    video.addEventListener("timeupdate", alAvanzar);
    // El error de un <source> no llega al <video>: se escucha en la última fuente
    const ultima = video.querySelector("source:last-of-type");
    ultima?.addEventListener("error", alFallar);
    // Si ya había fallado en una visita anterior, no habrá un nuevo evento: se avisa ahora.
    // (Recién cargado no se revisa: el navegador pasa un instante por "sin fuente" mientras la elige.)
    if (!recienCargado && (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE)) {
      queueMicrotask(alFallar);
    }

    return () => {
      video.removeEventListener("playing", alCorrer);
      video.removeEventListener("ended", alTerminar);
      video.removeEventListener("error", alFallar);
      video.removeEventListener("timeupdate", alAvanzar);
      ultima?.removeEventListener("error", alFallar);
      pausar(video);
      video.remove();
    };
    // Las fuentes de un mismo video no cambian, por eso no son dependencia
  }, [video, loop]);

  useEffect(() => {
    video.className = className;
    video.style.opacity = visible ? "1" : "0";
  }, [video, className, visible]);

  useEffect(() => {
    if (reproducir) reproducirSiSePuede(video);
    else pausar(video);
  }, [video, reproducir]);

  // display: contents → el <video> se posiciona respecto al contenedor real del componente padre
  return <span ref={contenedor} className="contents" />;
}
