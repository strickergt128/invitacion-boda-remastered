import { evento } from "../data/evento";

// La fecha del evento incluye la zona de Guatemala, así que se puede expresar en UTC
// y cada calendario la muestra a la hora correcta del invitado.
function formatoUTC(fecha: Date): string {
  return fecha.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

// En iCalendar las comas y punto y coma del texto van escapados
const escapar = (texto: string) => texto.replace(/([,;])/g, "\\$1");

export function descargarCalendario() {
  const inicio = new Date(evento.fechaISO);
  const fin = new Date(inicio.getTime() + evento.duracionHoras * 60 * 60 * 1000);
  const [ceremonia, recepcion] = evento.lugares;
  const titulo = `Boda de ${evento.novios.novia} & ${evento.novios.novio}`;
  const ubicacion = `${ceremonia.nombre}, ${ceremonia.direccion}, ${ceremonia.ciudad}`;
  const descripcion =
    `${ceremonia.tipo}: ${ceremonia.nombre}, ${ceremonia.hora}. ` +
    `${recepcion.tipo}: ${recepcion.nombre}, ${recepcion.direccion}, ${recepcion.hora}.`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Invitacion Boda//ES",
    "BEGIN:VEVENT",
    `UID:${formatoUTC(inicio)}-boda@invitacion`,
    `DTSTAMP:${formatoUTC(new Date())}`,
    `DTSTART:${formatoUTC(inicio)}`,
    `DTEND:${formatoUTC(fin)}`,
    `SUMMARY:${escapar(titulo)}`,
    `LOCATION:${escapar(ubicacion)}`,
    `DESCRIPTION:${escapar(descripcion)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "boda-mariana-giovanni.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
