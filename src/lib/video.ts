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

// ─── Videos desbloqueados para iPhone en modo de bajo consumo ───────────────
//
// En bajo consumo, iOS solo deja reproducir un video si la orden llega durante un toque, y ese
// permiso queda guardado *en ese elemento <video>*. Los videos decorativos (portada, lugares,
// vestimenta, celebración) se montan después, al hacer scroll, cuando ya no hay un toque en curso.
//
// Por eso cada video se crea una sola vez aquí, fuera de React, y se "desbloquea" con el primer
// toque del invitado (pidiendo play() aunque todavía no tenga archivo: no se descarga nada).
// Después los componentes colocan en la página ese mismo elemento ya desbloqueado.

export type FuenteVideo = { src: string; tipo: "video/webm" | "video/mp4" };

const almacen = new Map<string, HTMLVideoElement>();
const clave = (fuentes: FuenteVideo[]) => fuentes.map((f) => f.src).join("|");

/** El <video> de estas fuentes; siempre el mismo elemento para las mismas fuentes. */
export function obtenerVideo(fuentes: FuenteVideo[]): HTMLVideoElement {
  let video = almacen.get(clave(fuentes));
  if (!video) {
    video = document.createElement("video");
    prepararVideoSilencioso(video);
    video.preload = "auto";
    almacen.set(clave(fuentes), video);
  }
  return video;
}

/**
 * Asigna las fuentes la primera vez que el video se va a mostrar (recién entonces se descarga).
 * Devuelve false si ya las tenía de una visita anterior.
 */
export function cargarFuentes(video: HTMLVideoElement, fuentes: FuenteVideo[]): boolean {
  if (video.querySelector("source")) return false;
  for (const f of fuentes) {
    const source = document.createElement("source");
    source.src = f.src;
    source.type = f.tipo;
    video.appendChild(source);
  }
  video.load();
  return true;
}

/** Pide reproducir; si iOS lo bloquea, queda pendiente y arranca con el siguiente toque. */
export function reproducirSiSePuede(video: HTMLVideoElement) {
  video.dataset.quiere = "1";
  video.play().catch(() => {});
}

export function pausar(video: HTMLVideoElement) {
  video.dataset.quiere = "0";
  video.pause();
}

/**
 * Llamar *dentro* de un toque. Desbloquea los videos que aún no lo estén; los que ya debían
 * estar corriendo (y estaban bloqueados) arrancan en ese momento.
 */
export function desbloquearVideos(listas: FuenteVideo[][]) {
  for (const fuentes of listas) {
    const video = obtenerVideo(fuentes);
    if (video.dataset.desbloqueado) continue;
    video.dataset.desbloqueado = "1";
    if (!video.paused) continue;
    video
      .play()
      .then(() => {
        if (video.dataset.quiere !== "1") video.pause();
      })
      // Sin archivo todavía, play() falla: es lo esperado, el permiso igual queda guardado
      .catch(() => {});
  }
}
