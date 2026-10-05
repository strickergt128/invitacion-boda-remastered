// ─────────────────────────────────────────────────────────────
//  Toda la información del evento vive aquí.
//  Reemplaza los placeholders cuando tengas los datos reales.
// ─────────────────────────────────────────────────────────────

export const evento = {
  novios: {
    novia: "Nombre 1",
    novio: "Nombre 2",
    iniciales: "N & N",
  },

  // Fecha y hora de inicio (hora local del evento) y duración para el calendario
  fechaISO: "2027-06-12T16:00:00",
  duracionHoras: 10,
  fechaTexto: "12 de junio de 2027",

  hero: {
    titulo: "¡Nos casamos!",
    confirmar: "Confirmar asistencia",
  },

  historia: {
    subtitulo: "Nuestro camino",
    titulo: "Nuestra historia",
    hitos: [
      {
        anio: "20XX",
        titulo: "Cómo nos conocimos",
        descripcion:
          "Aquí va la historia de cómo se conocieron. Un par de líneas que cuenten ese primer encuentro inesperado.",
      },
      {
        anio: "20XX",
        titulo: "Nuestra primera aventura",
        descripcion:
          "Un recuerdo especial juntos: un viaje, una cita, una anécdota que los acercó todavía más.",
      },
      {
        anio: "20XX",
        titulo: "Construyendo juntos",
        descripcion:
          "El momento en que supieron que era para siempre. Sueños compartidos y un futuro por delante.",
      },
      {
        anio: "20XX",
        titulo: "La propuesta",
        descripcion:
          "Con el corazón lleno de amor, llegó la gran pregunta… y la respuesta fue un sí entre lágrimas de alegría.",
      },
    ],
  },

  // Íconos disponibles: llegada, ceremonia, coctel, cena, baile, fiesta, fin
  programa: {
    titulo: "Programa del día",
    subtitulo: "Lo que hemos preparado para ti",
    eventos: [
      { hora: "16:30", titulo: "Llegada de invitados", descripcion: "Recepción y bienvenida", icono: "llegada" },
      { hora: "17:00", titulo: "Ceremonia", descripcion: "Nuestro sí, acepto", icono: "ceremonia" },
      { hora: "18:00", titulo: "Coctel", descripcion: "Bocadillos y bebidas", icono: "coctel" },
      { hora: "20:00", titulo: "Cena", descripcion: "Banquete de bodas", icono: "cena" },
      { hora: "22:30", titulo: "Primer baile", descripcion: "El baile de los novios", icono: "baile" },
      { hora: "23:00", titulo: "Fiesta", descripcion: "¡A bailar!", icono: "fiesta" },
      { hora: "02:30", titulo: "Despedida", descripcion: "Hasta pronto", icono: "fin" },
    ],
  },

  regalos: {
    titulo: "Regalos",
    descripcion: "Tu presencia es lo más importante para nosotros.",
    descripcion2: "Si deseas hacernos un regalo, puedes hacerlo de la forma que te resulte más cómoda.",
    contribucion: "Contribución",
    opcionEfectivo: "Si lo prefieres, el regalo puede ser en efectivo el día del evento.",
    opcionTransferencia: "Si te resulta más cómodo, también puedes hacer una transferencia:",
    mostrarCuenta: "Mostrar datos bancarios",
    banco: "Banco Placeholder",
    titular: "Nombre del titular",
    etiquetaCuenta: "CLABE",
    cuenta: "000 000 0000 0000 0000",
  },

  detalles: {
    subtitulo: "Acompáñanos",
    titulo: "Detalles del evento",
    descripcion:
      "Estamos muy emocionados de celebrar este día tan especial contigo. Aquí está todo lo que necesitas saber.",
    ceremonia: "Ceremonia y recepción",
    ceremoniaDesc: "Acompáñanos a intercambiar nuestros votos rodeados de las personas que más queremos.",
    hora: "4:00 PM",
    lugar: "Nombre del lugar",
    direccion: "Calle y número, Colonia",
    ciudad: "Ciudad, Estado, País",
    // Texto que se busca en Google Maps para el mapa embebido
    mapaQuery: "Zócalo, Ciudad de México",
    // Link directo para "Abrir en Maps" (puedes pegar uno de maps.app.goo.gl)
    mapaLink: "https://maps.google.com/?q=Z%C3%B3calo,+Ciudad+de+M%C3%A9xico",
    notaMapa: "Habrá estacionamiento disponible en el lugar.",
    vestimenta: "Código de vestimenta",
    vestimentaTipo: "Formal / Etiqueta opcional",
    vestimentaDesc: "Te pedimos vestir de manera elegante para nuestra celebración.",
  },

  rsvp: {
    subtitulo: "Sé nuestro invitado",
    titulo: "Confirma tu asistencia",
    fechaLimite: "Por favor confírmanos antes del 12 de mayo de 2027",
    // Número de WhatsApp de los novios (con lada internacional, solo dígitos)
    whatsappNovios: "520000000000",
    // Máximo de personas cuando se abre la invitación genérica (sin link personal)
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

  viaje: {
    subtitulo: "Planea tu visita",
    titulo: "Viaje y hospedaje",
    descripcion: "Queremos que tu visita sea lo más cómoda posible. Aquí tienes algunas recomendaciones.",
    hoteles: [
      { nombre: "Hotel Placeholder 1", categoria: "5 estrellas", distancia: "5 min del lugar", nota: "Tarifa especial para invitados" },
      { nombre: "Hotel Placeholder 2", categoria: "4 estrellas", distancia: "10 min del lugar", nota: "Encantador e íntimo" },
      { nombre: "Hotel Placeholder 3", categoria: "4 estrellas", distancia: "15 min del lugar", nota: "Ideal para recorrer la ciudad" },
    ],
    queHacerDesc: "Si extiendes tu estancia, estos son algunos lugares que nos encantan:",
    atracciones: ["Centro histórico", "Mercados locales", "Restaurantes típicos", "Miradores y parques"],
    preguntasDesc: "No dudes en escribirnos si necesitas ayuda para organizar tu viaje.",
    contactoEmail: "boda@ejemplo.com",
    contactoTelefono: "+52 000 000 0000",
  },

  hashtag: "#Nombre1YNombre2",

  // Mensaje que se envía por WhatsApp desde el dashboard.
  // Variables disponibles: {nombre}, {pases}, {link}
  mensajeInvitacion:
    "¡Hola {nombre}! 💌\n\nCon mucha ilusión queremos invitarte a nuestra boda. Hemos reservado {pases} para ti.\n\nAquí está tu invitación:\n{link}\n\n¡Esperamos contar contigo!",
};

export type Evento = typeof evento;
