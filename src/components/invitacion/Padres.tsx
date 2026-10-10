import { evento } from "../../data/evento";
import Revelar from "./Revelar";

type Padre = { nombre: string; fallecido?: boolean };

function ListaPadres({ padres, alinear, retraso }: { padres: Padre[]; alinear: "left" | "right"; retraso: number }) {
  return (
    <div className={`space-y-3 ${alinear === "left" ? "text-left" : "text-right"}`}>
      {padres.map((p, i) => (
        <Revelar key={p.nombre} retraso={retraso + i * 60}>
          <p className="font-serif text-base sm:text-lg md:text-xl leading-snug text-boda-texto [text-wrap:balance]">
            {p.nombre}
            {p.fallecido && (
              <span className="text-boda-terracota ml-1" title="En memoria" aria-label="(en memoria)">
                †
              </span>
            )}
          </p>
        </Revelar>
      ))}
    </div>
  );
}

export default function Padres() {
  const { padres, novios } = evento;

  return (
    <section id="invitacion" className="bg-boda-crema py-20 md:py-28 px-5">
      <div className="max-w-3xl mx-auto">
        <Revelar className="text-center mb-10 md:mb-14">
          <p className="font-serif italic text-xl md:text-2xl text-boda-oxido">{padres.titulo}</p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="h-px w-12 bg-boda-terracota/40" />
            <span className="text-boda-terracota text-sm">✦</span>
            <span className="h-px w-12 bg-boda-terracota/40" />
          </div>
        </Revelar>

        {/* Novia a la izquierda, novio a la derecha (también en celular) */}
        <div className="grid grid-cols-2 gap-4 md:gap-16">
          <ListaPadres padres={padres.novia} alinear="left" retraso={0} />
          <ListaPadres padres={padres.novio} alinear="right" retraso={120} />
        </div>

        <Revelar className="text-center mt-14 md:mt-20 mb-4">
          <p className="text-[11px] tracking-[0.4em] uppercase text-boda-terracota">{padres.nosotros}</p>
        </Revelar>

        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 md:gap-8">
          <Revelar retraso={60} className="text-right">
            <p className="font-script text-[2.6rem] sm:text-5xl md:text-7xl text-boda-cafe leading-none">{novios.novia}</p>
            <p className="text-[10px] md:text-xs tracking-[0.12em] md:tracking-[0.2em] uppercase text-boda-texto/60 mt-2 [text-wrap:balance]">{novios.noviaCompleto}</p>
          </Revelar>
          <Revelar retraso={120}>
            <span className="block font-script text-3xl md:text-5xl text-boda-terracota pt-1 md:pt-3">&amp;</span>
          </Revelar>
          <Revelar retraso={180} className="text-left">
            <p className="font-script text-[2.6rem] sm:text-5xl md:text-7xl text-boda-cafe leading-none">{novios.novio}</p>
            <p className="text-[10px] md:text-xs tracking-[0.12em] md:tracking-[0.2em] uppercase text-boda-texto/60 mt-2 [text-wrap:balance]">{novios.novioCompleto}</p>
          </Revelar>
        </div>

        <Revelar retraso={240} className="text-center mt-12 md:mt-16">
          <p className="font-serif italic text-2xl md:text-3xl text-boda-oxido leading-snug max-w-md mx-auto">
            {padres.invitacion}
          </p>
        </Revelar>
      </div>
    </section>
  );
}
