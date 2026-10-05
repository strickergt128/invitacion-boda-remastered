import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { evento } from "../../data/evento";
import { confetiRegalo } from "../../lib/confeti";

export default function Regalos() {
  const [abierto, setAbierto] = useState(false);
  const [mostrarCuenta, setMostrarCuenta] = useState(false);
  const { regalos } = evento;

  const alternar = () => {
    if (!abierto) confetiRegalo();
    setAbierto(!abierto);
  };

  return (
    <section className="md:py-24 relative overflow-hidden py-[10px]" style={{ backgroundColor: "#FAF5EB" }}>
      <div className="max-w-2xl mx-auto px-4 relative z-10 pb-10 md:pb-0">
        <div className="text-center mb-12">
          <h2 className="font-script text-5xl md:text-6xl text-wedding-olive mb-6 my-[20px]">{regalos.titulo}</h2>
          <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {regalos.descripcion} <br className="hidden md:block" />
            {regalos.descripcion2}
          </p>
        </div>

        <div className="rounded-2xl border-2 shadow-sm overflow-hidden bg-wedding-olive border-wedding-olive">
          <button
            onClick={alternar}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-wedding-sage/20 transition-colors"
            aria-expanded={abierto}
          >
            <span className="font-serif text-lg text-white">{regalos.contribucion}</span>
            <ChevronDown
              className="w-5 h-5 text-white/70 transition-transform duration-300"
              style={{ transform: abierto ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${abierto ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="px-6 pb-6 pt-4 bg-white">
              <p className="text-muted-foreground text-sm leading-relaxed mb-2">{regalos.opcionEfectivo}</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{regalos.opcionTransferencia}</p>
              <div className="text-center">
                {mostrarCuenta ? (
                  <div className="space-y-1">
                    <p className="text-sm text-foreground/80">{regalos.banco}</p>
                    <p className="text-sm text-foreground/80">{regalos.titular}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider pt-2">{regalos.etiquetaCuenta}</p>
                    <p className="font-mono text-sm text-foreground/80 tracking-wide select-all">{regalos.cuenta}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setMostrarCuenta(true)}
                    className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground/60 transition-colors"
                  >
                    {regalos.mostrarCuenta}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
