import type { Invitado } from "../../lib/invitados";
import Revelar from "./Revelar";

export default function PaseInvitado({ invitado }: { invitado: Invitado }) {
  const plural = invitado.pases !== 1;

  return (
    <section className="bg-boda-terracota text-white py-16 md:py-20 px-6 relative overflow-hidden">
      {/* Marco fino tipo tarjeta */}
      <div className="absolute inset-3 md:inset-5 border border-white/25 rounded-sm pointer-events-none" />

      <div className="relative max-w-md mx-auto text-center">
        <Revelar>
          <p className="tracking-[0.3em] uppercase text-[11px] text-white/75 mb-4">Con mucho cariño para</p>
        </Revelar>
        <Revelar retraso={60}>
          <h2 className="font-script text-5xl md:text-6xl leading-tight mb-6">{invitado.nombre}</h2>
        </Revelar>
        <Revelar retraso={120}>
          <p className="font-serif italic text-xl text-white/85 mb-6">Hemos reservado en su honor</p>
        </Revelar>

        <Revelar retraso={180} className="inline-block">
          <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full bg-white/10 border border-white/40 backdrop-blur-sm">
            <span className="font-serif text-6xl leading-none tabular-nums">{invitado.pases}</span>
            <span className="text-[11px] tracking-[0.3em] uppercase text-white/80 mt-2">{plural ? "Pases" : "Pase"}</span>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
