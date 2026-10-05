import { useState } from "react";
import { Heart } from "lucide-react";
import { evento } from "../../data/evento";
import { media } from "../../lib/media";
import Ornamento from "./Ornamento";
import { useAparecer } from "./useAparecer";

type Hito = (typeof evento.historia.hitos)[number];

function HitoItem({ hito, indice }: { hito: Hito; indice: number }) {
  const { ref, visible } = useAparecer<HTMLDivElement>();
  const par = indice % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-8 transition-all duration-700 ease-out ${
        par ? "md:flex-row" : "md:flex-row-reverse"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className={`flex-1 ml-12 md:ml-0 ${par ? "md:text-right md:pr-12" : "md:pl-12"}`}>
        <span className="font-script text-wedding-accent text-3xl">{hito.anio}</span>
        <h3 className="font-script text-3xl text-wedding-text mt-2 mb-3">{hito.titulo}</h3>
        <p className="font-serif italic text-wedding-text/70 leading-relaxed text-lg">{hito.descripcion}</p>
      </div>
      <div
        className={`absolute left-4 md:left-1/2 w-3 h-3 bg-wedding-accent rounded-full -translate-x-1/2 mt-2 transition-transform duration-500 ${
          visible ? "scale-100" : "scale-0"
        }`}
        style={{ transitionDelay: "200ms" }}
      />
      <div className="hidden md:block flex-1" />
    </div>
  );
}

export default function Historia() {
  const final = useAparecer<HTMLDivElement>(0.5);
  const [mostrarPalomas, setMostrarPalomas] = useState(true);
  // La imagen se pide solo cuando el invitado se acerca, para no competir con el intro
  const cerca = useAparecer<HTMLDivElement>(0, "600px");
  const { historia } = evento;

  return (
    <section id="historia" className="md:py-32 bg-wedding-cream py-0">
      <div className="container mx-auto px-4 max-w-4xl bg-[#faf4eb]/[0.76]">
        <div className="text-center mb-16">
          <p className="font-script text-wedding-accent text-2xl mb-4 py-[20px]">{historia.subtitulo}</p>
          <h2 className="font-script text-5xl md:text-6xl text-wedding-olive mb-6">{historia.titulo}</h2>
          <Ornamento />
        </div>

        <div className="relative pb-12">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-2.5 w-px bg-wedding-accent/20 md:-translate-x-1/2" />
          <div className="space-y-12">
            {historia.hitos.map((hito, i) => (
              <HitoItem key={`${hito.anio}-${i}`} hito={hito} indice={i} />
            ))}
          </div>
          <div
            ref={final.ref}
            className={`absolute left-[16px] md:left-1/2 bottom-0 -translate-x-1/2 transition-all duration-700 ${
              final.visible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          >
            <Heart className="w-5 h-5 text-wedding-accent fill-wedding-accent animate-pulse" />
          </div>
        </div>

        {mostrarPalomas && (
          <div ref={cerca.ref} className="mt-16 flex justify-center pb-8">
            {cerca.visible && (
              <img
                src={media.palomas}
                alt="Palomas"
                className="w-80 md:w-[400px] lg:w-[500px] h-auto"
                onError={() => setMostrarPalomas(false)}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
