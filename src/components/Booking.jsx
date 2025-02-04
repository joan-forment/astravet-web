import { useEffect, useRef } from "react";

import ListaCheck from "./ListaCheck.jsx";
import StarIcon from "./StarIcon.jsx";
import { useFormModal } from "../forms/FormModal.jsx";
import { BOOKING, CONTACT } from "../config/site.js";

/*
 * Reserva de reunión informativa con sincronización REAL con Outlook.
 *
 * El calendario lo provee una herramienta externa (Calendly / Cal.com /
 * Microsoft Bookings) que lee tus huecos ocupados en Outlook y solo ofrece
 * tu tiempo libre. La pregunta obligatoria "Teams o llamada" y los datos del
 * usuario se configuran como pregunta personalizada dentro de esa herramienta.
 *
 * Configuración: pega la URL en BOOKING.url (src/config/site.js).
 * Mientras esté vacía, se muestra un aviso "próximamente" con vías de contacto
 * alternativas, sin romper el layout.
 */

function CalendlyEmbed({ url }) {
  const ref = useRef(null);

  useEffect(() => {
    // Carga el script del widget de Calendly una sola vez.
    const SRC = "https://assets.calendly.com/assets/external/widget.js";
    if (!document.querySelector(`script[src="${SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    // Calendly necesita una ALTURA fija: con solo min-height su iframe se queda en ~150 px.
    <div
      ref={ref}
      className="calendly-inline-widget h-[720px] w-full overflow-hidden rounded-2xl sm:h-[660px]"
      // Sin la cabecera de Calendly (logo y nombre del evento) y con los colores de la web,
      // para que el calendario se vea como parte del diseño y no como una página incrustada.
      data-url={`${url}?hide_gdpr_banner=1&hide_event_type_details=1&hide_landing_page_details=1&background_color=101f45&text_color=ffffff&primary_color=12b3b6`}
      style={{ minWidth: "320px" }}
    />
  );
}

function GenericIframe({ url }) {
  return (
    <iframe
      title="Reserva de reunión informativa"
      src={url}
      className="min-h-[680px] w-full rounded-card border-0"
      loading="lazy"
    />
  );
}

function BookingFallback() {
  const { open } = useFormModal();
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-card border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
      <StarIcon className="mb-6 h-10 w-10 text-turquoise" />
      <p className="max-w-md text-lg font-medium leading-relaxed text-white/75">
        La agenda online estará disponible muy pronto. Mientras tanto, escríbenos
        y reservamos tu reunión informativa contigo directamente.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => open("info")}
          data-cursor-label="Sin compromiso"
          className="rounded-full bg-turquoise px-7 py-3.5 text-sm font-bold tracking-wide text-navy transition-colors hover:bg-turquoise-bright"
        >
          Solicitar información
        </button>
        <a
          href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-label="WhatsApp"
          className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:border-turquoise"
        >
          Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function Booking() {
  const hasCalendar = Boolean(BOOKING.url);

  return (
    <section
      id="reserva-reunion"
      className="section-dark-solid relative overflow-hidden py-28 sm:py-36"
    >
      <div className="glow-turquoise pointer-events-none absolute -right-[15%] top-[10%] h-[50vmax] w-[50vmax]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12">
        {/* Encabezado de sección */}
        <div className="mb-16 flex items-baseline gap-6">
          <span className="text-sm font-black text-turquoise">06</span>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-white/50">
            Agenda
          </p>
          <span className="hidden h-px flex-1 bg-white/10 sm:block" />
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-12">
          {/* Texto + disclaimer */}
          <div className="lg:col-span-5">
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-turquoise">
              <StarIcon withCross={false} className="h-3.5 w-3.5 text-turquoise" />
              Reunión informativa
            </p>
            <h2 className="mt-5 text-4xl font-black uppercase leading-[1.04] tracking-tight sm:text-5xl">
              Reserva una <span className="text-highlight">reunión</span>
            </h2>
            <p className="mt-6 text-lg font-medium leading-relaxed text-white/65">
              Elige el día y la hora que te vengan bien. Verás solo nuestros
              huecos libres, en tiempo real. Resolvemos todas tus dudas sobre el
              curso, sin compromiso.
            </p>

            <ListaCheck
              className="mt-8"
              items={[
                "Disponibilidad real sincronizada con nuestra agenda",
                "Elige reunión por Teams o llamada telefónica",
                "Recibirás confirmación y recordatorio por email",
              ]}
            />

            {/* Disclaimer pedido por el cliente */}
            <div className="mt-9 rounded-2xl border border-turquoise/25 bg-turquoise/[0.06] p-5">
              <p className="text-sm font-medium leading-relaxed text-white/75">
                Del mismo modo que este calendario funciona para entrevistas y
                sesiones informativas, nuestro campus virtual contará con esta
                misma herramienta para que agendes tus sesiones de tutoría.
              </p>
            </div>
          </div>

          {/* Calendario */}
          <div className="lg:col-span-7">
            <div className="theme-static relative overflow-hidden rounded-panel border border-white/10 bg-gradient-to-br from-navy-soft/80 to-navy-deep/90 p-4 sm:p-6">
              <div className="glow-turquoise pointer-events-none absolute -right-[25%] -top-[20%] h-[30vmax] w-[30vmax]" />
              {hasCalendar && (
                <div className="relative mb-2 flex flex-wrap items-end justify-between gap-3 px-2 pt-1 sm:px-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-turquoise">
                      Agenda online · 30 min
                    </p>
                    <p className="mt-1 text-lg font-black tracking-tight text-white">
                      Elige día y hora
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-white/50">Por Teams o por teléfono</p>
                </div>
              )}
              {!hasCalendar ? (
                <BookingFallback />
              ) : BOOKING.provider === "calendly" ? (
                <div className="relative"><CalendlyEmbed url={BOOKING.url} /></div>
              ) : (
                <GenericIframe url={BOOKING.url} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
