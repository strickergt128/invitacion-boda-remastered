import { useState } from "react";
import { evento } from "../../data/evento";
import { media } from "../../lib/media";

export default function Hero({ cargarVideo }: { cargarVideo: boolean }) {
  const [videoFalla, setVideoFalla] = useState(false);
  const [videoListo, setVideoListo] = useState(false);

  const irARsvp = () => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-8 px-6 overflow-hidden bg-background">
      <div className="absolute inset-0 w-full h-full">
        {videoFalla ? (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--wedding-cream))_0%,_#f6f4f2_55%,_hsl(var(--wedding-paper))_100%)]" />
        ) : (
          <>
            {/* Primer cuadro del video: se ve mientras el video carga */}
            <img
              src={media.heroPoster}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            {cargarVideo && (
              <video
                src={media.hero}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onLoadedData={() => setVideoListo(true)}
                onError={() => setVideoFalla(true)}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: videoListo ? 1 : 0 }}
              />
            )}
          </>
        )}
        <div className="absolute inset-0 bg-background/20" />
      </div>

      <div className="text-center z-10 animate-fade-in my-[230px]">
        <p className="text-xs md:text-sm tracking-[0.3em] uppercase mb-3 text-wedding-olive">{evento.hero.titulo}</p>
        <h1 className="font-script text-5xl md:text-6xl lg:text-7xl mb-2 text-wedding-olive">
          {evento.novios.novia} <span className="mx-2">&amp;</span> {evento.novios.novio}
        </h1>
        <div className="flex items-center justify-center gap-4 md:my-8 my-[5px]">
          <span className="h-px w-12 md:w-20 bg-wedding-olive" />
          <span className="text-amber-500 text-lg drop-shadow-md">✦</span>
          <span className="h-px w-12 md:w-20 bg-wedding-olive" />
        </div>
        <p className="text-xs md:text-sm tracking-[0.2em] uppercase text-wedding-olive my-0 py-[6px]">
          {evento.fechaTexto}
        </p>
      </div>

      <div className="flex-1" />

      <div className="text-center z-10 animate-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>
        <button
          onClick={irARsvp}
          className="text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          {evento.hero.confirmar}
        </button>
        <div className="mt-4 flex justify-center">
          <svg
            className="w-4 h-4 text-muted-foreground animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
