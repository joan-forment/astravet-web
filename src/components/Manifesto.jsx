import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

import ImageFrame from "./ImageFrame.jsx";
import StarIcon from "./StarIcon.jsx";
import useFontsReady from "../hooks/useFontsReady.js";

/*
 * Los tres valores de la marca.
 *
 * Iban con un emoji dentro de un recuadro de color (📖 🤝 🐾). Dos motivos
 * para quitarlos: desentonaban con la iconografía de línea del resto de la web
 * —son dibujos a color, de otra familia— y sobre todo no decían nada que el
 * titular no dijera ya. Un apretón de manos junto a "ENSEÑANZA CERCANA" es
 * decoración, no información.
 *
 * En su lugar va el mismo par número + filete con el que se abren todas las
 * secciones de la web, que además numera los valores y refuerza el color de
 * cada uno sin competir con el titular.
 */
const PILLARS = [
  {
    name: "RIGOR ACADÉMICO",
    accent: "text-turquoise",
    filete: "bg-turquoise/35",
    text: "Cada contenido ha sido creado por veterinarios con experiencia real. Priorizamos la calidad, la precisión y la excelencia académica. No queremos que solo memorices, queremos que entiendas.",
  },
  {
    name: "ENSEÑANZA CERCANA",
    accent: "text-amber",
    filete: "bg-amber/35",
    text: "Tu historia nos importa. Ofrecemos tutorías semanales individualizadas y te acompañamos antes, durante y después del curso.",
  },
  {
    name: "PASIÓN POR LOS ANIMALES",
    accent: "text-coral",
    filete: "bg-coral/35",
    text: "Todo empieza por ellos. Creemos en el cuidado, el respeto y el bienestar animal como pilares fundamentales.",
  },
];

export default function Manifesto({ reduced }) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const bodyRef = useRef(null);
  const fontsReady = useFontsReady();

  useGSAP(
    () => {
      if (reduced || !fontsReady) return;

      // 1) Titular: cada línea se revela con una máscara clip-path
      const headingSplit = new SplitText(headingRef.current, { type: "lines" });
      headingSplit.lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { clipPath: "inset(0% 0% 100% 0%)", yPercent: 40 },
          {
            clipPath: "inset(0% 0% -12% 0%)",
            yPercent: 0,
            duration: 1.2,
            ease: "power4.out",
            delay: i * 0.08,
            scrollTrigger: { trigger: line, start: "top 88%", once: true },
          }
        );
      });

      // 2) Cuerpo: las letras pasan de apagadas a navy al hacer scroll
      const bodySplit = new SplitText(bodyRef.current, { type: "words,chars" });
      gsap.fromTo(
        bodySplit.chars,
        { color: "rgba(13,27,61,0.18)" },
        {
          color: "#0d1b3d",
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: bodyRef.current,
            start: "top 75%",
            end: "bottom 50%",
            scrub: 0.6,
          },
        }
      );

      // 3) Parallax suave en las imágenes asimétricas
      gsap.utils.toArray(".manifesto-parallax").forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: i % 2 === 0 ? 10 : 16 },
          {
            yPercent: i % 2 === 0 ? -10 : -16,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // 4) Pilares en cascada
      gsap.from(".pillar-card", {
        autoAlpha: 0,
        y: 50,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: ".pillar-grid", start: "top 80%", once: true },
      });

      return () => {
        headingSplit.revert();
        bodySplit.revert();
      };
    },
    { scope: sectionRef, dependencies: [reduced, fontsReady] }
  );

  return (
    <section
      id="quienes-somos"
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-28 sm:py-40"
    >
      <div className="glow-turquoise pointer-events-none absolute -right-[25%] top-[10%] h-[60vmax] w-[60vmax]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12">
        {/* Encabezado de sección */}
        <div className="mb-16 flex items-baseline gap-6">
          <span className="text-sm font-black text-turquoise">02</span>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-navy/50">
            Quiénes somos
          </p>
          <span className="hidden h-px flex-1 bg-navy/10 sm:block" />
        </div>

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Columna de texto */}
          <div className="lg:col-span-7">
            <h2
              ref={headingRef}
              className="text-4xl font-black uppercase leading-[1.04] tracking-tight text-navy-deep sm:text-6xl"
            >
              Academia innovadora, especializada y{" "}
              <span className="text-highlight">cercana</span>
            </h2>

            <div
              ref={bodyRef}
              className="mt-12 space-y-7 text-lg font-medium leading-relaxed text-navy-deep sm:text-xl"
            >
              <p>
                AstraVet se construye a partir de un equipo de veterinarios con
                años de experiencia clínica que buscan optimizar el proceso
                formativo y ayudar a la siguiente generación de profesionales a
                construir su futuro en el sector veterinario. Nuestra vocación
                se fundamenta en cuidar y enseñar. Cuidamos de la salud animal y
                te enseñamos a cuidar. Te acompañamos y guiamos.
              </p>
              <p>
                Las estrellas siempre han servido para encontrar el camino y
                AstraVet nace con la misma intención: guiar a quienes quieren
                encontrar su camino en el mundo veterinario.
              </p>
            </div>

            {/* Cita de marca */}
            <blockquote className="mt-14 border-l-2 border-amber pl-6 sm:pl-8">
              <p className="text-2xl font-black leading-snug text-navy-deep sm:text-3xl">
                «Cuidamos de la salud animal y te enseñamos a cuidar.»
              </p>
              <footer className="mt-3 text-sm font-medium text-navy/50">
                Nuestra vocación, en una frase.
              </footer>
            </blockquote>
          </div>

          {/* Columna visual asimétrica */}
          <div className="relative lg:col-span-5">
            <ImageFrame
              className="manifesto-parallax ml-auto w-[85%]"
              ratio="aspect-[4/5]"
              src="/photos/vinculo-corgi.jpg"
              alt="Veterinario sonriendo mientras sostiene a un corgi en una clínica luminosa"
              caption="Cuidar y enseñar"
            />
            <ImageFrame
              className="manifesto-parallax -mt-24 w-[60%] lg:-ml-4"
              ratio="aspect-square"
              src="/photos/pata-confianza.jpg"
              alt="Pata de un perro apoyada sobre la mano enguantada de un veterinario"
              caption="Acompañar y guiar"
            />
            <div className="mt-10 flex items-center gap-4 rounded-card border border-navy/10 bg-navy/[0.04] p-6 backdrop-blur-md">
              <StarIcon className="h-10 w-10 shrink-0 text-turquoise" />
              <p className="text-sm font-medium leading-relaxed text-navy/70">
                La estrella señala el rumbo.{" "}
                <strong className="text-navy-deep">La vocación te impulsa a seguirlo.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Pilares / Nuestros valores */}
        <div className="mt-28">
          <p className="mb-10 text-[11px] font-bold uppercase tracking-[0.32em] text-navy/50">
            Nuestros valores
          </p>
          <div className="pillar-grid grid gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <article
                key={p.name}
                data-cursor-label="Nuestro ADN"
                className="pillar-card group rounded-card border border-navy/10 bg-navy/[0.03] p-8 transition-colors duration-500 hover:border-navy/25 hover:bg-navy/[0.06]"
              >
                <div className="mb-7 flex items-center gap-4">
                  <span className={`text-sm font-black ${p.accent}`}>
                    0{i + 1}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-px flex-1 ${p.filete}`}
                  />
                </div>
                <h3 className={`text-xl font-black uppercase tracking-tight ${p.accent} sm:text-2xl`}>
                  {p.name}
                </h3>
                <p className="mt-4 text-sm font-medium leading-relaxed text-navy/65">
                  {p.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
