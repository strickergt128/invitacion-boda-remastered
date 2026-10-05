import { Heart } from "lucide-react";
import { evento } from "../../data/evento";

export default function Footer() {
  return (
    <footer className="py-12 text-white bg-wedding-olive">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-script text-4xl mb-4 text-wedding-gold">
          {evento.novios.novia} &amp; {evento.novios.novio}
        </h2>
        <p className="text-wedding-gold/60 mb-6">{evento.fechaTexto}</p>
        <div className="flex items-center justify-center gap-2 text-wedding-gold/60 text-sm">
          <span>Hecho con</span>
          <Heart className="w-4 h-4 text-wedding-gold fill-wedding-gold" />
          <span>para nuestro gran día</span>
        </div>
        <div className="mt-8 pt-8 border-t border-wedding-gold/20 text-wedding-gold/40 text-xs">
          <p>{evento.hashtag}</p>
        </div>
      </div>
    </footer>
  );
}
