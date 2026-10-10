import { useEffect, useRef, useState } from "react";
import { evento } from "../../data/evento";
import { media } from "../../lib/media";

type Props = {
  /** Se llama en el primer toque (sirve para arrancar la música). */
  onAbrir: () => void;
  /** Se llama cuando el video del intro terminó de descargarse (o no existe). */
  onDescargado?: () => void;
  /** Se llama cuando el sobre empieza a desvanecerse (para que la portada entre a la vez). */
  onSalir?: () => void;
  /** Se llama cuando termina el desvanecido y la invitación queda visible. */
  onTerminar: () => void;
};

// Salida tipo telón: se abre mostrando la portada (curva fuerte de la skill "animate")
const DURACION_SALIDA_MS = 1200;
const TRANSICION = `${DURACION_SALIDA_MS}ms var(--ease-out)`;
// Si tras tocar el video todavía no termina de descargarse en este tiempo, abrimos la invitación
const ESPERA_MAXIMA_MS = 8000;

export default function IntroOverlay({ onAbrir, onDescargado, onSalir, onTerminar }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iniciado = useRef(false);
  const cerrado = useRef(false);
  const espera = useRef<ReturnType<typeof setTimeout>>();
  // El video se descarga completo antes de reproducirlo, para que no se trabe en redes lentas
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoListo, setVideoListo] = useState(false);
  const [videoFalla, setVideoFalla] = useState(false);
  const [tocado, setTocado] = useState(false);
  const [saliendo, setSaliendo] = useState(false);

  const salir = () => {
    if (cerrado.current) return;
    cerrado.current = true;
    clearTimeout(espera.current);
    setSaliendo(true);
    onSalir?.();
    setTimeout(onTerminar, DURACION_SALIDA_MS);
  };

  const reproducir = () => {
    const video = videoRef.current;
    if (!video) return salir();
    clearTimeout(espera.current);
    // Margen por si la reproducción se queda trabada
    espera.current = setTimeout(salir, ((video.duration || 5) + 3) * 1000);
    video.play().catch(salir);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      clearTimeout(espera.current);
    };
  }, []);

  useEffect(() => {
    const control = new AbortController();
    let url: string | null = null;

    // Prioridad alta: es lo primero que ve el invitado
    fetch(media.intro, { signal: control.signal, priority: "high" } as RequestInit)
      .then((r) => {
        // Si el archivo no existe, algunos hostings devuelven la página HTML en su lugar
        if (!r.ok || !r.headers.get("content-type")?.startsWith("video")) throw new Error("sin video");
        return r.blob();
      })
      .then((blob) => {
        url = URL.createObjectURL(blob);
        setVideoUrl(url);
        onDescargado?.();
      })
      .catch(() => {
        if (control.signal.aborted) return;
        setVideoFalla(true);
        onDescargado?.();
        if (iniciado.current) salir();
      });

    return () => {
      control.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  const abrir = () => {
    if (iniciado.current) return;
    iniciado.current = true;
    setTocado(true);
    onAbrir();

    if (videoFalla) return salir();
    if (videoListo) return reproducir();
    // Aún descargando: se reproduce en cuanto esté listo (ver onLoadedData)
    espera.current = setTimeout(salir, ESPERA_MAXIMA_MS);
  };

  const escala = saliendo ? "scale(1.05)" : "scale(1)";

  return (
    <div
      className={`fixed inset-0 z-50 cursor-pointer ${saliendo ? "pointer-events-none" : ""}`}
      style={{ backgroundColor: "#a56c4d", transition: `opacity ${TRANSICION}`, opacity: saliendo ? 0 : 1 }}
      onClick={abrir}
      role="button"
      aria-label="Abrir invitación"
    >
      {videoFalla ? (
        // Respaldo solo cuando no hay video
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ transition: `transform ${TRANSICION}`, transform: escala }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/80 mb-8">Estás invitado</p>
          <div className="relative w-36 h-36 rounded-full bg-boda-oxido shadow-[inset_0_-6px_12px_rgba(0,0,0,0.18),0_10px_25px_rgba(0,0,0,0.15)] flex items-center justify-center">
            <div className="absolute inset-2 rounded-full border border-white/40" />
            <span className="font-script text-4xl text-white drop-shadow">{evento.novios.novia[0]}&amp;{evento.novios.novio[0]}</span>
          </div>
          <h1 className="font-script text-5xl text-white mt-10">
            {evento.novios.novia} <span className="mx-1">&amp;</span> {evento.novios.novio}
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase text-white/80 mt-4">{evento.fechaTexto}</p>
        </div>
      ) : (
        <>
          {/* Primer cuadro del video: aparece al instante mientras el video se descarga */}
          <img
            src={media.introPoster}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transition: `transform ${TRANSICION}`, transform: escala }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transition: `transform ${TRANSICION}`, transform: escala, opacity: videoListo ? 1 : 0 }}
              playsInline
              muted
              preload="auto"
              onLoadedData={() => {
                setVideoListo(true);
                if (iniciado.current && !cerrado.current) reproducir();
              }}
              onError={() => {
                setVideoFalla(true);
                if (iniciado.current) salir();
              }}
              onEnded={salir}
            />
          )}
        </>
      )}

      {!tocado && (
        <p
          className="absolute left-0 right-0 text-center text-xs tracking-[0.3em] uppercase animate-pulse text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
          style={{ bottom: "calc(2.5rem + env(safe-area-inset-bottom, 0px))" }}
        >
          Toca para abrir
        </p>
      )}
    </div>
  );
}
