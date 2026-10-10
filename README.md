# Invitación de boda · Mariana & Giovanni

Invitación web con un link personal por invitado (con su número de pases), una invitación general sin nombre ni pases, y un panel para enviarlas por WhatsApp y llevar el registro de confirmaciones.

## Correr en local

```bash
npm install
npm run dev            # http://localhost:5173
npx vite --host        # para abrirla desde el celular en la misma red Wi-Fi
```

- Invitación general (sin nombre ni pases): `/`
- Invitación personal: `/i/familia-barrientos`
- Panel: `/panel-<VITE_PANEL_PATH>` (ver `.env`)

## Qué editar

| Archivo | Qué contiene |
|---|---|
| `src/data/evento.ts` | Todos los textos: padres, historia, itinerario, ceremonia y recepción, vestimenta, regalos, WhatsApp de los novios y los mensajes de invitación |
| `invitados.txt` | La lista de invitados (ver abajo) |
| `.env` | `VITE_PANEL_PATH`: la parte secreta de la URL del panel. Cámbiala antes de publicar |

### Lista de invitados

Edita `invitados.txt` (mismo formato: `Invitados de Giovanni`, luego `1. Nombre: pases`) y ejecuta:

```bash
npm run invitados
```

Esto regenera `src/data/invitados.json`. El link de cada invitado sale de su nombre sin acentos (`Familia Dubón` → `/i/familia-dubon`). Si un nombre aparece en las dos listas se deja una sola invitación. **Si cambias el nombre de alguien después de enviarle su link, su link cambia.**

Para que el botón de WhatsApp del panel abra directo el chat de un invitado, agrega su número en `telefono` dentro de `invitados.json` (con lada, por ejemplo `50212345678`).

## Panel

- Copiar el link, verlo, o enviarlo por WhatsApp con el mensaje ya escrito.
- Marcar cada invitación como **enviada**.
- Registrar a mano la **respuesta** (Confirmó / No asistirá) y cuántos pases usarán.
- Filtros por lado (Giovanni / Mariana), envío y respuesta, y buscador sin acentos.
- Resumen de pases confirmados.

El registro se guarda **solo en el navegador donde lo marques**. Usa "Descargar respaldo" de vez en cuando y "Restaurar respaldo" para pasarlo a otro dispositivo. "Exportar a Excel (CSV)" baja la lista completa con su estado.

## Archivos en `public/media/`

| Archivo | Uso |
|---|---|
| `intro2.mp4` + `intro2.jpg` | Sobre de apertura (toca para abrir) y su primer cuadro |
| `portada-boda.webm` / `.mp4` / `-poster.jpg` | Video de portada |
| `pareja1–6.jpeg` | Historia, galería y fondo de la cuenta regresiva |
| `iglesia.mp4` + `.jpg`, `museo.mp4` + `.jpg` | Videos de ceremonia y recepción y sus primeros cuadros |
| `vestimenta/` | Videos de código de vestimenta, posters e imágenes HD |
| `musica.mp3` | (Opcional) música de fondo; si existe aparece el botón de sonido |
| `celebracion.mp4` | (Opcional) animación al confirmar asistencia; sin ella solo hay confeti |

Los posters (`.jpg`) son el primer cuadro de cada video: se muestran al instante mientras el video se descarga. **Si cambias un video, regenera su poster** con [ffmpeg](https://ffmpeg.org):

```bash
ffmpeg -y -i public/media/iglesia.mp4 -frames:v 1 -q:v 4 public/media/iglesia.jpg
```

Los videos para celular no necesitan 4K ni audio. Así se comprimen (los originales están en `media-originales/`, que no se publica):

```bash
ffmpeg -i original.mp4 -vf "scale=960:-2" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart -an public/media/iglesia.mp4
```

## Vista previa al compartir por WhatsApp

Al pegar un link de la invitación, WhatsApp muestra `public/og-invitacion.jpg` (1200×630, ~85 KB) con el título y la descripción definidos en `index.html`.

- WhatsApp lee la vista previa desde sus servidores sin ejecutar JavaScript, así que la imagen usa la URL completa de `VITE_SITE_URL` en `.env`. **Si cambias de dominio, actualiza esa variable** y vuelve a publicar.
- La imagen debe seguir siendo horizontal y pesar menos de ~300 KB, o WhatsApp puede no mostrarla.
- WhatsApp guarda en caché la vista previa de cada link. Si un link ya se compartió antes del cambio, puede seguir mostrando la versión vieja por un tiempo.

## Publicar

```bash
npm run build
```

Sube el proyecto a Vercel o Netlify. Ya incluye `vercel.json` y `public/_redirects` para que funcionen los links `/i/...`.

> La lista de invitados va dentro del sitio, así que alguien con conocimientos técnicos podría verla. La URL secreta del panel solo evita que se encuentre por casualidad.
