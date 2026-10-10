import { useEffect, useRef, useState } from "react";
import { media } from "../../lib/media";
import { prepararVideoSilencioso } from "../../lib/video";

type Fase = "video" | "destello" | "salida";

/** Video de celebración a pantalla completa → destello blanco → desvanecido. */
export default function CelebracionOverlay({ onTerminar }: { onTerminar: () => void }) {
  const [fase, setFase] = useState<Fase>("video");
  const terminado = useRef(false);

  const cerrar = () => {
    if (terminado.current) return;
    terminado.current = true;
    setFase("destello");
    setTimeout(() => setFase("salida"), 400);
    setTimeout(onTerminar, 1000);
  };

  // Por si el video se queda trabado
  useEffect(() => {
    const t = setTimeout(cerrar, 15000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        opacity: fase === "salida" ? 0 : 1,
        transition: fase === "salida" ? "opacity 600ms ease-in-out" : undefined,
      }}
    >
      <video
        ref={prepararVideoSilencioso}
        src={media.celebracion}
        className="w-full h-full object-cover bg-white"
        playsInline
        autoPlay
        muted
        preload="auto"
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration && v.duration - v.currentTime < 0.5) cerrar();
        }}
        onEnded={cerrar}
        onError={() => {
          terminado.current = true;
          onTerminar();
        }}
      />
      <div
        className="absolute inset-0 z-10 bg-white"
        style={{ opacity: fase === "video" ? 0 : 1, transition: "opacity 400ms ease-in-out" }}
      />
    </div>
  );
}
