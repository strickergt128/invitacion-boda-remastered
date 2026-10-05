import { useEffect, useRef, useState } from "react";

/**
 * Devuelve `visible = true` la primera vez que el elemento entra en pantalla.
 * Con `margen` (p. ej. "600px") se activa antes de llegar, útil para cargar contenido pesado a tiempo.
 */
export function useAparecer<T extends HTMLElement>(umbral = 0.2, margen = "0px") {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: umbral, rootMargin: margen },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [umbral, margen]);

  return { ref, visible };
}
