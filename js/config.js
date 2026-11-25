/* ===== CONFIGURACIÓN DE BLOOMDYSS =====
   Completa SOLO lo que quieras mostrar. Lo que dejes vacío no aparece en la página. */
const BLOOM = {
  // WhatsApp con código de país y sin espacios ni signos. Ej.: '18095551234'
  whatsapp: '18298472326',
  instagram: 'https://www.instagram.com/bloomdyss/',
  horario: '',                     // Ej.: 'Lunes a sábado, 9:00 am – 6:00 pm'
  zonas: '',                       // Ej.: 'Entregas en Santo Domingo'
  // Campaña de temporada: franja superior + sección en el inicio. activa:false la oculta.
  temporada: {
    activa: true,
    etiqueta: 'NAVIDAD',
    franja: 'Se acerca la Navidad: reserva tu detalle con tiempo',
    titulo: 'Esta Navidad, regala un detalle que florezca.',
    texto: 'Cuéntanos a quién quieres sorprender y lo creamos con cariño. Reserva con tiempo para asegurar tu fecha.',
    boton: 'Armar mi regalo navideño',
    enlace: 'arma.html',
    hasta: '2026-12-24'   // la campaña se oculta sola después de esta fecha (AAAA-MM-DD)
  },
  // Extras para "Arma tu regalo" con su precio en RD$. Ej.: { n: 'Globos', p: 150 }  (p: null = sin precio)
  extras: [{ n: 'Mariposa', p: 25 }, { n: 'Corona chiquita', p: 125 }, { n: 'Corona mediana', p: 175 }, { n: 'Luces adicionales', p: 100 }, { n: 'Cadena con caja', p: 400 }],
  // Preguntas extra para la sección de preguntas frecuentes (opcional)
  faqExtra: [
    // { q: '¿Hacen entregas a domicilio?', a: 'Sí, en ...' },
    // { q: '¿Cómo puedo pagar?', a: 'Aceptamos ...' }
  ],
  // Testimonios reales (con permiso de la clienta). Si queda vacío, la sección no aparece.
  testimonios: [
    // { texto: 'Quedó hermoso, a ella le encantó.', nombre: 'María P.' }
  ],
  // Fotos reales para la franja de Instagram: ['assets/ig1.jpg', ...] (hasta 6)
  instagramFotos: ['assets/img/ramo-osos-azul.jpg','assets/img/ramo-personaje.jpg','assets/img/ramo-rojo-negro.jpg','assets/img/caja-azul-hotwheels.jpg','assets/img/ramo-novia-luz.jpg','assets/img/ramo-rojo-chocolates.jpg']
};

window.BLOOM = BLOOM; // expone la configuración para extras.js y arma.js
