import confetti from "canvas-confetti";

/** Ejecuta `fn` ahora si la pestaña está visible, o en cuanto el invitado regrese a ella. */
function cuandoSeaVisible(fn: () => void) {
  if (!document.hidden) {
    fn();
    return;
  }
  const alVolver = () => {
    if (document.hidden) return;
    document.removeEventListener("visibilitychange", alVolver);
    // Pequeña pausa para que el navegador reanude las animaciones
    setTimeout(fn, 300);
  };
  document.addEventListener("visibilitychange", alVolver);
}

// Paleta terracota de la boda
const COLORES = ["#B4532A", "#8C3B22", "#C98552", "#EFE2D0", "#FFFBF5"];

// Movimiento reducido: el confeti es pura decoración, se omite
const reducirMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Ráfaga al abrir la lista de regalos (se abre en otra pestaña: espera a que el invitado regrese). */
export function confetiRegalo() {
  if (reducirMovimiento()) return;
  cuandoSeaVisible(() => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: COLORES });
  });
}

/** Lluvia desde ambos lados al confirmar asistencia. */
export function confetiCelebracion() {
  if (reducirMovimiento()) return;
  cuandoSeaVisible(() => {
    const colores = COLORES;

    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors: colores });

    const fin = Date.now() + 2000;
    const intervalo = setInterval(() => {
      if (Date.now() > fin) {
        clearInterval(intervalo);
        return;
      }
      confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: colores });
      confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: colores });
    }, 120);
  });
}
