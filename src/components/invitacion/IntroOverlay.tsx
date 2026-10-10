import { useEffect, useRef, useState } from "react";
import { evento } from "../../data/evento";
import { media } from "../../lib/media";
import { prepararVideoSilencioso } from "../../lib/video";

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
// Con red lenta, tras tocar se espera a que termine la descarga; pasado este tiempo se ofrece entrar sin el video
const OFRECER_SALTAR_MS = 4000;
// Límite final por si la conexión se cuelga del todo
const ESPERA_MAXIMA_MS = 30000;

export default function IntroOverlay({ onAbrir, onDescargado, onSalir, onTerminar }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iniciado = useRef(false);
  const cerrado = useRef(false);
  const espera = useRef<ReturnType<typeof setTimeout>>();
  // El video se descarga completo (blob) antes de reproducirlo: así nunca se traba, aunque la red sea lenta.
  // El src se asigna a mano, no con estado de React, para que nunca cambie a media reproducción.
  const blobUrl = useRef<string | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [videoVisible, setVideoVisible] = useState(false);
  const [videoFalla, setVideoFalla] = useState(false);
  const [tocado, setTocado] = useState(false);
  const [esperando, setEsperando] = useState(false);
  const [puedeSaltar, setPuedeSaltar] = useState(false);
  // iPhone en bajo consumo bloqueó la reproducción: se pide un toque más para verla
  const [pideToque, setPideToque] = useState(false);
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
    if (!video || !blobUrl.current || cerrado.current) return salir();
    clearTimeout(espera.current);
    video.play().catch((error: DOMException) => {
      if (cerrado.current) return;
      if (error?.name !== "NotAllowedError") return salir();
      // El navegador exige que la reproducción salga de un toque (iPhone en bajo consumo):
      // en vez de saltarse la animación, se pide un toque más y ese sí la reproduce
      setEsperando(false);
      setPideToque(true);
      espera.current = setTimeout(salir, ESPERA_MAXIMA_MS);
    });
  };

  const tocarDeNuevo = () => {
    setPideToque(false);
    reproducir();
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

    const descargar = async () => {
      // Prioridad alta: es lo primero que ve el invitado
      const r = await fetch(media.intro, { signal: control.signal, priority: "high" } as RequestInit);
      // Si el archivo no existe, algunos hostings devuelven la página HTML en su lugar
      if (!r.ok || !r.headers.get("content-type")?.startsWith("video")) throw new Error("sin video");

      // Se lee por partes para mostrar el avance si el invitado toca antes de que termine
      const total = Number(r.headers.get("content-length")) || 0;
      const lector = r.body?.getReader();
      if (!lector || !total) return r.blob();
      const partes: BlobPart[] = [];
      let recibido = 0;
      for (;;) {
        const { done, value } = await lector.read();
        if (done) break;
        partes.push(value);
        recibido += value.length;
        setProgreso(recibido / total);
      }
      return new Blob(partes, { type: "video/mp4" });
    };

    descargar()
      .then((blob) => {
        const video = videoRef.current;
        if (!video || cerrado.current) return;
        blobUrl.current = URL.createObjectURL(blob);
        video.src = blobUrl.current;
        setProgreso(1);
        onDescargado?.();
        // Si ya habían tocado, se reproduce ahora que está completo
        if (iniciado.current) reproducir();
      })
      .catch(() => {
        if (control.signal.aborted) return;
        setVideoFalla(true);
        onDescargado?.();
        if (iniciado.current) salir();
      });

    return () => {
      control.abort();
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
      blobUrl.current = null;
    };
  }, []);

  /** `enToque` es false cuando se retoma un toque hecho antes de que cargara la página. */
  const abrir = (enToque = true) => {
    if (iniciado.current) return;
    iniciado.current = true;
    setTocado(true);
    onAbrir();

    if (videoFalla || !videoRef.current) return salir();

    if (blobUrl.current) {
      // Ya descargado: play() dentro del toque (iPhone en bajo consumo solo lo permite así)
      reproducir();
      return;
    }

    // Aún descargando: no se cancela (se perdería lo ya bajado); se muestra el avance y se espera.
    // Pedir play() aquí, dentro del toque, "desbloquea" el video en iPhone (incluido el modo de bajo
    // consumo): cuando termine la descarga, el play() que se haga ya no requerirá otro toque.
    // Sin src todavía, esta llamada falla; es lo esperado y se ignora.
    if (enToque) videoRef.current.play().catch(() => {});
    setEsperando(true);
    setTimeout(() => setPuedeSaltar(true), OFRECER_SALTAR_MS);
    espera.current = setTimeout(salir, ESPERA_MAXIMA_MS);
  };

  // Si tocaron el sobre estático de index.html antes de que cargara la página, se retoma ese toque
  useEffect(() => {
    const w = window as Window & { __sobreTocado?: boolean };
    if (w.__sobreTocado) {
      w.__sobreTocado = false;
      abrir(false);
    }
  }, []);

  const escala = saliendo ? "scale(1.05)" : "scale(1)";

  return (
    <div
      className={`fixed inset-0 z-50 cursor-pointer ${saliendo ? "pointer-events-none" : ""}`}
      style={{ backgroundColor: "#a56c4d", transition: `opacity ${TRANSICION}`, opacity: saliendo ? 0 : 1 }}
      onClick={() => (pideToque ? tocarDeNuevo() : abrir())}
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
          {/* Siempre presente (el src llega después), para poder llamar play() en el mismo toque */}
          <video
            ref={(el) => {
              videoRef.current = el;
              prepararVideoSilencioso(el);
            }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transition: `transform ${TRANSICION}`, transform: escala, opacity: videoVisible ? 1 : 0 }}
            playsInline
            muted
            preload="auto"
            onPlaying={(e) => {
              // Se muestra cuando de verdad corre; debajo está el poster, que es su mismo primer cuadro
              setVideoVisible(true);
              setEsperando(false);
              setPideToque(false);
              clearTimeout(espera.current);
              const restante = (e.currentTarget.duration || 5) - e.currentTarget.currentTime;
              espera.current = setTimeout(salir, (restante + 3) * 1000);
            }}
            onError={(e) => {
              // El "desbloqueo" sin src puede disparar un error que no significa nada
              if (!e.currentTarget.getAttribute("src")) return;
              if (iniciado.current) salir();
              else setVideoFalla(true);
            }}
            onEnded={salir}
          />
        </>
      )}

      <div
        className="absolute left-0 right-0 flex flex-col items-center text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
        style={{ bottom: "calc(2.5rem + env(safe-area-inset-bottom, 0px))" }}
      >
        {!tocado && <p className="text-xs tracking-[0.3em] uppercase animate-pulse">Toca para abrir</p>}

        {pideToque && !saliendo && (
          <div className="flex flex-col items-center gap-3 animate-fade-solo" role="status">
            <p className="text-xs tracking-[0.3em] uppercase animate-pulse">Toca para ver la apertura</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                salir();
              }}
              className="presionable text-xs underline underline-offset-4 text-white/90"
            >
              Entrar sin esperar
            </button>
          </div>
        )}

        {esperando && !saliendo && (
          <div className="flex flex-col items-center gap-3 animate-fade-solo" role="status">
            <p className="text-xs tracking-[0.3em] uppercase">Abriendo tu invitación…</p>
            {/* Avance real de la descarga: scaleX en vez de width para no recalcular el diseño */}
            <div className="w-40 h-[3px] rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full bg-white origin-left transition-transform duration-300 ease-out-fuerte"
                style={{ transform: `scaleX(${Math.max(progreso, 0.04)})` }}
              />
            </div>
            {puedeSaltar && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  salir();
                }}
                className="presionable mt-1 text-xs underline underline-offset-4 text-white/90 animate-fade-solo"
              >
                Entrar sin esperar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
