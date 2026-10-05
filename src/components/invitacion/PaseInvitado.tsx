import type { Invitado } from "../../lib/invitados";
import { useAparecer } from "./useAparecer";

export default function PaseInvitado({ invitado }: { invitado: Invitado }) {
  const { ref, visible } = useAparecer<HTMLDivElement>();
  const plural = invitado.pases !== 1;

  return (
    <section className="bg-wedding-cream py-16 md:py-24 px-6">
      <div
        ref={ref}
        className={`max-w-md mx-auto text-center transition-all duration-1000 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-wedding-accent tracking-[0.3em] uppercase text-xs md:text-sm mb-4">Con mucho cariño para</p>
        <h2 className="font-script text-5xl md:text-6xl text-wedding-olive mb-6 leading-tight">{invitado.nombre}</h2>

        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="h-px w-12 md:w-20 bg-wedding-olive/40" />
          <span className="text-amber-500 text-lg">✦</span>
          <span className="h-px w-12 md:w-20 bg-wedding-olive/40" />
        </div>

        <p className="font-serif italic text-xl text-wedding-text/70 mb-6">Hemos reservado en su honor</p>

        <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border border-wedding-accent/40 bg-white/60 shadow-sm">
          <span className="font-serif text-6xl text-wedding-olive leading-none">{invitado.pases}</span>
          <span className="text-xs tracking-[0.3em] uppercase text-wedding-accent mt-2">{plural ? "Pases" : "Pase"}</span>
        </div>

        <p className="text-wedding-text/60 text-sm mt-8 leading-relaxed">
          {plural
            ? "Nos encantaría compartir este día con ustedes. Por favor confirma cuántos pases utilizarán."
            : "Nos encantaría compartir este día contigo. Por favor confirma tu asistencia."}
        </p>
      </div>
    </section>
  );
}
