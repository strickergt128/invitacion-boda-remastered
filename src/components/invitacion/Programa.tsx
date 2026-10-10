import { Church, DoorOpen, Heart, Moon, Music, UtensilsCrossed, Wine, type LucideIcon } from "lucide-react";
import { evento } from "../../data/evento";
import Revelar from "./Revelar";

const iconos: Record<string, LucideIcon> = {
  ceremonia: Church,
  recepcion: DoorOpen,
  bienvenida: Wine,
  cena: UtensilsCrossed,
  fiesta: Music,
  fin: Moon,
};

export default function Programa() {
  const { itinerario } = evento;
  const columnas = itinerario.eventos.length;

  return (
    <section className="bg-boda-cafe text-white py-20 md:py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <Revelar>
            <p className="text-[11px] tracking-[0.4em] uppercase text-boda-arcilla mb-2">26 de diciembre</p>
          </Revelar>
          <Revelar retraso={60}>
            <h2 className="font-script text-5xl md:text-6xl text-boda-arena">{itinerario.titulo}</h2>
          </Revelar>
        </div>

        {/* Escritorio: línea horizontal */}
        <div className="hidden md:block relative">
          <div className="absolute top-[4.25rem] left-0 right-0 h-px bg-white/20" />
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columnas}, minmax(0, 1fr))` }}>
            {itinerario.eventos.map((ev, i) => {
              const Icono = iconos[ev.icono] ?? Heart;
              return (
                <Revelar key={ev.hora} retraso={i * 60} className="flex flex-col items-center text-center">
                  <span className="bg-boda-terracota text-white px-3 py-1 rounded-full text-sm font-medium tabular-nums mb-4">
                    {ev.hora}
                  </span>
                  <span className="relative z-10 w-14 h-14 rounded-full bg-boda-cafe border border-boda-arcilla/60 flex items-center justify-center text-boda-arcilla mb-4">
                    <Icono className="w-5 h-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-serif text-lg leading-tight mb-1">{ev.titulo}</h3>
                  <p className="text-white/60 text-xs leading-relaxed px-1">{ev.descripcion}</p>
                </Revelar>
              );
            })}
          </div>
        </div>

        {/* Celular: línea vertical */}
        <ol className="md:hidden relative space-y-7">
          <span className="absolute left-[1.375rem] top-2 bottom-2 w-px bg-white/20" aria-hidden="true" />
          {itinerario.eventos.map((ev, i) => {
            const Icono = iconos[ev.icono] ?? Heart;
            return (
              <Revelar key={ev.hora} como="li" retraso={i * 60} className="relative flex items-start gap-4">
                <span className="relative z-10 w-11 h-11 shrink-0 rounded-full bg-boda-cafe border border-boda-arcilla/60 flex items-center justify-center text-boda-arcilla">
                  <Icono className="w-5 h-5" strokeWidth={1.5} />
                </span>
                <div className="pt-1">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="bg-boda-terracota text-white px-2 py-0.5 rounded text-xs font-medium tabular-nums">{ev.hora}</span>
                    <h3 className="font-serif text-xl leading-tight">{ev.titulo}</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{ev.descripcion}</p>
                </div>
              </Revelar>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
