import { evento } from "../data/evento";
import type { FuenteVideo } from "./video";

// Archivos en public/media/
export const media = {
  intro: "/media/intro2.mp4",
  // Primer cuadro del intro: se muestra al instante mientras el video se descarga
  introPoster: "/media/intro2.jpg",
  hero: {
    webm: "/media/portada-boda.webm",
    mp4: "/media/portada-boda.mp4",
    poster: "/media/portada-boda-poster.jpg",
  },
  fondoCuentaRegresiva: "/media/pareja5.jpeg",
  celebracion: "/media/celebracion.mp4",
  musica: "/media/musica.mp3",
};

type Lugar = (typeof evento.lugares)[number];
type VideoVestimenta = (typeof evento.vestimenta.videos)[number];

// Fuentes de cada video decorativo. Se arman siempre con estas funciones para que el componente
// y el desbloqueo de iPhone (lib/video.ts) hablen exactamente del mismo <video>.
export const fuentesVideo = {
  hero: [
    { src: media.hero.webm, tipo: "video/webm" },
    { src: media.hero.mp4, tipo: "video/mp4" },
  ] as FuenteVideo[],
  celebracion: [{ src: media.celebracion, tipo: "video/mp4" }] as FuenteVideo[],
  lugar: (l: Lugar): FuenteVideo[] => [{ src: l.video, tipo: "video/mp4" }],
  vestimenta: (v: VideoVestimenta): FuenteVideo[] => [
    { src: v.webm, tipo: "video/webm" },
    { src: v.mp4, tipo: "video/mp4" },
  ],
};

/** Todos los videos decorativos de la invitación (se desbloquean juntos con el primer toque). */
export const videosDecorativos: FuenteVideo[][] = [
  fuentesVideo.hero,
  ...evento.lugares.map(fuentesVideo.lugar),
  ...evento.vestimenta.videos.map(fuentesVideo.vestimenta),
  fuentesVideo.celebracion,
];
