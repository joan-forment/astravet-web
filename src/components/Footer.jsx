import { useId, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

import Icon from "./icons.jsx";
import StarIcon from "./StarIcon.jsx";
import useFontsReady from "../hooks/useFontsReady.js";
import { useFormModal } from "../forms/FormModal.jsx";
import { submitForm } from "../forms/submitForm.js";
import { CONTACT } from "../config/site.js";
import { CAMPUS_DEMO_URL, PAGINAS } from "../config/seo.js";

const SOCIALS = [
  { name: "Instagram", href: "https://instagram.com/astravet" },
  { name: "YouTube", href: "https://youtube.com/@astravet" },
  { name: "TikTok", href: "https://tiktok.com/@astravet" },
  { name: "LinkedIn", href: "https://linkedin.com/company/astravet" },
];

const LEGAL = [
  ["Responsable", "Astra Vet"],
  ["Contacto", "admin@astravet.es"],
  ["Finalidad", "Gestión de solicitudes, reservas y comunicaciones."],
  ["Legitimación", "Consentimiento del interesado."],
  ["Destinatarios", "No se cederán datos a terceros salvo obligación legal."],
  ["Derechos", "Acceso, rectificación, supresión según normativa."],
];

const GUIDES = [
  ["Temario completo del curso", `/${PAGINAS.temario.slug}/`],
  ["Qué es un Auxiliar Técnico Veterinario", `/${PAGINAS.queEs.slug}/`],
  ["Preguntas frecuentes", `/${PAGINAS.faq.slug}/`],
  ["Campus virtual", `/${PAGINAS.campus.slug}/`],
  ["Prueba la demo del campus", CAMPUS_DEMO_URL],
];

const MARQUEE_TEXT ="Sigue la estrella · Aprende sin límites · ";

/* Checkbox legal en versión clara (footer sobre blanco) */
function LightCheckbox({ name, children, required = false }) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      data-cursor-label="Aceptar"
      className="flex cursor-pointer items-start gap-3 text-sm font-medium leading-relaxed text-navy/70"
    >
      <input id={id} name={name} type="checkbox" required={required} className="peer sr-only" />
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-navy/25 bg-navy/[0.04] transition-colors peer-checked:border-turquoise peer-checked:bg-turquoise">
        <Icon
          name="check"
          className="h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
          weight={2.2}
        />
      </span>
      <span>{children}</span>
    </label>
  );
}

function NewsletterForm() {
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const emailId = useId();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    setError("");
    try {
      await submitForm(form, {
        subject: "Nueva suscripción a la newsletter · Astra Vet",
        from_name: "Web Astra Vet",
      });
      setDone(true);
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-4 rounded-card border border-turquoise/30 bg-turquoise/[0.07] px-7 py-6">
        <StarIcon className="h-9 w-9 shrink-0 text-turquoise" />
        <p className="text-sm font-medium leading-relaxed text-navy-deep">
          ¡Listo! Te avisaremos de las novedades y futuras convocatorias.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:border sm:border-navy/15 sm:bg-navy/[0.04] sm:p-2">
        <label htmlFor={emailId} className="sr-only">
          Tu correo electrónico
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          className="w-full flex-1 rounded-full border border-navy/15 bg-navy/[0.04] px-6 py-4 text-sm font-medium text-navy outline-none transition-colors placeholder:text-navy/35 focus:border-turquoise sm:border-0 sm:bg-transparent"
        />
        {/* Trampa anti-spam: invisible para humanos */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          className="hidden"
          style={{ display: "none" }}
        />
        <button
          type="submit"
          disabled={sending}
          aria-busy={sending}
          data-cursor-label="Suscribirme"
          className="group relative w-full shrink-0 overflow-hidden rounded-full bg-turquoise px-7 py-4 text-sm font-bold tracking-wide text-navy transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <span className="absolute inset-0 -translate-x-full bg-turquoise-bright transition-transform duration-500 ease-out group-hover:translate-x-0" />
          <span className="relative whitespace-nowrap">
            {sending ? "Enviando…" : "Recibe novedades"}
          </span>
        </button>
      </div>
      {error && (
        <p className="text-sm font-medium text-red-500" role="alert">
          {error}
        </p>
      )}
      <div className="space-y-2.5 pl-1">
        <LightCheckbox name="acepto_privacidad" required>
          He leído y acepto la{" "}
          <a
            href="/politica-de-privacidad.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-turquoise-deep underline underline-offset-2"
          >
            política de privacidad
          </a>
          .
        </LightCheckbox>
        <LightCheckbox name="acepto_comunicaciones">
          Acepto recibir información sobre el curso y futuras convocatorias.
        </LightCheckbox>
      </div>
    </form>
  );
}

export default function Footer({ reduced }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const fontsReady = useFontsReady();
  const { open } = useFormModal();

  useGSAP(
    () => {
      if (reduced || !fontsReady) return;

      const split = new SplitText(titleRef.current, { type: "lines", mask: "lines" });
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: titleRef.current, start: "top 82%", once: true },
      });

      gsap.utils.toArray(".social-link").forEach((link) => {
        const label = link.querySelector(".social-label");
        const original = label.textContent;
        const xTo = gsap.quickTo(link, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(link, "y", { duration: 0.4, ease: "power3.out" });
        const onMove = (e) => {
          const rect = link.getBoundingClientRect();
          xTo((e.clientX - (rect.left + rect.width / 2)) * 0.35);
          yTo((e.clientY - (rect.top + rect.height / 2)) * 0.35);
        };
        const onEnter = () => {
          gsap.to(label, {
            duration: 0.7,
            scrambleText: { text: original, chars: "✦ASTRVE*", speed: 0.5 },
          });
        };
        const onLeave = () => {
          gsap.to(link, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
        };
        link.addEventListener("pointermove", onMove);
        link.addEventListener("pointerenter", onEnter);
        link.addEventListener("pointerleave", onLeave);
      });

      return () => split.revert();
    },
    { scope: sectionRef, dependencies: [reduced, fontsReady] }
  );

  return (
    <footer id="contacto" ref={sectionRef} className="relative overflow-hidden bg-white pt-28">
      <div className="glow-amber pointer-events-none absolute -bottom-[35%] left-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2" />

      {/* Cinta tipográfica */}
      <div className="select-none overflow-hidden border-y border-navy/10 py-5" aria-hidden="true">
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {[0, 1].map((i) => (
            <span key={i} className="text-2xl font-black uppercase tracking-tight text-navy/15">
              {MARQUEE_TEXT.repeat(4)}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-28 sm:px-12">
        {/* CTA final */}
        <div className="flex flex-col items-center text-center">
          <StarIcon className="mb-10 h-12 w-12 text-turquoise" />
          <h2
            ref={titleRef}
            className="max-w-4xl text-5xl font-black uppercase leading-[1.02] tracking-tight text-navy-deep sm:text-7xl"
          >
            Sigue la estrella.{" "}
            <span className="text-highlight">Aprende sin límites.</span>
          </h2>
          <p className="mt-8 max-w-xl text-base font-medium leading-relaxed text-navy/65 sm:text-lg">
            Da el primer paso hacia tu futuro como Auxiliar Técnico Veterinario.
            Resolvemos tus dudas sin compromiso o te reservamos plaza para la
            próxima convocatoria.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => open("info")}
              data-cursor-label="Sin compromiso"
              className="group relative overflow-hidden rounded-full bg-turquoise px-8 py-4 text-sm font-bold tracking-wide text-navy transition-colors"
            >
              <span className="absolute inset-0 -translate-x-full bg-turquoise-bright transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative whitespace-nowrap">Solicitar información</span>
            </button>
            <button
              type="button"
              onClick={() => open("reserva")}
              data-cursor-label="Plazas limitadas"
              className="group relative overflow-hidden rounded-full border border-amber/70 px-8 py-4 text-sm font-bold tracking-wide text-navy-deep transition-colors"
            >
              <span className="absolute inset-0 -translate-y-full bg-amber transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <span className="relative whitespace-nowrap">Reserva tu plaza</span>
            </button>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mx-auto mt-24 max-w-xl rounded-panel border border-navy/10 bg-navy/[0.02] p-8 text-center sm:p-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-turquoise-deep">
            Newsletter
          </p>
          <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-navy-deep sm:text-3xl">
            Recibe novedades
          </h3>
          <p className="mt-3 text-sm font-medium text-navy/55">
            Convocatorias, contenido veterinario y novedades de la academia.
          </p>
          <div className="mt-7 text-left">
            <NewsletterForm />
          </div>
        </div>

        {/* Atención al cliente: teléfono, WhatsApp y horario */}
        <div className="mx-auto mt-24 max-w-3xl">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.28em] text-turquoise-deep">
            Atención al cliente
          </p>
          <h3 className="mt-3 text-center text-2xl font-black uppercase tracking-tight text-navy-deep sm:text-3xl">
            Hablamos cuando quieras
          </h3>
          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            {/* Contacto directo */}
            <div className="rounded-card border border-navy/10 bg-navy/[0.02] p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy/45">
                Teléfono y mensajería
              </p>
              <a
                href={`tel:${CONTACT.phoneE164}`}
                data-cursor-label="Llamar"
                className="mt-3 block text-2xl font-black tracking-tight text-navy-deep transition-colors hover:text-turquoise-deep"
              >
                {CONTACT.phoneDisplay}
              </a>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-label="WhatsApp"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
                >
                  <svg viewBox="0 0 32 32" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M16.04 4C9.94 4 5 8.94 5 15.04c0 2.13.6 4.12 1.63 5.81L5 28l7.32-1.6a11 11 0 0 0 3.72.65h.01c6.1 0 11.04-4.94 11.04-11.04C27.09 8.94 22.14 4 16.04 4Zm0 20.18a9.1 9.1 0 0 1-4.65-1.27l-.33-.2-3.45.75.74-3.36-.22-.35a9.13 9.13 0 0 1-1.4-4.86c0-5.04 4.1-9.13 9.15-9.13 2.44 0 4.73.95 6.46 2.68a9.06 9.06 0 0 1 2.67 6.46c0 5.05-4.1 9.14-9.13 9.14Z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  data-cursor-label="Escribir"
                  className="inline-flex items-center gap-2 rounded-full border border-navy/15 px-5 py-2.5 text-sm font-bold text-navy-deep transition-colors hover:border-turquoise"
                >
                  Email
                </a>
              </div>
            </div>

            {/* Horario */}
            <div className="rounded-card border border-navy/10 bg-navy/[0.02] p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy/45">
                Horario de atención
              </p>
              <dl className="mt-4 space-y-2.5">
                {CONTACT.hours.map(([day, time]) => (
                  <div key={day} className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm font-bold text-navy-deep">{day}</dt>
                    <dd className="text-right text-sm font-medium text-navy/60">{time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Redes sociales */}
        <nav
          aria-label="Redes sociales"
          className="mt-24 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              data-cursor-label="Síguenos"
              className="social-link inline-block p-2 text-sm font-bold uppercase tracking-[0.25em] text-navy/55 transition-colors hover:text-turquoise"
            >
              <span className="social-label">{s.name}</span>
            </a>
          ))}
        </nav>

        {/* Guías: enlaces internos a las páginas de contenido (scripts/seo.mjs) */}
        <nav aria-label="Guías del curso" className="mt-20 border-t border-navy/10 pt-12">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-navy/45">
            Guías del curso de ATV
          </h3>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
            {GUIDES.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="text-navy/70 underline-offset-4 transition-colors hover:text-turquoise-deep hover:underline">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Aviso legal */}
        <div id="aviso-legal" className="mt-24 scroll-mt-28 border-t border-navy/10 pt-12">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-navy/45">
            Información legal
          </h3>
          <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {LEGAL.map(([term, desc]) => (
              <div key={term}>
                <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-turquoise-deep">
                  {term}
                </dt>
                <dd className="mt-1.5 text-sm font-medium leading-relaxed text-navy/65">
                  {term === "Contacto" ? (
                    <a href={`mailto:${desc}`} className="hover:text-navy-deep">
                      {desc}
                    </a>
                  ) : (
                    desc
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Pie */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-navy/10 pt-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src="/logo-default.png" alt="AstraVet" className="h-7 w-auto" />
            <span className="text-xs font-medium text-navy/40">
              Formación para tu vocación.
            </span>
          </div>
          <p className="text-xs font-medium text-navy/35">
            © 2026 Astra Vet · Academia de formación veterinaria
          </p>
          <div className="flex gap-6 text-xs font-medium text-navy/40">
            <a
              href="/aviso-legal.html"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-navy-deep"
            >
              Aviso legal
            </a>
            <a
              href="/politica-de-privacidad.html"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-navy-deep"
            >
              Privacidad
            </a>
            <a
              href="mailto:admin@astravet.es"
              className="transition-colors hover:text-navy-deep"
            >
              admin@astravet.es
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
