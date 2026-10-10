import { useState } from "react";
import { evento } from "../../data/evento";
import ImagenSuave from "./ImagenSuave";
import Lightbox from "./Lightbox";
import Revelar from "./Revelar";

export default function Galeria() {
  const [abierta, setAbierta] = useState<number | null>(null);
  const fotos = evento.galeria;

  return (
    <section className="bg-boda-arena py-20 md:py-24 overflow-hidden">
      <div className="text-center px-5 mb-10">
        <Revelar>
          <p className="text-[11px] tracking-[0.4em] uppercase text-boda-terracota mb-2">Galería</p>
        </Revelar>
        <Revelar retraso={60}>
          <h2 className="font-script text-5xl md:text-6xl text-boda-cafe">Momentos</h2>
        </Revelar>
        <Revelar retraso={120}>
          <p className="text-sm text-boda-texto/60 mt-3">Desliza y toca una foto para verla en grande</p>
        </Revelar>
      </div>

      {/* Carrusel con el scroll nativo: la física del navegador gana a cualquier resorte hecho a mano */}
      {/* Se revela el carrusel completo: las fotos fuera de pantalla a la derecha deben asomarse para invitar a deslizar */}
      <Revelar retraso={180} className="flex gap-4 overflow-x-auto snap-x snap-mandatory sin-barra px-[max(1.25rem,calc((100vw-72rem)/2))] pb-2">
        {fotos.map((foto, i) => (
          <div key={foto.src} className="snap-center shrink-0">
            <button
              onClick={() => setAbierta(i)}
              aria-label={`Ver foto: ${foto.alt}`}
              className="presionable block bg-boda-crema/60 h-[58svh] max-h-[520px] min-h-[320px] overflow-hidden rounded-sm shadow-lg shadow-boda-cafe/15"
            >
              <ImagenSuave
                src={foto.src}
                alt={foto.alt}
                width={foto.ancho}
                height={foto.alto}
                loading="lazy"
                className="h-full w-auto max-w-[85vw] object-cover"
                style={{ aspectRatio: `${foto.ancho} / ${foto.alto}` }}
              />
            </button>
          </div>
        ))}
      </Revelar>

      <Lightbox imagenes={fotos} indice={abierta} onCambiar={setAbierta} />
    </section>
  );
}
