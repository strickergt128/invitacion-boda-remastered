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

/** Ráfaga al abrir "Contribución" en Regalos (igual que la referencia). */
export function confetiRegalo() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#e57373", "#f4a460", "#64b5f6", "#ffd54f", "#81c784", "#ba68c8"],
  });
}

/** Lluvia desde ambos lados al confirmar asistencia. */
export function confetiCelebracion() {
  cuandoSeaVisible(() => {
    const colores = ["#d4955a", "#ecc9a2", "#4c5c2f", "#adcbb5", "#ffffff"];

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
