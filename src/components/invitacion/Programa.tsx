import { DoorOpen, Heart, Moon, Music, PartyPopper, UtensilsCrossed, Wine, type LucideIcon } from "lucide-react";
import { evento } from "../../data/evento";
import { useAparecer } from "./useAparecer";

const iconos: Record<string, LucideIcon> = {
  llegada: DoorOpen,
  ceremonia: Heart,
  coctel: Wine,
  cena: UtensilsCrossed,
  baile: Music,
  fiesta: PartyPopper,
  fin: Moon,
};

export default function Programa() {
  const { programa } = evento;
  const columnas = programa.eventos.length;
  const { ref, visible } = useAparecer<HTMLDivElement>(0.15);
  const aparecer = (i: number) => ({
    className: `transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`,
    style: { transitionDelay: `${i * 100}ms` },
  });

  return (
    <section className="md:py-24 bg-wedding-olive py-0">
      <div className="max-w-5xl mx-auto px-4 py-[40px]">
        <div className="text-center mb-16">
          <h2 className="font-script text-5xl md:text-6xl text-wedding-gold mb-2">{programa.titulo}</h2>
          <p className="text-white/70 tracking-wide">{programa.subtitulo}</p>
        </div>

        <div ref={ref} className="relative">
          {/* Escritorio: línea horizontal */}
          <div className="hidden md:block">
            <div className="absolute top-16 left-0 right-0 h-px bg-white/20" />
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columnas}, minmax(0, 1fr))` }}>
              {programa.eventos.map((ev, i) => {
                const Icono = iconos[ev.icono] ?? Heart;
                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center text-center group ${aparecer(i).className}`}
                    style={aparecer(i).style}
                  >
                    <div className="bg-wedding-gold text-wedding-olive px-3 py-1.5 rounded-full text-sm font-medium mb-4 group-hover:bg-wedding-accent transition-colors duration-300">
                      {ev.hora}
                    </div>
                    <div className="w-14 h-14 rounded-full bg-wedding-olive border-2 border-white/30 flex items-center justify-center text-wedding-gold mb-4 shadow-sm group-hover:border-wedding-gold group-hover:scale-110 transition-all duration-300 z-10">
                      <Icono className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-base lg:text-lg text-white mb-1 leading-tight">{ev.titulo}</h3>
                    <p className="text-white/60 text-xs leading-relaxed px-1">{ev.descripcion}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Móvil: línea vertical */}
          <div className="md:hidden relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/20" />
            <div className="space-y-6">
              {programa.eventos.map((ev, i) => {
                const Icono = iconos[ev.icono] ?? Heart;
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-4 pl-1 ${aparecer(i).className}`}
                    style={aparecer(i).style}
                  >
                    <div className="w-11 h-11 rounded-full bg-wedding-olive border-2 border-white/30 flex items-center justify-center text-wedding-gold flex-shrink-0 shadow-sm z-10">
                      <Icono className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-baseline gap-3 mb-0.5">
                        <span className="bg-wedding-gold text-wedding-olive px-2 py-0.5 rounded text-xs font-medium">
                          {ev.hora}
                        </span>
                        <h3 className="font-serif text-lg text-white">{ev.titulo}</h3>
                      </div>
                      <p className="text-white/60 text-sm">{ev.descripcion}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
