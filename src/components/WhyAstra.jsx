import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Icon from "./icons.jsx";
import ListaCheck from "./ListaCheck.jsx";
import TutoringCalendar from "./TutoringCalendar.jsx";
import { useFormModal } from "../forms/FormModal.jsx";

const BENEFITS = [
  {
    icon: "estetoscopio",
    accent: "text-turquoise",
    ring: "border-turquoise/30 bg-turquoise/10",
    tint: "bg-turquoise/[0.05] hover:bg-turquoise/[0.09] hover:border-turquoise/30",
    title: "Curso creado 100% por veterinarios",
    text: "Formación diseñada desde la experiencia real en clínica.",
  },
  {
    icon: "formatos",
    accent: "text-amber",
    ring: "border-amber/30 bg-amber/10",
    tint: "bg-amber/[0.05] hover:bg-amber/[0.09] hover:border-amber/30",
    title: "Contenido en 4 formatos diferentes",
    text: "Aprende de la manera que mejor encaje contigo.",
  },
  {
    icon: "reloj",
    accent: "text-coral",
    ring: "border-coral/30 bg-coral/10",
    tint: "bg-coral/[0.05] hover:bg-coral/[0.09] hover:border-coral/30",
    title: "Flexibilidad total de horarios",
    text: "Perfecto para compaginar estudios, trabajo o vida personal.",
  },
  {
    icon: "historial",
    accent: "text-turquoise",
    ring: "border-turquoise/30 bg-turquoise/10",
    tint: "bg-turquoise/[0.05] hover:bg-turquoise/[0.09] hover:border-turquoise/30",
    title: "Casos clínicos y situaciones reales",
    text: "Aprende más allá de la teoría tradicional.",
  },
  {
    icon: "comunidad",
    accent: "text-amber",
    ring: "border-amber/30 bg-amber/10",
    tint: "bg-amber/[0.05] hover:bg-amber/[0.09] hover:border-amber/30",
    title: "Comunidad activa",
    text: "Conecta con alumnos y profesionales desde el primer día.",
  },
];

export default function WhyAstra({ reduced }) {
  const sectionRef = useRef(null);
  const { open } = useFormModal();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".why-card", {
        autoAlpha: 0,
        y: 50,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".why-grid", start: "top 80%", once: true },
      });
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      id="por-que"
      ref={sectionRef}
      className="section-light relative overflow-hidden py-28 sm:py-36"
    >
      <div className="glow-turquoise pointer-events-none absolute -left-[20%] top-[10%] h-[55vmax] w-[55vmax]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12">
        {/* Encabezado de sección */}
        <div className="mb-16 flex items-baseline gap-6">
          <span className="text-sm font-black text-turquoise">01</span>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-white/50">
            Por qué AstraVet
          </p>
          <span className="hidden h-px flex-1 bg-white/10 sm:block" />
        </div>

        <h2 className="max-w-3xl text-4xl font-black uppercase leading-[1.04] tracking-tight sm:text-6xl">
          Todo lo que necesitas para{" "}
          <span className="text-highlight">destacar</span>
        </h2>

        {/* Rejilla de beneficios */}
        <div className="why-grid mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <article
              key={b.title}
              className={`why-card group rounded-card border border-white/10 p-7 transition-colors duration-500 ${b.tint}`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${b.ring} ${b.accent}`}
              >
                <Icon name={b.icon} />
              </span>
              <h3 className="mt-6 text-lg font-black leading-snug text-white">
                {b.title}
              </h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/60">
                {b.text}
              </p>
            </article>
          ))}

          {/* Tutorías personalizadas: tarjeta destacada que enlaza al calendario */}
          <article className="why-card group flex flex-col justify-between rounded-card border border-white/10 bg-white/[0.03] p-7 transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.06]">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-turquoise/30 bg-turquoise/10 text-turquoise">
                <Icon name="tutor" />
              </span>
              <h3 className="mt-6 text-lg font-black leading-snug text-white">
                Tutorías personalizadas
              </h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/65">
                Acompañamiento cercano durante todo el proceso. Agéndalas tú
                mismo, cuando mejor te venga.
              </p>
            </div>
            <p className="mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-turquoise">
              Mira cómo funciona
              <Icon
                name="flecha"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                weight={1.8}
              />
            </p>
          </article>
        </div>

        {/* Bloque del calendario interactivo de tutorías (panel navy sobre el fondo blanco) */}
        <div className="theme-static mt-10 grid items-center gap-10 rounded-panel border border-white/10 bg-[#0d1b3e] p-7 sm:p-10 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-turquoise">
              Tutorías personalizadas
            </p>
            <h3 className="mt-4 text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl">
              Agenda tu tutoría en segundos
            </h3>
            <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-white/65">
              Elige el día y la hora que mejor te encajen y reserva una sesión
              individual con tu tutor. Resuelve dudas, repasa casos clínicos y
              avanza sin quedarte atascado. Así de fácil.
            </p>
            <ListaCheck
              className="mt-7"
              items={[
                "Sesiones individuales con veterinarios",
                "Reprograma cuando lo necesites",
                "Recordatorios por email",
              ]}
            />
            <button
              type="button"
              onClick={() => open("info")}
              data-cursor-label="Sin compromiso"
              className="mt-8 inline-flex rounded-full border border-white/20 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white/85 transition-colors hover:border-turquoise hover:text-turquoise"
            >
              Quiero saber más
            </button>
          </div>

          <TutoringCalendar />
        </div>
      </div>
    </section>
  );
}
