import { evento } from "../data/evento";

function formatoUTC(fecha: Date): string {
  return fecha.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

// Hora "flotante" (sin zona): el calendario la muestra tal cual, p. ej. 16:00.
function formatoLocal(fecha: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}${p(fecha.getMonth() + 1)}${p(fecha.getDate())}T${p(fecha.getHours())}${p(fecha.getMinutes())}00`;
}

export function descargarCalendario() {
  const inicio = new Date(evento.fechaISO);
  const fin = new Date(inicio.getTime() + evento.duracionHoras * 60 * 60 * 1000);
  const { lugar, direccion, ciudad, ceremoniaDesc } = evento.detalles;
  const titulo = `Boda de ${evento.novios.novia} & ${evento.novios.novio}`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Invitacion Boda//ES",
    "BEGIN:VEVENT",
    `UID:${formatoLocal(inicio)}-boda@invitacion`,
    `DTSTAMP:${formatoUTC(new Date())}`,
    `DTSTART:${formatoLocal(inicio)}`,
    `DTEND:${formatoLocal(fin)}`,
    `SUMMARY:${titulo}`,
    `LOCATION:${lugar}\\, ${direccion}\\, ${ciudad}`,
    `DESCRIPTION:${ceremoniaDesc}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "boda.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
