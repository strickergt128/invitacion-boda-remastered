// ─────────────────────────────────────────────────────────────
//  Toda la información del evento vive aquí.
// ─────────────────────────────────────────────────────────────

export const evento = {
  novios: {
    novia: "Mariana",
    novio: "Giovanni",
    noviaCompleto: "Mariana Samayoa",
    novioCompleto: "Giovanni Mazariegos",
  },

  // Inicio de la ceremonia con la zona horaria de Guatemala (UTC-6),
  // así la cuenta regresiva es correcta desde cualquier país.
  fechaISO: "2026-12-26T16:30:00-06:00",
  duracionHoras: 9.5,
  fechaTexto: "26 de diciembre de 2026",
  fechaCorta: "26 · 12 · 2026",

  padres: {
    titulo: "Con la bendición de Dios y nuestros padres:",
    novia: [
      { nombre: "Erick Estuardo Samayoa del Cid" },
      { nombre: "Blanca Azucena Catalán Orellana" },
    ],
    novio: [
      { nombre: "Willy Giovanni Mazariegos Martínez", fallecido: true },
      { nombre: "Aleida Melissa Barrientos de Paz" },
    ],
    nosotros: "Nosotros",
    invitacion: "Tenemos el honor de invitarte a nuestra boda.",
  },

  historia: [
    {
      titulo: "Mariana",
      texto: [
        "Hay momentos que se sueñan durante mucho tiempo y este es uno de ellos.",
        "Hoy, con el corazón lleno de ilusión, me preparo para decir “sí” al amor de mi alma y comenzar juntos una nueva historia.",
      ],
      foto: "/media/pareja1.jpeg",
      alt: "Mariana y Giovanni frente al mar",
    },
    {
      titulo: "Giovanni",
      texto: [
        "Hoy quiero abrirles las puertas a un momento que significa el comienzo de una nueva etapa en mi vida.",
        "Junto a la mujer de mis sueños, quiero celebrar el amor, la vida y la promesa de caminar juntos para siempre.",
      ],
      foto: "/media/pareja2.jpeg",
      alt: "Mariana y Giovanni tomados de la mano",
    },
    {
      titulo: "Nuestra historia",
      texto: [
        "Nos encontramos, nos elegimos y, entre momentos compartidos, descubrimos que nuestro lugar estaba juntos.",
        "Hoy damos el siguiente paso para convertir nuestro amor en un para siempre.",
      ],
      foto: "/media/pareja6.jpeg",
      alt: "Giovanni le pide matrimonio a Mariana en la playa",
    },
  ],

  galeria: [
    { src: "/media/pareja1.jpeg", alt: "Mariana y Giovanni frente al mar", ancho: 853, alto: 1280 },
    { src: "/media/pareja4.jpeg", alt: "Manos entrelazadas con el anillo de compromiso", ancho: 1280, alto: 853 },
    { src: "/media/pareja2.jpeg", alt: "Mariana y Giovanni frente con frente", ancho: 853, alto: 1280 },
    { src: "/media/pareja3.jpeg", alt: "Mariana y Giovanni arrodillados en la arena", ancho: 1280, alto: 853 },
    { src: "/media/pareja5.jpeg", alt: "Mariana y Giovanni de noche", ancho: 1280, alto: 853 },
    { src: "/media/pareja6.jpeg", alt: "La propuesta de matrimonio", ancho: 1280, alto: 853 },
  ],

  // Íconos disponibles: ceremonia, recepcion, bienvenida, cena, fiesta, fin
  itinerario: {
    titulo: "Itinerario",
    eventos: [
      { hora: "16:30", titulo: "Ceremonia", descripcion: "Nuestro “sí, acepto”", icono: "ceremonia" },
      {
        hora: "18:30",
        titulo: "Recepción de invitados",
        descripcion: "Les agradecemos llegar con puntualidad para disfrutar juntos de esta celebración.",
        icono: "recepcion",
      },
      { hora: "19:00", titulo: "Bienvenida", descripcion: "Entrada de los novios", icono: "bienvenida" },
      { hora: "19:30", titulo: "Cena", descripcion: "Banquete", icono: "cena" },
      { hora: "20:30", titulo: "Fiesta", descripcion: "¡A bailar!", icono: "fiesta" },
      { hora: "00:00", titulo: "Fin de la velada", descripcion: "Despedida", icono: "fin" },
    ],
  },

  lugares: [
    {
      tipo: "Ceremonia Religiosa",
      nombre: "Iglesia de Santo Domingo",
      direccion: "12 avenida 10-09, zona 1",
      ciudad: "Ciudad de Guatemala",
      hora: "16:30 horas",
      mapa: "https://maps.app.goo.gl/BCUDBJYeut3ii5Yo8",
      video: "/media/iglesia.mp4",
      poster: "/media/iglesia.jpg",
      calendario: true,
    },
    {
      tipo: "Recepción",
      nombre: "Museo de la Merced",
      direccion: "11 Avenida 4-49, Zona 1",
      ciudad: "Ciudad de Guatemala",
      hora: "18:30 horas",
      mapa: "https://maps.app.goo.gl/zmAhXUnpZnZ1BWS8A",
      video: "/media/museo.mp4",
      poster: "/media/museo.jpg",
      calendario: false,
    },
  ],

  vestimenta: {
    titulo: "Código de vestimenta",
    tipo: "Formal elegante",
    texto: [
      "Con cariño, les pedimos reservar los tonos blanco y beige para la novia y terracota como color de nuestra celebración.",
      "Fuera de estos tonos, serán bienvenidos todos los demás colores.",
      "Gracias por acompañarnos y cuidar con nosotros cada detalle de este día tan especial. 🤍",
    ],
    reservados: [
      { etiqueta: "Blanco", color: "#FFFFFF", nota: "Reservado para la novia" },
      { etiqueta: "Beige", color: "#E8D9BF", nota: "Reservado para la novia" },
      { etiqueta: "Terracota", color: "#B4532A", nota: "Color de nuestra celebración" },
    ],
    videos: [
      {
        titulo: "Ellas",
        mp4: "/media/vestimenta/vestimenta-mujeres.mp4",
        webm: "/media/vestimenta/vestimenta-mujeres.webm",
        poster: "/media/vestimenta/vestimenta-mujeres-poster.jpg",
        hd: "/media/vestimenta/vestimenta-mujeres-HD.jpg",
        proporcion: 1920 / 674,
      },
      {
        titulo: "Ellos",
        mp4: "/media/vestimenta/vestimenta-hombres.mp4",
        webm: "/media/vestimenta/vestimenta-hombres.webm",
        poster: "/media/vestimenta/vestimenta-hombres-poster.jpg",
        hd: "/media/vestimenta/vestimenta-hombres-HD.jpg",
        proporcion: 1920 / 960,
      },
    ],
  },

  regalos: {
    titulo: "Regalos",
    texto: [
      "El mejor regalo para nosotros es contar con su presencia y compartir juntos este día tan especial. 🤍",
      "Si desean hacernos un obsequio, hemos preparado nuestra lista de regalos en Bodas Cemaco, donde podrán encontrar algunas opciones que hemos elegido con mucho cariño para comenzar esta nueva etapa de nuestras vidas.",
    ],
    boton: "Ver lista de regalos en Cemaco",
    link: "https://www.cemaco.com/list/MAZARIEGOSBARRIENTOSSAMAYOACATALAN26122026",
    agradecimiento:
      "Agradecemos de todo corazón su cariño, generosidad y, sobre todo, el regalo de acompañarnos en este día tan importante para nosotros.",
    cierre: "¡Muchas gracias! ✨",
  },

  rsvp: {
    subtitulo: "Te esperamos",
    titulo: "Confirma tu asistencia",
    descripcion: "Tu respuesta nos ayuda a preparar cada detalle con mucho cariño.",
    // Número de WhatsApp de los novios (con lada de Guatemala, solo dígitos)
    whatsappNovios: "50242054232",
    // Máximo de personas cuando se abre la invitación general (sin link personal)
    maxPersonasGenerico: 5,
    graciasTitulo: "¡Gracias por confirmar!",
    graciasDesc1: "Estamos muy felices de saber que nos acompañarás en este día tan especial.",
    graciasDesc2: "Gracias por ser parte de nuestra historia.",
    noAsistiraTitulo: "Te vamos a extrañar",
    noAsistiraDesc1: "Gracias por avisarnos. Entendemos que no puedas acompañarnos.",
    noAsistiraDesc2: "Te llevamos en el corazón y esperamos verte muy pronto.",
    notaCambio:
      "Si por algún motivo cambian tus planes, te agradeceremos que nos avises con anticipación por WhatsApp.",
  },

  // Mensajes que se envían por WhatsApp desde el panel.
  // Variables disponibles: {nombre}, {pases}, {link}
  mensajeInvitacion:
    "¡Hola {nombre}! 🤍\n\nCon mucha ilusión queremos invitarte a nuestra boda el 26 de diciembre de 2026. Hemos reservado {pases} en tu honor.\n\nAquí está tu invitación:\n{link}\n\nCon cariño,\nMariana & Giovanni",
  mensajeInvitacionGeneral:
    "¡Hola! 🤍\n\nCon mucha ilusión queremos invitarte a nuestra boda el 26 de diciembre de 2026.\n\nAquí está tu invitación:\n{link}\n\nCon cariño,\nMariana & Giovanni",
};

export type Evento = typeof evento;
