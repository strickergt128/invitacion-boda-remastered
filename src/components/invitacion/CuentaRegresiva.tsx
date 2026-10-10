import { useEffect, useState } from "react";
import { evento } from "../../data/evento";
import { media } from "../../lib/media";
import ImagenSuave from "./ImagenSuave";
import Revelar from "./Revelar";

const OBJETIVO = new Date(evento.fechaISO).getTime();

function calcular() {
  const restante = Math.max(0, OBJETIVO - Date.now());
  const s = Math.floor(restante / 1000);
  return {
    terminado: restante === 0,
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    minutos: Math.floor((s % 3600) / 60),
    segundos: s % 60,
  };
}

/** Cada dígito que cambia baja a su lugar; los que no cambian se quedan quietos. */
function Numero({ valor, minimo = 2 }: { valor: number; minimo?: number }) {
  const digitos = String(valor).padStart(minimo, "0").split("");
  return (
    <span className="inline-flex overflow-hidden tabular-nums" aria-hidden="true">
      {digitos.map((d, i) => (
        // La key incluye el valor: al cambiar, React monta un span nuevo y corre la entrada
        <span key={`${digitos.length - i}-${d}`} className="inline-block animate-digito motion-reduce:animate-none">
          {d}
        </span>
      ))}
    </span>
  );
}

export default function CuentaRegresiva() {
  const [t, setT] = useState(calcular);

  useEffect(() => {
    const id = setInterval(() => setT(calcular()), 1000);
    return () => clearInterval(id);
  }, []);

  const bloques = [
    { valor: t.dias, etiqueta: t.dias === 1 ? "Día" : "Días", minimo: 2 },
    { valor: t.horas, etiqueta: "Horas", minimo: 2 },
    { valor: t.minutos, etiqueta: "Min", minimo: 2 },
    { valor: t.segundos, etiqueta: "Seg", minimo: 2 },
  ];

  return (
    <section className="relative overflow-hidden bg-boda-cafe py-24 md:py-32 px-5 text-white">
      <div className="absolute inset-0">
        <ImagenSuave
          src={media.fondoCuentaRegresiva}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover animate-acercar motion-reduce:animate-none"
        />
        <div className="absolute inset-0 bg-boda-cafe/60" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <Revelar>
          <p className="text-[11px] tracking-[0.4em] uppercase text-white/75 mb-3">{evento.fechaTexto}</p>
        </Revelar>
        <Revelar retraso={60}>
          <h2 className="font-script text-5xl md:text-6xl mb-10">
            {t.terminado ? "¡Hoy es el gran día!" : "Falta muy poco"}
          </h2>
        </Revelar>

        {!t.terminado && (
          <div
            className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto"
            role="timer"
            aria-label={`Faltan ${t.dias} días, ${t.horas} horas y ${t.minutos} minutos`}
          >
            {bloques.map((b, i) => (
              <Revelar key={b.etiqueta} retraso={120 + i * 60}>
                <div className="rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm py-4 sm:py-5">
                  <div className="font-serif text-4xl sm:text-5xl md:text-6xl leading-none">
                    <Numero valor={b.valor} minimo={b.minimo} />
                  </div>
                  <p className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/75 mt-2">{b.etiqueta}</p>
                </div>
              </Revelar>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
