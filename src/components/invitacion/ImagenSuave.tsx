import { useLayoutEffect, useRef, useState, type ImgHTMLAttributes } from "react";

/**
 * <img> que aparece con un fundido cuando termina de descargarse, en vez de aparecer de golpe.
 * Si ya estaba en caché, se muestra al instante (sin animar algo que el invitado ya vio).
 */
export default function ImagenSuave({ style, onLoad, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null);
  const [cargada, setCargada] = useState(false);
  const [animar, setAnimar] = useState(true);

  useLayoutEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) {
      setAnimar(false);
      setCargada(true);
    }
  }, []);

  return (
    <img
      ref={ref}
      {...props}
      onLoad={(e) => {
        setCargada(true);
        onLoad?.(e);
      }}
      style={{
        ...style,
        opacity: cargada ? 1 : 0,
        transition: animar ? "opacity 500ms var(--ease-out)" : undefined,
      }}
    />
  );
}
