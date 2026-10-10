import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type Imagen = { src: string; alt: string };

type Props = {
  imagenes: Imagen[];
  /** Índice abierto, o null si está cerrado. */
  indice: number | null;
  onCambiar: (indice: number | null) => void;
};

/**
 * Visor de fotos sobre <dialog> nativo: foco, Escape y capa superior sin librerías.
 * Entra como un modal (centrado, opacidad + scale 0.96 → 1, 250 ms ease-out).
 */
export default function Lightbox({ imagenes, indice, onCambiar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);
  const abierto = indice !== null;
  const total = imagenes.length;

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierto && !d.open) {
      d.showModal();
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setVisible(true));
    }
    if (!abierto && d.open) {
      d.close();
    }
  }, [abierto]);

  const cerrar = () => {
    setVisible(false);
    document.body.style.overflow = "";
    // Espera a que termine la salida antes de cerrar el diálogo
    setTimeout(() => onCambiar(null), 200);
  };

  const mover = (paso: number) => {
    if (indice === null) return;
    onCambiar((indice + paso + total) % total);
  };

  // Deslizar con el dedo para cambiar de foto
  const inicioX = useRef<number | null>(null);

  const actual = indice !== null ? imagenes[indice] : null;

  return (
    <dialog
      ref={dialogo}
      onCancel={(e) => {
        e.preventDefault();
        cerrar();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") mover(1);
        if (e.key === "ArrowLeft") mover(-1);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) cerrar();
      }}
      className="m-0 p-0 w-full h-full max-w-none max-h-none bg-transparent backdrop:bg-transparent"
    >
      <div
        className="fixed inset-0 bg-black/95 transition-opacity duration-[250ms] ease-out-fuerte"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={cerrar}
      />

      {actual && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 md:p-12 pointer-events-none"
          onTouchStart={(e) => (inicioX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (inicioX.current === null || e.touches.length > 0) return;
            const dx = e.changedTouches[0].clientX - inicioX.current;
            inicioX.current = null;
            if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1);
          }}
        >
          <img
            key={actual.src}
            src={actual.src}
            alt={actual.alt}
            className="pointer-events-auto max-w-full max-h-full object-contain rounded-sm shadow-2xl transition-[opacity,transform] duration-[250ms] ease-out-fuerte motion-reduce:transform-none"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.96)" }}
          />
        </div>
      )}

      <button
        onClick={cerrar}
        aria-label="Cerrar"
        className="presionable fixed right-4 z-10 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
        style={{ top: "calc(1rem + env(safe-area-inset-top, 0px))" }}
      >
        <X className="w-5 h-5" />
      </button>

      {total > 1 && (
        <>
          <button
            onClick={() => mover(-1)}
            aria-label="Foto anterior"
            className="presionable fixed left-3 top-[calc(50%-1.375rem)] z-10 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => mover(1)}
            aria-label="Foto siguiente"
            className="presionable fixed right-3 top-[calc(50%-1.375rem)] z-10 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <p
            className="fixed left-0 right-0 text-center text-white/70 text-xs tracking-[0.3em] z-10"
            style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
          >
            {(indice ?? 0) + 1} / {total}
          </p>
        </>
      )}
    </dialog>
  );
}
