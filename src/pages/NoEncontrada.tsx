import { Link } from "react-router-dom";

export default function NoEncontrada() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-boda-crema px-6">
      <div className="text-center">
        <p className="font-script text-6xl text-boda-cafe mb-4">Ups…</p>
        <p className="text-boda-texto/70 mb-6">Esta página no existe.</p>
        <Link to="/" className="text-boda-terracota underline underline-offset-4">
          Ir a la invitación
        </Link>
      </div>
    </div>
  );
}
