import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useAparecer } from "./useAparecer";

type Props = {
  children: ReactNode;
  /** Retraso en ms, para escalonar varios elementos (30–80 ms entre cada uno). */
  retraso?: number;
  /** "texto": sube y aparece. "imagen": se descubre de abajo hacia arriba (el contenedor debe tener tamaño propio). */
  variante?: "texto" | "imagen";
  como?: ElementType;
  className?: string;
  style?: CSSProperties;
};

// Las fotos empiezan a descargarse cuando faltan ~800 px para llegar a ellas
const MARGEN_PRECARGA = "800px 0px";
// Si una foto tarda demasiado (o la conexión se cuelga), se destapa de todos modos
const ESPERA_MAXIMA_MS = 8000;

/**
 * Aparece una sola vez al entrar en pantalla (re-animar en cada scroll pelea con quien lee).
 * Los estilos viven en index.css (.revelar / .revelar-imagen), con su versión de movimiento reducido.
 */
export default function Revelar({ children, retraso = 0, variante = "texto", como: Etiqueta = "div", className = "", style }: Props) {
  const { ref, visible } = useAparecer<HTMLElement>(0.15);
  const demora = retraso ? `${retraso}ms` : undefined;

  if (variante === "imagen") {
    return (
      <RevelarImagen como={Etiqueta} className={className} style={style} demora={demora}>
        {children}
      </RevelarImagen>
    );
  }

  return (
    <Etiqueta ref={ref} data-visible={visible} className={`revelar ${className}`} style={{ transitionDelay: demora, ...style }}>
      {children}
    </Etiqueta>
  );
}

/**
 * Foto que se descubre de abajo hacia arriba.
 *
 * Dos detalles evitan que la foto "salte" sin animación:
 * - El recorte va en una capa interior y se observa el contenedor: el navegador da por invisible
 *   todo lo que está recortado, así que una imagen con carga diferida dentro de la capa no se
 *   descargaría hasta que la animación ya empezó. Por eso las fotos se montan (y descargan) cuando
 *   el contenedor está cerca, y se fuerzan a carga inmediata.
 * - La animación espera a que las fotos estén descargadas y decodificadas.
 */
function RevelarImagen({
  children,
  como: Etiqueta,
  className,
  style,
  demora,
}: {
  children: ReactNode;
  como: ElementType;
  className: string;
  style?: CSSProperties;
  demora?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const capa = useRef<HTMLDivElement>(null);
  const [cerca, setCerca] = useState(false);
  const [enVista, setEnVista] = useState(false);
  const [lista, setLista] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const alAcercarse = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCerca(true);
          alAcercarse.disconnect();
        }
      },
      { rootMargin: MARGEN_PRECARGA },
    );
    const alVerse = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setEnVista(true);
          alVerse.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    alAcercarse.observe(el);
    alVerse.observe(el);
    return () => {
      alAcercarse.disconnect();
      alVerse.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!cerca) return;
    const imagenes = [...(capa.current?.querySelectorAll("img") ?? [])];
    for (const img of imagenes) img.loading = "eager";

    let vigente = true;
    // decode() espera la descarga y deja la imagen lista para pintarse; si falla, se destapa igual
    const decodificadas = Promise.all(imagenes.map((img) => img.decode().catch(() => {})));
    const tope = new Promise((r) => setTimeout(r, ESPERA_MAXIMA_MS));
    Promise.race([decodificadas, tope]).then(() => vigente && setLista(true));
    return () => {
      vigente = false;
    };
  }, [cerca]);

  return (
    <Etiqueta ref={ref} data-visible={enVista && lista} className={`relative ${className}`} style={style}>
      <div ref={capa} className="revelar-imagen absolute inset-0" style={{ transitionDelay: demora }}>
        {cerca && children}
      </div>
    </Etiqueta>
  );
}
