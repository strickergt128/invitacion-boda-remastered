import { Hotel, Mail, MapPin, Phone } from "lucide-react";
import { evento } from "../../data/evento";

export default function Viaje() {
  const { viaje } = evento;

  return (
    <section id="viaje" className="pt-6 pb-20 md:pt-8 md:pb-32 bg-wedding-cream">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-wedding-accent tracking-[0.3em] uppercase text-sm mb-4">{viaje.subtitulo}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-wedding-olive mb-6">{viaje.titulo}</h2>
          <p className="text-wedding-text/70 max-w-2xl mx-auto">{viaje.descripcion}</p>
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Hotel className="w-6 h-6 text-wedding-accent" />
            <h3 className="font-serif text-2xl text-wedding-text">Dónde hospedarse</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {viaje.hoteles.map((h) => (
              <div key={h.nombre} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <h4 className="font-serif text-xl text-wedding-text mb-2">{h.nombre}</h4>
                <p className="text-wedding-accent text-sm mb-1">{h.categoria}</p>
                <p className="text-wedding-text/60 text-sm flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" />
                  {h.distancia}
                </p>
                <p className="text-wedding-text/70 text-sm">{h.nota}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16 bg-wedding-olive rounded-2xl p-8">
          <h3 className="font-serif text-2xl text-white mb-6 text-center">Qué hacer</h3>
          <p className="text-white/70 text-center mb-6">{viaje.queHacerDesc}</p>
          <div className="grid md:grid-cols-2 gap-4 text-white/70">
            {viaje.atracciones.map((a) => (
              <div key={a} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-wedding-gold rounded-full" />
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center rounded-2xl p-8 bg-[#d28f5b]/[0.29]">
          <h3 className="font-serif text-2xl text-wedding-text mb-4">¿Dudas?</h3>
          <p className="text-wedding-text/70 mb-6">{viaje.preguntasDesc}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href={`mailto:${viaje.contactoEmail}`}
              className="flex items-center gap-2 text-wedding-accent hover:text-wedding-accent/80 transition-colors"
            >
              <Mail className="w-5 h-5" />
              {viaje.contactoEmail}
            </a>
            <a
              href={`tel:${viaje.contactoTelefono.replace(/[^\d+]/g, "")}`}
              className="flex items-center gap-2 text-wedding-accent hover:text-wedding-accent/80 transition-colors"
            >
              <Phone className="w-5 h-5" />
              {viaje.contactoTelefono}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
