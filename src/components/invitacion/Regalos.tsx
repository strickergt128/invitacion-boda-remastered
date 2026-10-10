import { Gift } from "lucide-react";
import { evento } from "../../data/evento";
import { confetiRegalo } from "../../lib/confeti";
import Revelar from "./Revelar";

export default function Regalos() {
  const { regalos } = evento;

  return (
    <section id="regalos" className="bg-boda-terracota text-white py-20 md:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-3 md:inset-5 border border-white/20 rounded-sm pointer-events-none" />

      <div className="relative max-w-xl mx-auto text-center">
        <Revelar>
          <span className="inline-flex w-14 h-14 rounded-full bg-white/10 border border-white/30 items-center justify-center mb-5">
            <Gift className="w-6 h-6" strokeWidth={1.5} />
          </span>
        </Revelar>
        <Revelar retraso={60}>
          <h2 className="font-script text-5xl md:text-6xl mb-8">{regalos.titulo}</h2>
        </Revelar>

        {regalos.texto.map((p, i) => (
          <Revelar key={i} retraso={120 + i * 60}>
            <p className={`leading-relaxed mb-5 ${i === 0 ? "font-serif italic text-2xl" : "text-white/85"}`}>{p}</p>
          </Revelar>
        ))}

        <Revelar retraso={240}>
          <a
            href={regalos.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={confetiRegalo}
            className="presionable inline-flex items-center justify-center gap-2 h-12 px-7 my-4 rounded-full bg-white text-boda-oxido font-medium shadow-lg shadow-black/10 hover:bg-boda-crema"
          >
            <Gift className="w-5 h-5" />
            {regalos.boton}
          </a>
        </Revelar>

        <Revelar retraso={300}>
          <p className="text-white/80 leading-relaxed mt-6">{regalos.agradecimiento}</p>
        </Revelar>
        <Revelar retraso={360}>
          <p className="font-script text-4xl mt-6">{regalos.cierre}</p>
        </Revelar>
      </div>
    </section>
  );
}
