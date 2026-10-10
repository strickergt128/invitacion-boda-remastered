import lista from "../data/invitados.json";
import { evento } from "../data/evento";

export type Lado = "giovanni" | "mariana";

export type Invitado = {
  id: string;
  nombre: string;
  pases: number;
  lado: Lado;
  telefono?: string;
};

export const invitados = lista as Invitado[];

export function buscarInvitado(id: string | undefined): Invitado | undefined {
  if (!id) return undefined;
  return invitados.find((i) => i.id === id);
}

export function linkInvitado(invitado: Invitado): string {
  return `${window.location.origin}/i/${encodeURIComponent(invitado.id)}`;
}

/** Invitación general: sin nombre ni pases, para quien se haya quedado sin la suya. */
export function linkGeneral(): string {
  return `${window.location.origin}/`;
}

export function textoPases(pases: number): string {
  return pases === 1 ? "1 pase" : `${pases} pases`;
}

/** Minúsculas y sin acentos, para buscar "jose" y encontrar "José". */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function soloDigitos(telefono: string | undefined): string {
  return (telefono ?? "").replace(/\D/g, "");
}

export function urlWhatsApp(telefono: string | undefined, mensaje: string): string {
  const numero = soloDigitos(telefono);
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export function mensajeInvitacion(invitado: Invitado): string {
  return evento.mensajeInvitacion
    .replace(/\{nombre\}/g, invitado.nombre)
    .replace(/\{pases\}/g, textoPases(invitado.pases))
    .replace(/\{link\}/g, linkInvitado(invitado));
}

export function mensajeInvitacionGeneral(): string {
  return evento.mensajeInvitacionGeneral.replace(/\{link\}/g, linkGeneral());
}
