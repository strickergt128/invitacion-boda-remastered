import { Link } from "react-router-dom";

export default function NoEncontrada() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-wedding-cream px-6">
      <div className="text-center">
        <p className="font-script text-6xl text-wedding-olive mb-4">Ups…</p>
        <p className="text-wedding-text/70 mb-6">Esta página no existe.</p>
        <Link to="/" className="text-wedding-accent underline underline-offset-4">
          Ir a la invitación
        </Link>
      </div>
    </div>
  );
}
