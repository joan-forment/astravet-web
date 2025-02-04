/*
 * Lógica de precios de AstraVet.
 *
 * Aquí vive TODO el cálculo de dinero: qué precio está vigente, cuánto suma el
 * carrito, cómo se aplica un código de descuento y qué se cobra hoy frente a
 * lo que se cobrará en las cuotas siguientes.
 *
 * Los componentes de la web no calculan precios: los piden a este archivo.
 * Las funciones de servidor volverán a ejecutar estas mismas funciones antes
 * de cobrar, para que el importe nunca dependa de lo que diga el navegador.
 *
 * ⚠️ Todo se maneja en CÉNTIMOS enteros. La división por 100 ocurre solo en el
 *    último momento, dentro de formatearEuros(), para pintar el número.
 */

import {
  promocion,
  items,
  packs,
  codigosPromocionales,
  textosLegales,
} from "./catalogo.js";

/* ────────────────────────────── FORMATO ─────────────────────────────── */

/**
 * Convierte céntimos en un importe en euros listo para mostrar.
 * Los importes redondos se muestran sin decimales (699 €) y los que tienen
 * céntimos, con dos (59,99 €).
 * @param {number} cent Importe en céntimos.
 * @returns {string} Por ejemplo "699 €" o "59,99 €".
 */
export function formatearEuros(cent) {
  const sinDecimales = cent % 100 === 0;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: sinDecimales ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cent / 100);
}

/**
 * Pasa una fecha "2026-10-30" al formato español "30/10/2026".
 * @param {string} fechaIso
 * @returns {string}
 */
export function formatearFechaCorta(fechaIso) {
  const [anio, mes, dia] = fechaIso.split("-");
  return `${dia}/${mes}/${anio}`;
}

/* ──────────────────────────── PROMOCIÓN ─────────────────────────────── */

/** Devuelve la fecha de hoy como "AAAA-MM-DD" en horario local. */
function hoyIso(hoy = new Date()) {
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

/**
 * ¿Se está anunciando la promoción ahora mismo?
 *
 * Hacen falta dos condiciones: que el interruptor promocion.activa esté en
 * true Y que no se haya pasado la fecha de fin. Lo segundo es una exigencia
 * legal: no se puede anunciar una oferta ya caducada aunque se olvide apagar
 * el interruptor.
 *
 * @param {Date} [hoy] Solo se usa en los tests para simular otra fecha.
 * @returns {boolean}
 */
export function promocionVigente(hoy = new Date()) {
  if (!promocion.activa) return false;
  return hoyIso(hoy) <= promocion.fechaFin;
}

/** Fecha de fin de la promoción en formato español: "30/10/2026". */
export function fechaFinPromocion() {
  return formatearFechaCorta(promocion.fechaFin);
}

/**
 * Frase que debe acompañar a cualquier precio promocional que se anuncie.
 * @returns {string} "Promoción válida hasta el 30/10/2026"
 */
export function avisoValidezPromocion() {
  return `Promoción válida hasta el ${fechaFinPromocion()}`;
}

/* ─────────────────────── CONSULTAS DEL CATÁLOGO ─────────────────────── */

/** Busca un ítem por su id. Devuelve undefined si no existe. */
export function obtenerItem(id) {
  return items.find((item) => item.id === id);
}

/** Busca un pack por su id. Devuelve undefined si no existe. */
export function obtenerPack(id) {
  return packs.find((pack) => pack.id === id);
}

/**
 * Ítems que se pueden comprar sueltos, en el orden del catálogo.
 * El curso queda fuera por definición: solo existe dentro de un pack.
 */
export function itemsAnadibles() {
  return items.filter((item) => item.anadibleAlCarrito);
}

/**
 * Los packs en el orden en que deben verse en escritorio, con el destacado
 * en el centro (efecto ancla: Starter · Advanced · Elite).
 */
export function packsOrdenEscritorio() {
  return packs;
}

/**
 * Los packs en el orden en que deben verse en móvil: el destacado primero,
 * para que no quede enterrado bajo el scroll.
 */
export function packsOrdenMovil() {
  const destacado = packs.filter((pack) => pack.destacado);
  const resto = packs.filter((pack) => !pack.destacado);
  return [...destacado, ...resto];
}

/* ─────────────────────── PRECIOS DE UN PRODUCTO ─────────────────────── */

/**
 * Precio unitario vigente de un ítem suelto.
 * @param {object} item Ítem del catálogo.
 * @param {boolean} [conPromocion] Si no se indica, se mira la promoción real.
 * @returns {number} Céntimos.
 */
export function precioItemCent(item, conPromocion = promocionVigente()) {
  if (!item.anadibleAlCarrito) {
    throw new Error(
      `El ítem "${item.id}" no se vende suelto: no tiene precio propio.`
    );
  }
  return conPromocion ? item.precioLanzamientoCent : item.precioPvpCent;
}

/**
 * Todos los precios de un pack ya resueltos para pintarlos en pantalla.
 *
 * Devuelve a la vez el precio vigente y el PVP, porque la ley exige mostrar
 * ambos cuando se anuncia una rebaja, y devuelve siempre el total de las 12
 * cuotas junto a la cuota mensual, que nunca puede anunciarse sola.
 *
 * @param {object} pack Pack del catálogo.
 * @param {boolean} [conPromocion]
 */
export function preciosPack(pack, conPromocion = promocionVigente()) {
  const p = pack.precios;
  return {
    hayPromocion: conPromocion,
    numeroCuotas: p.numeroCuotas,

    // Pago único
    unicoVigenteCent: conPromocion ? p.unicoLanzamientoCent : p.unicoPvpCent,
    unicoPvpCent: p.unicoPvpCent,

    // Pago mensual: la cuota y, obligatoriamente, el total de las cuotas
    mensualVigenteCent: conPromocion ? p.mensualLanzamientoCent : p.mensualPvpCent,
    mensualVigenteTotalCent: conPromocion
      ? p.mensualLanzamientoTotalCent
      : p.mensualPvpTotalCent,
    mensualPvpCent: p.mensualPvpCent,
    mensualPvpTotalCent: p.mensualPvpTotalCent,
  };
}

/* ─────────────────── CÓDIGOS PROMOCIONALES ──────────────────────────── */

/**
 * Comprueba si un código existe y está vigente.
 *
 * Ojo: esto es solo la primera comprobación, la que da respuesta inmediata al
 * usuario mientras escribe. El descuento definitivo SIEMPRE se recalcula en el
 * servidor antes de cobrar, incluido el control de usos máximos, que no puede
 * llevarse desde el navegador.
 *
 * @param {string} texto Lo que ha tecleado el usuario.
 * @param {Date} [hoy]
 * @returns {{valido: boolean, motivo: string|null, codigo: object|null}}
 */
export function validarCodigoPromocional(texto, hoy = new Date()) {
  const buscado = String(texto ?? "").trim().toUpperCase();
  if (!buscado) {
    return { valido: false, motivo: "Escribe un código.", codigo: null };
  }

  const codigo = codigosPromocionales.find(
    (c) => c.codigo.trim().toUpperCase() === buscado
  );
  if (!codigo) {
    return { valido: false, motivo: "Este código no es válido.", codigo: null };
  }
  if (!codigo.activo) {
    return { valido: false, motivo: "Este código ya no está disponible.", codigo: null };
  }

  const hoyTexto = hoyIso(hoy);
  if (hoyTexto < codigo.fechaInicio) {
    return { valido: false, motivo: "Este código todavía no está activo.", codigo: null };
  }
  if (hoyTexto > codigo.fechaFin) {
    return { valido: false, motivo: "Este código ha caducado.", codigo: null };
  }

  return { valido: true, motivo: null, codigo };
}

/**
 * Aplica un código sobre un importe del pack.
 *
 * Regla de no acumulación (la que dice nuestra letra pequeña):
 *  · acumulable: false → el descuento se calcula sobre el PVP, no sobre el
 *    precio de promoción. Si el resultado no mejora el precio que ya tenía el
 *    alumno, se le deja el precio bueno y se avisa de que el código no mejora
 *    la oferta vigente. Nunca se le cobra más por usar un código.
 *  · acumulable: true → el descuento se calcula sobre el precio vigente, así
 *    que sí se suma a la promoción de lanzamiento. Es lo que se usa para los
 *    códigos pequeños (un 5 %) en temporada ya rebajada.
 *
 * @param {number} vigenteCent Precio que pagaría sin código.
 * @param {number} pvpCent Precio normal del mismo concepto.
 * @param {object|null} codigo Código ya validado, o null.
 * @returns {{finalCent: number, descuentoCent: number, mejora: boolean}}
 */
export function aplicarCodigoAImporte(vigenteCent, pvpCent, codigo) {
  if (!codigo) {
    return { finalCent: vigenteCent, descuentoCent: 0, mejora: false };
  }

  const base = codigo.acumulable ? vigenteCent : pvpCent;
  const conDescuento = base - Math.round((base * codigo.porcentaje) / 100);
  const finalCent = Math.min(vigenteCent, conDescuento);

  return {
    finalCent,
    descuentoCent: vigenteCent - finalCent,
    mejora: finalCent < vigenteCent,
  };
}

/* ─────────────────────────── EL CARRITO ─────────────────────────────── */

/**
 * Calcula el desglose completo de un carrito.
 *
 * Reglas de negocio que aplica:
 *  · Solo los packs admiten pago aplazado. Los ítems sueltos van siempre a
 *    pago único, se combinen con lo que se combinen.
 *  · Con el pack en modalidad mensual se cobra hoy el importe de los ítems más
 *    la primera cuota, y quedan pendientes las cuotas restantes.
 *  · El código promocional descuenta solo sobre el pack, nunca sobre los ítems.
 *
 * @param {object} carrito
 * @param {string|null} carrito.packId
 * @param {"unico"|"mensual"} carrito.modalidad
 * @param {Array<{itemId: string, cantidad: number}>} [carrito.lineas]
 * @param {object|null} [carrito.codigo] Código ya validado.
 * @param {boolean} [carrito.conPromocion]
 */
export function calcularCarrito({
  packId = null,
  modalidad = "unico",
  lineas = [],
  codigo = null,
  conPromocion = promocionVigente(),
}) {
  const pack = packId ? obtenerPack(packId) : null;
  if (packId && !pack) {
    throw new Error(`El pack "${packId}" no existe en el catálogo.`);
  }

  /* ── Ítems sueltos: siempre pago único ── */
  const detalleLineas = lineas.map(({ itemId, cantidad }) => {
    const item = obtenerItem(itemId);
    if (!item) throw new Error(`El ítem "${itemId}" no existe en el catálogo.`);
    if (!item.anadibleAlCarrito) {
      throw new Error(
        `El ítem "${itemId}" no se puede añadir al carrito por separado.`
      );
    }
    const unidades = Math.max(1, Math.trunc(cantidad));
    const precioUnitarioCent = precioItemCent(item, conPromocion);
    return {
      itemId: item.id,
      nombrePublico: item.nombrePublico,
      cantidad: unidades,
      precioUnitarioCent,
      precioPvpUnitarioCent: item.precioPvpCent,
      subtotalCent: precioUnitarioCent * unidades,
    };
  });

  const itemsSubtotalCent = detalleLineas.reduce(
    (suma, linea) => suma + linea.subtotalCent,
    0
  );

  /* ── Pack ── */
  let detallePack = null;
  let aPagarHoyCent = itemsSubtotalCent;
  let cuotasFuturas = null;
  let totalCompromisoCent = itemsSubtotalCent;

  if (pack) {
    const precios = preciosPack(pack, conPromocion);

    if (modalidad === "mensual") {
      const cuota = aplicarCodigoAImporte(
        precios.mensualVigenteCent,
        precios.mensualPvpCent,
        codigo
      );
      const cuotaCent = cuota.finalCent;
      const totalCuotasCent = cuotaCent * precios.numeroCuotas;

      detallePack = {
        id: pack.id,
        nombrePublico: pack.nombrePublico,
        modalidad: "mensual",
        numeroCuotas: precios.numeroCuotas,
        cuotaCent,
        totalCuotasCent,
        cuotaSinCodigoCent: precios.mensualVigenteCent,
        descuentoCent: cuota.descuentoCent * precios.numeroCuotas,
        codigoMejoraPrecio: cuota.mejora,
      };

      // Se cobra hoy la primera cuota; las demás quedan domiciliadas.
      aPagarHoyCent = itemsSubtotalCent + cuotaCent;
      cuotasFuturas = {
        numero: precios.numeroCuotas - 1,
        importeCent: cuotaCent,
        totalCent: cuotaCent * (precios.numeroCuotas - 1),
      };
      totalCompromisoCent = itemsSubtotalCent + totalCuotasCent;
    } else {
      const unico = aplicarCodigoAImporte(
        precios.unicoVigenteCent,
        precios.unicoPvpCent,
        codigo
      );

      detallePack = {
        id: pack.id,
        nombrePublico: pack.nombrePublico,
        modalidad: "unico",
        precioCent: unico.finalCent,
        precioSinCodigoCent: precios.unicoVigenteCent,
        descuentoCent: unico.descuentoCent,
        codigoMejoraPrecio: unico.mejora,
      };

      aPagarHoyCent = itemsSubtotalCent + unico.finalCent;
      totalCompromisoCent = aPagarHoyCent;
    }
  }

  return {
    conPromocion,
    pack: detallePack,
    lineas: detalleLineas,
    itemsSubtotalCent,
    descuentoCent: detallePack?.descuentoCent ?? 0,
    aPagarHoyCent,
    cuotasFuturas,
    totalCompromisoCent,
    // Nota para la interfaz: con pack mensual + ítems hay un cobro hoy y una
    // suscripción; la pantalla debe separar ambos importes con claridad.
    cobroMixto: Boolean(detallePack?.modalidad === "mensual" && itemsSubtotalCent > 0),
  };
}

/* Reexporta la letra pequeña para que los componentes no importen el catálogo
   directamente y no puedan llegar a duplicar el texto legal. */
export const letraPequenaPacks = textosLegales.letraPequenaPacks;
export const etiquetaPvpPosterior = textosLegales.etiquetaPvpPosterior;
