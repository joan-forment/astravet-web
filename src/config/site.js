/*
 * ══════════════════════════════════════════════════════════════════════════
 *  CONFIGURACIÓN DEL NEGOCIO · AstraVet
 * ══════════════════════════════════════════════════════════════════════════
 *  Este es el ÚNICO archivo que el equipo necesita tocar para ajustar datos
 *  de contacto, precios, descuentos y las claves de las herramientas externas.
 *  No hace falta saber programar: cambia el texto entre comillas y guarda.
 *
 *  Tras cualquier cambio aquí, vuelve a publicar la web (npm run build).
 * ══════════════════════════════════════════════════════════════════════════
 */

/* ───────────────────────────── 1 · CONTACTO ─────────────────────────────
 * Teléfono en formato internacional para los enlaces de llamada y WhatsApp.
 * Usa el prefijo del país sin espacios ni signos (España = 34).
 *   phoneE164:    lo que marca el móvil al pulsar "Llamar".
 *   phoneDisplay: cómo se muestra el número en pantalla (con espacios).
 *   whatsapp:     mismo número, solo dígitos, para el enlace wa.me.
 */
export const CONTACT = {
  phoneE164: "+34659510427", // ← SUSTITUIR por el teléfono real
  phoneDisplay: "+34 659 51 04 27", // ← SUSTITUIR (versión visible)
  whatsapp: "34659510427", // ← SUSTITUIR (solo dígitos, con prefijo país)
  whatsappMessage:
    "¡Hola AstraVet! Me gustaría recibir información sobre el curso de Auxiliar Técnico Veterinario.",
  email: "admin@astravet.es",
  // Horario de atención al cliente (texto libre, se muestra tal cual).
  hours: [
    ["Lunes a viernes", "9:00 – 14:00 · 16:00 – 19:00"],
    ["Sábados", "10:00 – 13:00"],
    ["Domingos y festivos", "Cerrado"],
  ],
};

/* ──────────────────────────── 2 · CALENDARIO ────────────────────────────
 * Reserva de reuniones informativas con sincronización real con Outlook.
 * Pega aquí la URL de tu evento de Calendly (o Cal.com / Microsoft Bookings).
 * Mientras esté vacío (""), la web muestra un aviso "próximamente" en lugar
 * del calendario, sin romper nada.
 *
 *   Calendly:  https://calendly.com/tu-cuenta/reunion-informativa
 *   Cal.com:   https://cal.com/tu-cuenta/info
 *   Bookings:  el enlace público "Bookings page" de Microsoft 365.
 */
export const BOOKING = {
  // Proveedor: "calendly" | "calcom" | "iframe" (genérico) | "" (desactivado)
  provider: "calendly",
  url: "https://calendly.com/admin-astravet/30min",
};

/* ───────────────────────────── 3 · PAGO ───────────────────────────────
 * Mientras no haya TPV virtual, la plaza se paga por transferencia. Estos
 * datos se muestran SOLO en la pantalla de «¡Gracias!» de «Reserva tu plaza»
 * (no en las páginas que lee Google). Si cambia la cuenta, cámbiala aquí.
 */
export const PAGO = {
  iban: "ES08 0049 3338 5521 1416 1173",
  concepto: "Reserva ATV + tu nombre y apellidos",
};

/* ───────────────────────────── 4 · TIENDA ───────────────────────────────
 * Los packs, los productos sueltos, los precios, la promoción de lanzamiento
 * y los códigos de descuento NO están aquí: viven en su propio archivo,
 *
 *     src/config/catalogo.js
 *
 * que es la única fuente de verdad de todo lo comercial. Ahí encontrarás las
 * instrucciones para editarlos, y en el README la guía paso a paso.
 */
