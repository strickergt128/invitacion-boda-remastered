import type { CSSProperties, ElementType, ReactNode } from "react";
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

/**
 * Aparece una sola vez al entrar en pantalla (re-animar en cada scroll pelea con quien lee).
 * Los estilos viven en index.css (.revelar / .revelar-imagen), con su versión de movimiento reducido.
 */
export default function Revelar({ children, retraso = 0, variante = "texto", como: Etiqueta = "div", className = "", style }: Props) {
  const { ref, visible } = useAparecer<HTMLElement>(0.15);

  const demora = retraso ? `${retraso}ms` : undefined;

  if (variante === "imagen") {
    // El recorte va en una capa interior: un elemento recortado por completo nunca
    // "intersecta" para el IntersectionObserver, así que se observa el contenedor.
    return (
      <Etiqueta ref={ref} data-visible={visible} className={`relative ${className}`} style={style}>
        <div className="revelar-imagen absolute inset-0" style={{ transitionDelay: demora }}>
          {children}
        </div>
      </Etiqueta>
    );
  }

  return (
    <Etiqueta ref={ref} data-visible={visible} className={`revelar ${className}`} style={{ transitionDelay: demora, ...style }}>
      {children}
    </Etiqueta>
  );
}
