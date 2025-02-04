import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

import StarIcon from "./StarIcon.jsx";
import useFontsReady from "../hooks/useFontsReady.js";

export default function MotivationalBanner({ reduced }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const fontsReady = useFontsReady();

  useGSAP(
    () => {
      if (reduced || !fontsReady) return;
      const split = new SplitText(titleRef.current, { type: "lines", mask: "lines" });
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: titleRef.current, start: "top 85%", once: true },
      });
      return () => split.revert();
    },
    { scope: sectionRef, dependencies: [reduced, fontsReady] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-white/10 bg-gradient-to-br from-navy-soft to-navy-deep py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-white/[0.04] bg-diagonal-grid"
      />
      <div className="glow-amber pointer-events-none absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative mx-auto max-w-6xl px-6 text-center sm:px-12">
        <StarIcon className="mx-auto mb-8 h-9 w-9 text-amber" />

        {/* Valores: diferenciados, en tamaño reducido y bien espaciados */}
        <p className="mb-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-bold uppercase tracking-[0.32em] text-white/55 sm:gap-x-7 sm:text-xs">
          <span>Rigor</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-amber/70" />
          <span>Cercanía</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-amber/70" />
          <span className="text-highlight">Pasión por los animales</span>
        </p>

        {/* Frase protagonista: mucho mayor y sin puntuación */}
        <h2
          ref={titleRef}
          className="text-4xl font-black uppercase leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Una nueva manera de estudiar
        </h2>
      </div>
    </section>
  );
}
