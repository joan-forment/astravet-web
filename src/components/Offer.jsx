import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import ImageFrame from "./ImageFrame.jsx";
import StarIcon from "./StarIcon.jsx";
import { useFormModal } from "../forms/FormModal.jsx";

/*
 * Las cuatro piezas del curso.
 *
 * Llevaban un emoji (⏳ 📚 🛠️ 🏥) dentro de un recuadro de color Y ADEMÁS el
 * número grande de la esquina: dos marcadores para lo mismo. Como es una lista
 * ORDENADA —duración, teoría, talleres, prácticas, en ese orden— el que informa
 * es el número; el emoji solo competía con él, y encima era de otra familia
 * gráfica que la iconografía de línea del resto de la web.
 *
 * Queda la etiqueta a color + el número, que es el mismo par que abre cada
 * sección y el que usan las tarjetas de "Empleabilidad".
 */
const STRUCTURE = [
  {
    tag: "Duración",
    title: "Aproximadamente 12 meses",
    text: "Un recorrido completo, secuencial y a tu ritmo.",
    accent: "text-turquoise",
    filete: "bg-turquoise/30",
    tint: "bg-turquoise/[0.06] hover:bg-turquoise/[0.1] hover:border-turquoise/30",
  },
  {
    tag: "Teoría",
    title: "Curso teórico en 4 formatos",
    text: "Con examen al final de cada módulo para afianzar lo aprendido.",
    accent: "text-amber",
    filete: "bg-amber/30",
    tint: "bg-amber/[0.06] hover:bg-amber/[0.1] hover:border-amber/30",
  },
  {
    tag: "Talleres",
    title: "Talleres optativos presenciales",
    text: "Al final del curso, para prepararte de forma real.",
    accent: "text-coral",
    filete: "bg-coral/30",
    tint: "bg-coral/[0.06] hover:bg-coral/[0.1] hover:border-coral/30",
  },
  {
    tag: "Prácticas",
    title: "Acceso a centros clínicos",
    text: "Te facilitamos la estancia obligatoria para que pongas en práctica lo aprendido.",
    accent: "text-turquoise",
    filete: "bg-turquoise/30",
    tint: "bg-turquoise/[0.06] hover:bg-turquoise/[0.1] hover:border-turquoise/30",
  },
];

export default function Offer({ reduced }) {
  const sectionRef = useRef(null);
  const { open } = useFormModal();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".offer-card", {
        autoAlpha: 0,
        y: 50,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".offer-grid", start: "top 80%", once: true },
      });
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      id="curso"
      ref={sectionRef}
      className="section-dark-solid relative overflow-hidden py-28 sm:py-36"
    >
      <div className="glow-amber pointer-events-none absolute -right-[20%] top-0 h-[55vmax] w-[55vmax]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12">
        {/* Encabezado de sección */}
        <div className="mb-16 flex items-baseline gap-6">
          <span className="text-sm font-black text-turquoise">03</span>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-white/50">
            Qué ofrecemos
          </p>
          <span className="hidden h-px flex-1 bg-white/10 sm:block" />
        </div>

        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Texto principal */}
          <div className="lg:col-span-7">
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-turquoise">
              <StarIcon withCross={false} className="h-3.5 w-3.5 text-turquoise" />
              Curso de Auxiliar Técnico Veterinario
            </p>
            <h2 className="mt-5 text-4xl font-black uppercase leading-[1.04] tracking-tight sm:text-6xl">
              Destaca como{" "}
              <span className="text-highlight">Auxiliar Técnico Veterinario</span>
            </h2>
            <p className="mt-7 max-w-xl text-lg font-medium leading-relaxed text-white/65">
              Hemos creado una formación para que destaques en el mercado
              laboral como Auxiliar Técnico Veterinario (ATV). La teoría está
              siempre orientada a su aplicación práctica.
            </p>

            <button
              type="button"
              onClick={() => open("info")}
              data-cursor-label="Sin compromiso"
              className="group relative mt-9 inline-flex overflow-hidden rounded-full bg-turquoise px-8 py-4 text-sm font-bold tracking-wide text-navy transition-colors"
            >
              <span className="absolute inset-0 -translate-x-full bg-turquoise-bright transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative">Pide el temario completo</span>
            </button>
          </div>

          {/* Imagen oficial */}
          <div className="lg:col-span-5">
            <ImageFrame
              ratio="aspect-[4/5]"
              tone="amber"
              src="/photos/exploracion-beagle.jpg"
              alt="Veterinaria explorando a un beagle sobre la mesa de exploración"
              caption="Teoría orientada a la práctica real"
            />
          </div>
        </div>

        {/* Estructura del curso */}
        <div className="mt-20">
          <p className="mb-8 text-[11px] font-bold uppercase tracking-[0.32em] text-white/50">
            Estructura del curso
          </p>
          <div className="offer-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STRUCTURE.map((s, i) => (
              <article
                key={s.title}
                className={`offer-card group flex flex-col rounded-card border border-white/10 p-7 transition-colors duration-500 ${s.tint}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p
                    className={`text-[11px] font-bold uppercase tracking-[0.2em] ${s.accent}`}
                  >
                    {s.tag}
                  </p>
                  <span className="text-3xl font-black leading-none text-white/15">
                    0{i + 1}
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className={`mt-4 block h-px w-full ${s.filete}`}
                />
                <h3 className="mt-5 text-lg font-black leading-snug text-white">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-white/60">
                  {s.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
