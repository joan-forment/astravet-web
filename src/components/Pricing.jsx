import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import StarIcon from "./StarIcon.jsx";
import { useFormModal } from "../forms/FormModal.jsx";
import { packs, promocion } from "../config/catalogo.js";
import {
  avisoValidezPromocion,
  etiquetaPvpPosterior,
  formatearEuros,
  letraPequenaPacks,
  obtenerItem,
  packsOrdenMovil,
  preciosPack,
  promocionVigente,
} from "../config/precios.js";

/*
 * Sección de Matrícula · los tres packs.
 *
 * Versión sin TPV: elegir un pack abre «Reserva tu plaza» con el pack ya
 * indicado, y la pantalla de gracias muestra el IBAN para pagar por
 * transferencia. Cuando haya TPV, la versión con carrito vive en la carpeta
 * «web astravet» (src/tienda/).
 *
 * Ningún precio ni ningún texto de producto vive aquí: todo sale de
 * src/config/catalogo.js a través de src/config/precios.js. Cambiar un precio
 * en el catálogo se refleja en esta sección sin tocar este archivo.
 *
 * Decisiones de presentación pedidas por el cliente:
 *  · Los tres packs se ven a la vez en escritorio, con el destacado en el
 *    centro. En móvil el destacado va primero para que no quede enterrado.
 *  · NO hay tabla comparativa de checks y cruces: cada pack lleva su propia
 *    lista "Incluye:".
 *  · El pago mensual es el protagonista, con el total de las cuotas SIEMPRE
 *    dentro del mismo recuadro, y el pago único bien visible debajo.
 *
 * Requisitos legales que hay que respetar al tocar este archivo
 * (Ley 7/1996 de Ordenación del Comercio Minorista):
 *  · Nunca se anuncia una cuota mensual sin el total de las 12 cuotas al lado.
 *  · El total de las 12 cuotas y el pago único son importes distintos: los dos
 *    tienen que poder consultarse sin inducir a confusión.
 *  · Donde haya un precio promocional, tiene que verse la fecha de fin.
 *  · El precio posterior a la promoción va en gris apagado, pero legible:
 *    mínimo 12 px y contraste AA (text-white/60 sobre estas tarjetas cumple).
 */

/* Coloca cada pack en su columna de escritorio. El orden del DOM es el de
   móvil (destacado primero); en pantallas grandes, "order" recompone la fila
   al orden del catálogo: Starter · Advanced · Elite. */
const COLUMNA_ESCRITORIO = ["lg:order-1", "lg:order-2", "lg:order-3"];

/* Datos estructurados para Google: cada pack es un Product con su Offer.
   Se anuncia el pago único, que es el importe total de la compra. */
function datosEstructurados(hayPromocion) {
  return {
    "@context": "https://schema.org",
    "@graph": packs.map((pack) => {
      const precios = preciosPack(pack, hayPromocion);
      return {
        "@type": "Product",
        name: `Pack ${pack.nombrePublico} · Curso de Auxiliar Técnico Veterinario`,
        description: pack.descripcionBreve,
        brand: { "@type": "Brand", name: "AstraVet" },
        offers: {
          "@type": "Offer",
          url: "https://www.astravet.es/#precios",
          priceCurrency: "EUR",
          price: (precios.unicoVigenteCent / 100).toFixed(2),
          availability: "https://schema.org/InStock",
          ...(hayPromocion ? { priceValidUntil: promocion.fechaFin } : {}),
        },
      };
    }),
  };
}

/* Recuadro del pago mensual: el protagonista. La cuota va en grande y el
   total de las cuotas, obligatoriamente, dentro del mismo recuadro. */
function BloqueMensual({ precios }) {
  return (
    <div className="rounded-2xl border border-turquoise/25 bg-turquoise/[0.07] p-5">
      {precios.hayPromocion && (
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-amber">
          <span className="h-1.5 w-1.5 rounded-full bg-amber" />
          {promocion.etiqueta}
        </p>
      )}

      <p className="flex items-baseline gap-1.5">
        <span className="text-4xl font-black tracking-tight text-white sm:text-[2.75rem]">
          {formatearEuros(precios.mensualVigenteCent)}
        </span>
        <span className="text-sm font-bold text-white/70">/mes</span>
      </p>
      <p className="mt-1.5 text-sm font-semibold text-white/75">
        {precios.numeroCuotas} cuotas · Total{" "}
        {formatearEuros(precios.mensualVigenteTotalCent)}
      </p>

      {precios.hayPromocion && (
        <div className="mt-4 border-t border-white/10 pt-3.5">
          <p className="text-xs font-medium leading-relaxed text-white/60">
            {etiquetaPvpPosterior}:{" "}
            {formatearEuros(precios.mensualPvpCent)}/mes · Total{" "}
            {formatearEuros(precios.mensualPvpTotalCent)}
          </p>
          <p className="mt-1.5 text-xs font-medium text-white/60">
            {avisoValidezPromocion()}
          </p>
        </div>
      )}
    </div>
  );
}

/* Recuadro del pago único, con su PVP posterior dentro del mismo recuadro. */
function BloqueUnico({ precios }) {
  return (
    <div className="mt-3 rounded-2xl border border-white/12 bg-white/[0.03] p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
        Pago único
      </p>
      <p className="mt-1.5 text-2xl font-black tracking-tight text-white">
        {formatearEuros(precios.unicoVigenteCent)}
      </p>

      {precios.hayPromocion && (
        <>
          <p className="mt-2 text-xs font-medium leading-relaxed text-white/60">
            {etiquetaPvpPosterior}: {formatearEuros(precios.unicoPvpCent)}
          </p>
          <p className="mt-1.5 text-xs font-medium text-white/60">
            {avisoValidezPromocion()}
          </p>
        </>
      )}
    </div>
  );
}

function TarjetaPack({ pack, hayPromocion, columna }) {
  const { open } = useFormModal();
  const precios = preciosPack(pack, hayPromocion);

  /* Sin TPV todavía: el pack se reserva con el formulario y se paga por
     transferencia (los datos salen al enviar). */
  const alElegir = () => open("reserva", { pack: pack.nombrePublico });

  return (
    <article
      className={`pricing-card relative flex flex-col rounded-[2rem] border p-6 transition-colors duration-500 sm:p-7 ${columna} ${
        pack.destacado
          ? "border-2 border-amber bg-amber/[0.06] shadow-[0_0_50px_-12px_rgba(255,179,71,0.35)] lg:-mt-4 lg:pb-9"
          : "border-white/10 bg-white/[0.03] hover:border-white/25"
      }`}
    >
      {pack.destacado && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-navy">
          El más recomendado
        </span>
      )}

      <h3
        className={`mt-2 text-2xl font-black uppercase tracking-tight ${
          pack.destacado ? "text-amber" : "text-white"
        }`}
      >
        {pack.nombrePublico}
      </h3>
      <p className="mt-2.5 text-sm font-medium leading-relaxed text-white/70 lg:min-h-[8.5rem]">
        {pack.descripcionBreve}
      </p>

      <div className="mt-6">
        <BloqueMensual precios={precios} />
        <BloqueUnico precios={precios} />
      </div>

      {/* Lo que incluye el pack. Lista simple, nunca una tabla comparativa. */}
      <div className="mb-7 mt-7 border-t border-white/10 pt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-turquoise">
          Incluye:
        </p>
        <ul className="mt-4 space-y-2.5">
          {pack.incluye.map((id) => {
            const item = obtenerItem(id);
            return (
              <li
                key={id}
                className="flex items-start gap-3 text-sm font-medium leading-snug text-white/80"
              >
                <StarIcon
                  className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                    pack.destacado ? "text-amber" : "text-turquoise"
                  }`}
                />
                {item.nombrePublico}
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        onClick={alElegir}
        data-cursor-label="Reservar"
        className={`group relative mt-auto w-full overflow-hidden rounded-full px-7 py-4 text-sm font-bold tracking-wide transition-colors ${
          pack.destacado
            ? "bg-amber text-navy"
            : "border border-white/20 text-white hover:border-turquoise"
        }`}
      >
        {pack.destacado && (
          <span className="absolute inset-0 -translate-x-full bg-turquoise-bright transition-transform duration-500 ease-out group-hover:translate-x-0" />
        )}
        <span className="relative">Reservar con {pack.nombrePublico}</span>
      </button>
    </article>
  );
}

export default function Pricing({ reduced }) {
  const sectionRef = useRef(null);
  const hayPromocion = promocionVigente();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".pricing-card", {
        autoAlpha: 0,
        y: 50,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".pricing-grid", start: "top 80%", once: true },
      });
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      id="precios"
      ref={sectionRef}
      className="section-dark-solid relative overflow-hidden py-28 sm:py-36"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datosEstructurados(hayPromocion)),
        }}
      />

      <div className="glow-amber pointer-events-none absolute -left-[20%] top-0 h-[55vmax] w-[55vmax]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12">
        {/* Encabezado de sección */}
        <div className="mb-16 flex items-baseline gap-6">
          <span className="text-sm font-black text-turquoise">05</span>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-white/50">
            Matrícula
          </p>
          <span className="hidden h-px flex-1 bg-white/10 sm:block" />
        </div>

        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-turquoise">
            <StarIcon className="h-3.5 w-3.5 text-turquoise" />
            Elige tu plan
          </p>
          <h2 className="mt-5 text-4xl font-black uppercase leading-[1.04] tracking-tight sm:text-5xl">
            Invierte en tu <span className="text-highlight">futuro</span>
          </h2>
          <p className="mt-6 text-lg font-medium leading-relaxed text-white/65">
            Los tres packs incluyen el Curso de Auxiliar Técnico Veterinario y
            el acompañamiento para la estancia de prácticas. Elige hasta dónde
            quieres llegar.
          </p>
        </div>

        {/* Packs */}
        <div className="pricing-grid mt-14 grid gap-6 lg:grid-cols-3 lg:gap-5">
          {packsOrdenMovil().map((pack) => (
            <TarjetaPack
              key={pack.id}
              pack={pack}
              hayPromocion={hayPromocion}
              columna={
                COLUMNA_ESCRITORIO[packs.findIndex((p) => p.id === pack.id)]
              }
            />
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-sm font-medium leading-relaxed text-white/70">
          <span className="font-bold text-white">¿Cómo se paga?</span> De
          momento, por transferencia bancaria: reserva tu plaza con el pack que
          prefieras y te mostraremos los datos de pago. Te contactaremos para
          confirmarlo todo.
        </p>

        {/* Letra pequeña legal. Obligatoria mientras se anuncie la promoción. */}
        {hayPromocion && (
          <div className="mt-12 max-w-4xl space-y-3">
            {letraPequenaPacks.map((parrafo) => (
              <p
                key={parrafo.slice(0, 40)}
                className="text-xs font-medium leading-relaxed text-white/60"
              >
                {parrafo}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
