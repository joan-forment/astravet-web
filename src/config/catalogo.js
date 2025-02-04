/*
 * ══════════════════════════════════════════════════════════════════════════
 *  CATÁLOGO COMERCIAL · AstraVet
 * ══════════════════════════════════════════════════════════════════════════
 *  FUENTE ÚNICA DE VERDAD de packs, productos, precios y promoción.
 *  Ningún componente de la web repite un precio, un nombre público ni una
 *  descripción: todo sale de aquí. Si cambias un número en este archivo,
 *  cambia en toda la web (packs, carrito, checkout y factura).
 *
 *  ▸ Para editarlo NO hace falta programar: cambia lo que hay entre comillas
 *    o el número, guarda y vuelve a publicar (npm run build).
 *  ▸ Instrucciones paso a paso para el equipo: ver README.md, sección
 *    "Cómo editar precios, packs y códigos promocionales".
 *
 *  ⚠️ REGLA DE ORO DE LOS PRECIOS
 *  Todos los importes se guardan en CÉNTIMOS y en número entero, nunca con
 *  decimales. Es la única forma de que las sumas del carrito no acumulen
 *  errores de redondeo.
 *      699,00 €  →  69900
 *       59,99 €  →   5999
 *       20,00 €  →   2000
 *  Truco: es el precio en euros multiplicado por 100, sin coma.
 *
 *  Cada vez que guardes, un validador comprueba el archivo al compilar y
 *  DETIENE la publicación si algo está mal escrito (un precio con decimales,
 *  un id repetido, un total de cuotas que no cuadra…). Si el build falla,
 *  lee el mensaje: te dice exactamente qué corregir.
 * ══════════════════════════════════════════════════════════════════════════
 */

/* ─────────────────────────── 1 · PROMOCIÓN ──────────────────────────────
 * Interruptor general de la promoción de lanzamiento.
 *
 *   activa   → true  = toda la web muestra los precios de lanzamiento.
 *              false = toda la web vuelve al PVP normal y desaparece
 *                      cualquier referencia a la promoción. Un solo cambio.
 *   etiqueta → el texto del distintivo que acompaña al precio rebajado.
 *   fechaFin → último día de la promoción, en formato AAAA-MM-DD.
 *              Cuando esa fecha pasa, la web deja de anunciar la promoción
 *              automáticamente aunque "activa" siga en true (exigencia legal:
 *              no se puede anunciar una oferta caducada).
 *
 * ⚠️ Si cambias fechaFin, actualiza también la fecha escrita dentro del
 *    texto legal de textosLegales.letraPequenaPacks (apartado 5).
 */
export const promocion = {
  activa: true,
  etiqueta: "Promoción de lanzamiento",
  fechaFin: "2026-10-30",
};

/* ─────────────────────── 2 · PRODUCTOS E ÍTEMS ──────────────────────────
 * Todo lo que existe en el catálogo: lo que forma parte de los packs y lo
 * que además se puede comprar suelto.
 *
 *   id                → identificador interno. NO lo cambies nunca: es lo que
 *                       une este ítem con los packs y con los pedidos ya
 *                       hechos. Sin espacios, sin acentos, en minúscula.
 *   nombreInterno     → cómo lo llamamos en la academia. No se muestra.
 *   nombrePublico     → el nombre que ve el alumno. ESTE es el que sale.
 *   descripcion       → texto que se muestra en la lista del carrito.
 *                       null = todavía no hay texto redactado.
 *   precioPvpCent          → precio normal en céntimos (sin promoción).
 *   precioLanzamientoCent  → precio rebajado en céntimos (con promoción).
 *   anadibleAlCarrito → true  = se puede comprar suelto además del pack.
 *                       false = solo existe dentro de un pack; entonces los
 *                               dos precios van a null.
 *   cantidadMaxima    → tope de unidades por pedido. null = sin límite.
 */
export const items = [
  {
    id: "curso",
    nombreInterno: "Curso",
    nombrePublico: "Curso de Auxiliar Técnico Veterinario",
    descripcion:
      "Formación teórica completa de Auxiliar Técnico Veterinario. Parte teórica con seguimiento, evaluación continua, acceso a tutorías semanales, casos clínicos y situaciones reales del día a día. Acompañamiento antes, durante y después de la formación. Incluye el acompañamiento y búsqueda de centro más adecuado para realizar las prácticas.",
    // El curso NUNCA se vende suelto: solo se obtiene comprando un pack.
    precioPvpCent: null,
    precioLanzamientoCent: null,
    anadibleAlCarrito: false,
    cantidadMaxima: null,
  },
  {
    id: "cuaderno-competencias",
    nombreInterno: "Cuaderno de Prácticas",
    nombrePublico: "Cuaderno de competencias prácticas",
    descripcion:
      "Cuaderno de competencias a cumplimentar durante el periodo de prácticas. Sirve para acreditar la adquisición final de los conceptos vistos en teoría y en los talleres prácticos de la academia.",
    precioPvpCent: 8000,
    precioLanzamientoCent: 4000,
    anadibleAlCarrito: true,
    cantidadMaxima: null,
  },
  {
    id: "taller-practico",
    nombreInterno: "Taller Práctico",
    nombrePublico: "Taller práctico",
    descripcion:
      "Taller presencial práctico que se desarrollará a lo largo de una jornada completa. Se convocará a los alumnos en grupos reducidos para repasar los conceptos teóricos más importantes y poder aprender, entender y poner en práctica los conceptos prácticos. El objetivo es que estén preparados y ganen la máxima confianza posible antes de realizar la estancia de prácticas en centros veterinarios. Es una gran oportunidad para destacar como ATV recién salido de la academia.",
    precioPvpCent: 15000,
    precioLanzamientoCent: 10000,
    anadibleAlCarrito: true,
    cantidadMaxima: null,
  },
  {
    id: "guia-bolsillo",
    nombreInterno: "Libro de Chuletas",
    // ⚠️ Nombre público PROVISIONAL, pendiente de confirmación del cliente.
    nombrePublico: "Guía de bolsillo ATV",
    nombreProvisional: true,
    descripcion:
      "Libro en formato compacto para que te acompañe siempre. Es un resumen práctico creado por AstraVet con los datos y conceptos imprescindibles en tu día a día como ATV.",
    precioPvpCent: 4000,
    precioLanzamientoCent: 2000,
    anadibleAlCarrito: true,
    cantidadMaxima: null,
  },
  {
    id: "temario-impreso",
    nombreInterno: "Temario impreso",
    nombrePublico: "Temario impreso",
    descripcion:
      "Formato físico y más extenso del temario. Esta es la versión del temario extendida únicamente disponible en formato físico. Incluye todos los conceptos de la versión online y los expande en un formato cuidado al detalle y a color.",
    precioPvpCent: 25000,
    precioLanzamientoCent: 20000,
    anadibleAlCarrito: true,
    cantidadMaxima: null,
  },
  {
    id: "consulta-preparatoria",
    nombreInterno: "Tutoría inicial",
    nombrePublico: "Consulta preparatoria",
    descripcion:
      "Es una reunión online inicial personalizada con los tutores del curso. El objetivo de esta reunión es orientar en todo lo referente a cómo prepararse para empezar el curso, pero también para guiarte en cómo será tu día a día mientras los estés cursando, teniendo en cuenta tu situación individual. El objetivo es que empieces de la mejor forma posible y que esa buena dinámica la puedas mantener hasta el final y más allá.",
    precioPvpCent: 5000,
    precioLanzamientoCent: 3000,
    anadibleAlCarrito: true,
    cantidadMaxima: null,
  },
  {
    id: "pijama-sanitario",
    nombreInterno: "Obsequio 4",
    nombrePublico: "Pijama sanitario completo",
    // TODO (cliente): falta redactar la descripción de este producto.
    descripcion: null,
    precioPvpCent: 5000,
    precioLanzamientoCent: 3000,
    anadibleAlCarrito: true,
    cantidadMaxima: null,
  },
  {
    id: "libreta-grande",
    nombreInterno: "Obsequio 1",
    nombrePublico: "Libreta grande y bolígrafo",
    descripcion:
      "Cuaderno de estudio AstraVet formato A4. Para tomar apuntes, organizar temas y crear esquemas durante el curso.",
    precioPvpCent: 2000,
    precioLanzamientoCent: 1000,
    anadibleAlCarrito: true,
    cantidadMaxima: null,
  },
  {
    id: "lanyard",
    nombreInterno: "Obsequio 2",
    nombrePublico: "Lanyard",
    descripcion:
      "Cinta AstraVet para que puedas llevar llaves o acreditación durante prácticas, talleres o eventos formativos.",
    precioPvpCent: 2000,
    precioLanzamientoCent: 1000,
    anadibleAlCarrito: true,
    cantidadMaxima: null,
  },
  {
    id: "libreta-bolsillo",
    nombreInterno: "Obsequio 3",
    nombrePublico: "Libreta de bolsillo",
    descripcion:
      "Libreta compacta AstraVet formato A5. Para anotar claves rápidas, recordatorios, dudas y conceptos importantes.",
    precioPvpCent: 2000,
    precioLanzamientoCent: 1000,
    anadibleAlCarrito: true,
    cantidadMaxima: null,
  },

  /* Estos dos no son productos que se compren: son servicios incluidos que
     aparecen como línea propia en la lista "Incluye:" de los packs. */
  {
    id: "acompanamiento-practicas",
    nombreInterno: "Acompañamiento prácticas",
    nombrePublico: "Acompañamiento para la estancia de prácticas",
    descripcion: null,
    precioPvpCent: null,
    precioLanzamientoCent: null,
    anadibleAlCarrito: false,
    cantidadMaxima: null,
  },
  {
    id: "envio",
    nombreInterno: "Envío",
    nombrePublico: "Envío",
    descripcion: null,
    precioPvpCent: null,
    precioLanzamientoCent: null,
    anadibleAlCarrito: false,
    cantidadMaxima: null,
  },
];

/* ───────────────────────────── 3 · PACKS ────────────────────────────────
 * Los tres packs que se muestran en la sección de matrícula.
 *
 *   id               → identificador interno. No cambiarlo nunca.
 *   nombreInterno    → cómo lo llamamos en la academia. No se muestra.
 *   nombrePublico    → el nombre que ve el alumno.
 *   descripcionBreve → frase que aparece bajo el nombre en la tarjeta.
 *   destacado        → true en el pack remarcado ("El más recomendado").
 *                      Solo puede haber UNO en true.
 *   incluye          → lista de ids del apartado 2, en el orden en que se
 *                      quieren ver en pantalla bajo el título "Incluye:".
 *
 *   precios (todos en CÉNTIMOS, número entero):
 *     unicoPvpCent                → pago único, precio normal.
 *     unicoLanzamientoCent        → pago único, precio de promoción.
 *     mensualPvpCent              → una cuota mensual, precio normal.
 *     mensualPvpTotalCent         → suma de las 12 cuotas normales.
 *     mensualLanzamientoCent      → una cuota mensual, precio de promoción.
 *     mensualLanzamientoTotalCent → suma de las 12 cuotas de promoción.
 *     numeroCuotas                → en cuántos meses se reparte.
 *
 * ⚠️ Los dos totales se escriben a mano (no se calculan solos) porque son
 *    cifras acordadas con el cliente. El validador comprueba que
 *    cuota × numeroCuotas coincide con el total: si no cuadra, el build
 *    falla y te avisa. Así una errata al teclear nunca llega a la web.
 */
export const packs = [
  {
    id: "starter",
    nombreInterno: "Básico",
    nombrePublico: "Starter",
    descripcionBreve: "Lo esencial para comenzar tu formación como ATV.",
    destacado: false,
    incluye: [
      "curso",
      "cuaderno-competencias",
      "acompanamiento-practicas",
      "libreta-grande",
      "envio",
    ],
    precios: {
      unicoPvpCent: 119900,
      unicoLanzamientoCent: 69900,
      mensualPvpCent: 9999,
      mensualPvpTotalCent: 119988,
      mensualLanzamientoCent: 5999,
      mensualLanzamientoTotalCent: 71988,
      numeroCuotas: 12,
    },
  },
  {
    id: "advanced",
    nombreInterno: "Intermedio",
    nombrePublico: "Advanced",
    descripcionBreve:
      "Más recursos materiales y plaza asegurada en los Talleres Prácticos. Para que puedas vivir la experiencia formativa completa y destacar desde el primer día de tus prácticas.",
    destacado: true,
    incluye: [
      "curso",
      "cuaderno-competencias",
      "acompanamiento-practicas",
      "taller-practico",
      "guia-bolsillo",
      "libreta-grande",
      "lanyard",
      "envio",
    ],
    precios: {
      unicoPvpCent: 139900,
      unicoLanzamientoCent: 79900,
      mensualPvpCent: 11699,
      mensualPvpTotalCent: 140388,
      mensualLanzamientoCent: 6799,
      mensualLanzamientoTotalCent: 81588,
      numeroCuotas: 12,
    },
  },
  {
    id: "elite",
    nombreInterno: "Premium",
    nombrePublico: "Elite",
    descripcionBreve:
      "La versión más amplia. Diseñado especialmente para aquellos que quieren una experiencia formativa más exhaustiva y con preferencia por el formato físico.",
    destacado: false,
    incluye: [
      "curso",
      "cuaderno-competencias",
      "acompanamiento-practicas",
      "taller-practico",
      "guia-bolsillo",
      "temario-impreso",
      "consulta-preparatoria",
      "pijama-sanitario",
      "libreta-grande",
      "lanyard",
      "libreta-bolsillo",
      "envio",
    ],
    precios: {
      unicoPvpCent: 179900,
      unicoLanzamientoCent: 109900,
      mensualPvpCent: 14999,
      mensualPvpTotalCent: 179988,
      mensualLanzamientoCent: 9199,
      mensualLanzamientoTotalCent: 110388,
      numeroCuotas: 12,
    },
  },
];

/* ─────────────────── 4 · CÓDIGOS PROMOCIONALES ──────────────────────────
 * Códigos de descuento que se pueden teclear en el paso de pago.
 * Se admiten varios activos a la vez (lo previsto son 2 o 3).
 *
 *   codigo      → lo que teclea el alumno. Se compara sin distinguir
 *                 mayúsculas: "VERANO5" y "verano5" son el mismo.
 *   porcentaje  → descuento en % sobre el precio del PACK (nunca sobre los
 *                 ítems sueltos). 5 = un 5 % de descuento.
 *   fechaInicio → primer día en que funciona, formato AAAA-MM-DD.
 *   fechaFin    → último día en que funciona, formato AAAA-MM-DD.
 *   activo      → false lo desactiva al instante sin tener que borrarlo.
 *   usosMaximos → número total de veces que puede canjearse. null = sin tope.
 *   acumulable  → false (lo habitual, y lo que dice nuestra letra pequeña):
 *                 el código NO se suma a la promoción de lanzamiento; se
 *                 aplica sobre el PVP normal. true solo si el cliente quiere
 *                 expresamente que se acumule a la oferta vigente.
 *
 * ⚠️ El descuento siempre se vuelve a calcular en el servidor antes de
 *    cobrar. Este archivo solo define qué códigos existen.
 *
 * TODO (cliente): entregar los códigos reales. De momento la lista va vacía,
 * lo que significa que ningún código es válido (el campo sigue apareciendo
 * en el checkout y responde "código no válido").
 */
export const codigosPromocionales = [
  // Ejemplo del formato (déjalo comentado hasta tener códigos reales):
  // {
  //   codigo: "EJEMPLO5",
  //   porcentaje: 5,
  //   fechaInicio: "2026-09-01",
  //   fechaFin: "2026-10-30",
  //   activo: true,
  //   usosMaximos: null,
  //   acumulable: false,
  // },
];

/* ──────────────────────── 5 · TEXTOS LEGALES ────────────────────────────
 * Textos que acompañan a los precios. Son legalmente relevantes
 * (Ley 7/1996 de Ordenación del Comercio Minorista): no los recortes ni los
 * reescribas sin pasarlos antes por la asesoría.
 */
export const textosLegales = {
  // Letra pequeña bajo la sección de packs. Cada elemento es un párrafo.
  letraPequenaPacks: [
    "Promoción sujeta a disponibilidad de plazas y válida hasta el 30 de octubre de 2026. No acumulable a otras promociones, descuentos o códigos promocionales, salvo indicación expresa.",
    "AstraVet podrá modificar, ampliar o finalizar sus promociones, precios, packs y condiciones comerciales para futuras convocatorias o nuevas reservas. Las compras o reservas ya confirmadas mantendrán las condiciones aceptadas en el momento de contratación.",
  ],
  // Etiqueta que acompaña siempre al precio sin promoción.
  etiquetaPvpPosterior: "PVP al acabar la promoción",
};

/* ─────────────── 6 · CONTRATO DE CONDICIONES DEL CURSO ──────────────────
 * Texto que el alumno debe leer y aceptar antes de pagar. Se guarda junto al
 * pedido la versión aceptada y el momento exacto de la aceptación, para poder
 * demostrar qué condiciones concretas aceptó cada alumno.
 *
 *   version   → SÚBELA cada vez que cambies el texto (0.1 → 0.2 → 1.0…).
 *               Es lo que queda registrado en el pedido.
 *   parrafos  → el contenido del contrato, un elemento por párrafo.
 *
 * TODO (cliente): entregar el texto del contrato (qué incluye el curso, a qué
 * tiene derecho el alumno, qué derechos cede: acceso al campus virtual,
 * videoconferencias, uso del material…). Mientras "parrafos" esté vacío, el
 * checkout muestra un aviso de texto pendiente en lugar del contrato.
 */
export const contrato = {
  version: "0.0-pendiente",
  parrafos: [],
};

/* ──────────────────────────── 7 · IVA ───────────────────────────────────
 * TODO (cliente): pendiente de confirmar con la asesoría si la formación
 * está exenta de IVA. Afecta a los precios mostrados y a la factura, así que
 * NO se decide desde el código.
 *
 *   exento → true si la formación está exenta; false si lleva IVA.
 *   tipo   → porcentaje aplicable cuando exento es false (por ejemplo 21).
 *   null en cualquiera de los dos = todavía sin decidir.
 */
export const iva = {
  exento: null,
  tipo: null,
};

export default {
  promocion,
  items,
  packs,
  codigosPromocionales,
  textosLegales,
  contrato,
  iva,
};
