import { useRef, useState } from "react";
import { evento } from "../../data/evento";
import { fuentesVideo, media } from "../../lib/media";
import VideoDesbloqueado from "./VideoDesbloqueado";

type Props = {
  /** El video espera a que el intro se descargue, para no competir por la red. */
  cargarVideo: boolean;
  /** Se vuelve true cuando el intro se cierra: entonces entra el texto. */
  listo: boolean;
};

export default function Hero({ cargarVideo, listo }: Props) {
  const [videoListo, setVideoListo] = useState(false);
  const [videoFalla, setVideoFalla] = useState(false);

  const seccion = useRef<HTMLElement>(null);
  const irASiguiente = () => seccion.current?.nextElementSibling?.scrollIntoView({ behavior: "smooth" });

  // Poco texto: la foto es la protagonista. Entra escalonado al abrirse el sobre.
  const entrada = `transition-[opacity,transform] duration-[900ms] ease-out-fuerte motion-reduce:transform-none ${
    listo ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
  }`;
  const retraso = (ms: number) => ({ transitionDelay: `${ms}ms` });

  return (
    <section ref={seccion} className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden bg-boda-cafe">
      <div className="absolute inset-0">
        {/* Foto fija mientras el video carga (es su primer cuadro).
            La pareja está en la parte baja del encuadre vertical: en pantallas anchas se enfoca ahí. */}
        <img
          src={media.hero.poster}
          alt="Mariana y Giovanni caminando en la playa al atardecer"
          className="absolute inset-0 w-full h-full object-cover object-[50%_80%]"
        />
        {cargarVideo && !videoFalla && (
          // Video ya desbloqueado con el toque del sobre: corre también en iPhone con bajo consumo
          <VideoDesbloqueado
            fuentes={fuentesVideo.hero}
            reproducir
            visible={videoListo}
            onPlaying={() => setVideoListo(true)}
            onError={() => setVideoFalla(true)}
            className="absolute inset-0 w-full h-full object-cover object-[50%_80%] transition-opacity duration-700 ease-out"
          />
        )}
        {/* Degradado arriba para leer el texto sobre el cielo, y uno leve abajo para la flecha;
            el centro queda limpio para la pareja */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div
        className="relative z-10 text-center text-white px-6"
        style={{ paddingTop: "calc(3.5rem + env(safe-area-inset-top, 0px))" }}
      >
        <p style={retraso(0)} className={`${entrada} text-[11px] tracking-[0.4em] uppercase text-white/80 mb-3`}>
          Nos casamos
        </p>
        <h1 style={retraso(80)} className={`${entrada} font-script text-6xl md:text-7xl leading-tight drop-shadow-lg`}>
          {evento.novios.novia} <span className="text-boda-arcilla">&amp;</span> {evento.novios.novio}
        </h1>
        <p style={retraso(160)} className={`${entrada} mt-3 text-sm tracking-[0.35em] text-white/90`}>
          {evento.fechaCorta}
        </p>
      </div>

      <div
        className="relative z-10 text-center"
        style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <button
          onClick={irASiguiente}
          aria-label="Ver la invitación"
          style={retraso(320)}
          className={`${entrada} inline-flex flex-col items-center text-white/80`}
        >
          <svg className="w-5 h-5 animate-bounce motion-reduce:animate-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
}
