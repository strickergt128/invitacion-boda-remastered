// Convierte invitados.txt en src/data/invitados.json
// Uso: npm run invitados
//
// Formato esperado de invitados.txt:
//   Invitados de Giovanni
//     1. Familia Barrientos: 5
//   Invitados de Mariana:
//     1. Familia Samayoa Catalán: 5
import { readFileSync, writeFileSync } from "node:fs";

const ORIGEN = "invitados.txt";
const DESTINO = "src/data/invitados.json";

const slug = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const normalizar = (texto) => slug(texto).replace(/-/g, " ");

const invitados = [];
const vistos = new Map(); // nombre normalizado → invitado
const ids = new Set();
const avisos = [];
let lado = null;

for (const [n, linea] of readFileSync(ORIGEN, "utf8").split(/\r?\n/).entries()) {
  const texto = linea.trim();
  if (!texto) continue;

  const encabezado = texto.match(/^invitados de (\w+)/i);
  if (encabezado) {
    lado = slug(encabezado[1]);
    continue;
  }

  const fila = texto.match(/^\d+\.\s*(.+?)\s*:\s*(\d+)\s*$/);
  if (!fila) {
    avisos.push(`Línea ${n + 1} ignorada: "${texto}"`);
    continue;
  }
  if (!lado) throw new Error(`Línea ${n + 1}: falta el encabezado "Invitados de ..." antes de los nombres`);

  const nombre = fila[1].replace(/\s+/g, " ");
  const pases = Number(fila[2]);

  // El mismo nombre en ambas listas es una sola invitación
  const clave = normalizar(nombre);
  if (vistos.has(clave)) {
    const previo = vistos.get(clave);
    avisos.push(`"${nombre}" está repetido (${previo.lado} y ${lado}): se deja una sola invitación`);
    continue;
  }

  let id = slug(nombre);
  for (let i = 2; ids.has(id); i++) id = `${slug(nombre)}-${i}`;
  ids.add(id);

  const invitado = { id, nombre, pases, lado, telefono: "" };
  vistos.set(clave, invitado);
  invitados.push(invitado);
}

writeFileSync(DESTINO, JSON.stringify(invitados, null, 2) + "\n");

const porLado = (l) => invitados.filter((i) => i.lado === l);
const suma = (lista) => lista.reduce((s, i) => s + i.pases, 0);
for (const aviso of avisos) console.warn("⚠ " + aviso);
console.log(`✓ ${invitados.length} invitaciones, ${suma(invitados)} pases → ${DESTINO}`);
for (const l of [...new Set(invitados.map((i) => i.lado))]) {
  console.log(`  ${l}: ${porLado(l).length} invitaciones, ${suma(porLado(l))} pases`);
}
