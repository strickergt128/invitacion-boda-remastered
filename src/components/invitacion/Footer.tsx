import { Heart } from "lucide-react";
import { evento } from "../../data/evento";

export default function Footer() {
  return (
    <footer
      className="bg-boda-cafe text-boda-arena text-center px-6 pt-14"
      style={{ paddingBottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <p className="font-script text-5xl mb-3">
        {evento.novios.novia} <span className="text-boda-arcilla mx-1">&amp;</span> {evento.novios.novio}
      </p>
      <p className="text-sm tracking-[0.35em] text-boda-arena/70">{evento.fechaCorta}</p>
      <Heart className="w-4 h-4 mx-auto mt-6 text-boda-arcilla fill-boda-arcilla" />
    </footer>
  );
}
