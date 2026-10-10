/**
 * Deja un <video> listo para reproducirse solo y en línea en iPhone.
 *
 * React asigna la propiedad `muted` pero no escribe el atributo en el HTML, y algunas
 * versiones de iOS revisan el atributo para permitir la reproducción automática.
 * Se usa como `ref` callback: <video ref={prepararVideoSilencioso} />
 */
export function prepararVideoSilencioso(video: HTMLVideoElement | null) {
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
}
