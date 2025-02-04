import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import ImageFrame from "./ImageFrame.jsx";

const BENEFITS = [
  {
    title: "Te preparamos para tu primer empleo",
    text: "Nuestro objetivo es que llegues seguro y preparado al entorno laboral real.",
  },
  {
    title: "Aprende lo que realmente utilizarás en clínica",
    text: "Formación enfocada en situaciones reales y habilidades prácticas.",
  },
  {
    title: "Te acompañamos más allá",
    text: "Una vez acabes te ayudamos a encontrar trabajo mediante nuestra Bolsa de trabajo y conectándote con centros veterinarios.",
  },
];

/* Agrupados bajo el título común "Centros veterinarios" para evitar repetir
   "veterinarios" en cada etiqueta (consultorios, clínicas y hospitales ya lo son). */
const PRIMARY_PLACES = [
  "Consultorios",
  "Clínicas",
  "Hospitales",
];

const OTHER_PLACES = [
  "Protectoras",
  "Centros de investigación / recuperación",
  "Criaderos",
  "Tiendas del sector",
];

export default function Employability({ reduced }) {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".emp-card", {
        autoAlpha: 0,
        y: 50,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".emp-grid", start: "top 80%", once: true },
      });
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      id="empleabilidad"
      ref={sectionRef}
      className="section-light relative overflow-hidden py-28 sm:py-36"
    >
      <div className="glow-coral pointer-events-none absolute -left-[20%] bottom-0 h-[55vmax] w-[55vmax]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12">
        {/* Encabezado de sección */}
        <div className="mb-16 flex items-baseline gap-6">
          <span className="text-sm font-black text-turquoise">07</span>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-white/50">
            Empleabilidad
          </p>
          <span className="hidden h-px flex-1 bg-white/10 sm:block" />
        </div>

        <h2 className="max-w-3xl text-4xl font-black uppercase leading-[1.04] tracking-tight sm:text-6xl">
          Preparándote para tu{" "}
          <span className="text-highlight">futuro</span>
        </h2>

        {/* Beneficios de empleabilidad */}
        <div className="emp-grid mt-14 grid gap-5 md:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <article
              key={b.title}
              className="emp-card group flex flex-col rounded-card border border-white/10 bg-white/[0.03] p-8 transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.06]"
            >
              <span className="text-sm font-black text-turquoise">0{i + 1}</span>
              <h3 className="mt-5 text-xl font-black leading-snug text-white">
                {b.title}
              </h3>
              <p className="mt-4 text-sm font-medium leading-relaxed text-white/60">
                {b.text}
              </p>
            </article>
          ))}
        </div>

        {/* ¿Dónde podrás trabajar? · texto + imagen, para romper la monotonía */}
        <div className="mt-12 grid items-center gap-8 rounded-panel border border-white/10 bg-white/[0.02] p-8 sm:p-12 lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              ¿Dónde podrás trabajar?
            </h3>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-turquoise">
              Centros veterinarios
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {PRIMARY_PLACES.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-turquoise/40 bg-turquoise/10 px-5 py-2.5 text-sm font-bold text-white"
                >
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
              También
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {OTHER_PLACES.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/75"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Foto de un hospital veterinario moderno. Cambia `src` por la
              imagen definitiva; si se deja vacío, ImageFrame muestra un
              placeholder elegante con la misma maqueta. */}
          <ImageFrame
            ratio="aspect-[4/3]"
            tone="turquoise"
            src="/photos/consulta-golden.jpg"
            alt="Equipo veterinario atendiendo a un perro en un hospital veterinario moderno"
            caption="Hospitales y clínicas veterinarias modernas"
          />
        </div>
      </div>
    </section>
  );
}
