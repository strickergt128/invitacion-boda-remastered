import { evento } from "../../data/evento";
import Revelar from "./Revelar";

export default function Historia() {
  return (
    <section id="historia" className="bg-boda-marfil py-20 md:py-28 px-5 overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-20 md:space-y-28">
        {evento.historia.map((bloque, i) => {
          const invertido = i % 2 === 1;
          return (
            <article
              key={bloque.titulo}
              className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center ${invertido ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <Revelar variante="imagen" className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-xl shadow-boda-cafe/10">
                <img src={bloque.foto} alt={bloque.alt} loading="lazy" className="w-full h-full object-cover" />
              </Revelar>

              <div className={`text-center ${invertido ? "md:text-right" : "md:text-left"}`}>
                <Revelar>
                  <p className="text-[11px] tracking-[0.4em] uppercase text-boda-terracota mb-2">
                    {i < 2 ? "En sus palabras" : "Juntos"}
                  </p>
                </Revelar>
                <Revelar retraso={60}>
                  <h2 className="font-script text-5xl md:text-6xl text-boda-cafe mb-6">{bloque.titulo}</h2>
                </Revelar>
                {bloque.texto.map((parrafo, j) => (
                  <Revelar key={j} retraso={120 + j * 60}>
                    <p className="font-serif italic text-xl md:text-2xl leading-relaxed text-boda-texto/80 mb-4">{parrafo}</p>
                  </Revelar>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
