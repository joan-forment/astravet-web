import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

import StarIcon from "./StarIcon.jsx";
import useFontsReady from "../hooks/useFontsReady.js";
import { useFormModal } from "../forms/FormModal.jsx";
import { CAMPUS_DEMO_URL } from "../config/seo.js";

/*
 * La escena 3D se carga aparte del resto de la web.
 *
 * three.js pesa 254 kB comprimidos: casi tres cuartas partes de todo el
 * JavaScript de la página. Cargándola por separado, el resto de la web (menú,
 * formularios, precios, carrito) queda utilizable sin esperar a que llegue el
 * motor 3D, que entra después mientras el preloader sigue en pantalla.
 */
const AstraScene = lazy(() => import("./AstraScene.jsx"));

export default function Hero({ reduced, start }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const fontsReady = useFontsReady();
  const { open } = useFormModal();

  // Fase 3 de la entrada: los títulos esperan al destello del códice 3D
  const [assembled, setAssembled] = useState(false);
  const onAssembled = useCallback(() => setAssembled(true), []);

  /*
   * Red de seguridad: los títulos del hero esperan a que la escena 3D avise de
   * su destello. Si el motor 3D tardara demasiado o fallara al cargar (una
   * conexión mala, un navegador sin WebGL), el texto no puede quedarse oculto
   * para siempre: a los 4 segundos entra igualmente.
   */
  useEffect(() => {
    if (!start || assembled) return;
    const red = window.setTimeout(() => setAssembled(true), 4000);
    return () => window.clearTimeout(red);
  }, [start, assembled]);

  // Oculta el contenido desde el primer frame: la escena 3D entra primero
  useGSAP(
    () => {
      if (reduced) return;
      gsap.set([titleRef.current, ".hero-fade"], { autoAlpha: 0 });
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  useGSAP(
    () => {
      if (reduced || !fontsReady || !start || !assembled) return;

      const split = new SplitText(titleRef.current, {
        type: "lines,chars",
        linesClass: "hero-line",
      });

      /*
       * De desenfoque a foco: palabras hechas de luz estelar sólida.
       *
       * Título y resto del hero entran casi a la vez (posiciones absolutas en
       * la timeline, no encadenadas): el subtítulo y los botones arrancan a los
       * 0,15 s en lugar de esperar a que el titular termine de componerse.
       */
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .set(titleRef.current, { autoAlpha: 1 }, 0)
        .fromTo(
          split.chars,
          {
            opacity: 0,
            yPercent: 45,
            filter: "blur(14px)",
            textShadow: "0 0 26px rgba(255,243,221,0.95)",
          },
          {
            opacity: 1,
            yPercent: 0,
            filter: "blur(0px)",
            textShadow: "0 0 0px rgba(255,243,221,0)",
            duration: 0.9,
            stagger: { each: 0.014, from: "start" },
          },
          0
        )
        .fromTo(
          ".hero-fade",
          { autoAlpha: 0, y: 26, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.75,
            stagger: 0.07,
          },
          0.15
        );

      return () => split.revert();
    },
    { scope: sectionRef, dependencies: [reduced, fontsReady, start, assembled] }
  );

  return (
    <section
      ref={sectionRef}
      /* min-h-svh = alto real del viewport móvil (sin contar/contando la barra
         dinámica del navegador), con min-h-screen como fallback */
      className="relative flex min-h-screen min-h-svh flex-col overflow-hidden"
    >
      {/* Escenario 3D: el códice celeste de Astra. Se carga aparte, así que
          hasta que llegue simplemente no hay nada (el fondo navy ya está). */}
      <Suspense fallback={null}>
        <AstraScene reduced={reduced} start={start} onAssembled={onAssembled} />
      </Suspense>

      {/* Scrim: garantiza el contraste del titular sobre la nebulosa.
          En móvil reforzamos el degradado (lateral + inferior) para que las
          letras blancas no se confundan con la estrella decorativa del fondo. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/45 to-navy/10 sm:from-navy/70 sm:via-navy/25 sm:to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy via-navy/55 to-transparent sm:h-1/2 sm:from-navy/80 sm:via-navy/15" />

      {/* Luces de marca, muy suaves */}
      <div className="glow-amber pointer-events-none absolute -left-[20%] -top-[25%] h-[70vmax] w-[70vmax]" />
      <div className="glow-coral pointer-events-none absolute -bottom-[30%] -right-[15%] h-[60vmax] w-[60vmax]" />

      {/* Contenido principal */}
      {/* Padding vertical más contenido en móvil (pt-28/pb-24) y holgado en ≥sm */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-24 pt-28 sm:px-12 sm:pb-28 sm:pt-32">
        <p className="hero-fade mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-turquoise">
          <StarIcon withCross={false} className="h-3.5 w-3.5 text-turquoise" />
          Academia de formación veterinaria
        </p>

        <h1
          ref={titleRef}
          className="max-w-5xl text-[13vw] font-black uppercase leading-[0.95] tracking-tight sm:text-[9vw] lg:text-[7.2vw]"
        >
          Aprende entiende{" "}
          <span className="text-highlight">destaca</span>
          {/* Keyword principal legible para Google y lectores de pantalla,
              sin alterar el titular visual de marca */}
          <span className="sr-only">
            {" "}
            — Curso de Auxiliar Técnico Veterinario online
          </span>
        </h1>

        <p className="hero-fade mt-7 max-w-xl text-xl font-bold text-white/90 sm:text-2xl">
          Formación para tu vocación. Una nueva manera de estudiar.
        </p>

        <p className="hero-fade mt-5 max-w-xl text-base font-medium leading-relaxed text-white/65 sm:text-lg">
          En AstraVet te acompañamos en el camino del conocimiento hacia tu
          futuro.{" "}
          <span className="text-white">Curso de Auxiliar Veterinario Online.</span>
        </p>

        {/* CTAs principales */}
        <div className="hero-fade mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => open("info")}
            data-cursor-label="Sin compromiso"
            className="group relative w-full overflow-hidden rounded-full bg-turquoise px-8 py-4 text-sm font-bold tracking-wide text-navy transition-colors sm:w-auto"
          >
            <span className="absolute inset-0 -translate-x-full bg-turquoise-bright transition-transform duration-500 ease-out group-hover:translate-x-0" />
            <span className="relative whitespace-nowrap">Solicitar información</span>
          </button>
          <button
            type="button"
            onClick={() => open("reserva")}
            data-cursor-label="Plazas limitadas"
            className="group relative w-full overflow-hidden rounded-full border border-amber/60 px-8 py-4 text-sm font-bold tracking-wide text-amber transition-colors hover:text-navy sm:w-auto"
          >
            <span className="absolute inset-0 -translate-y-full bg-amber transition-transform duration-500 ease-out group-hover:translate-y-0" />
            <span className="relative whitespace-nowrap">Reserva tu plaza</span>
          </button>
          <a
            href={CAMPUS_DEMO_URL}
            data-cursor-label="Sin registro"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold tracking-wide text-white/85 transition-colors hover:text-white sm:w-auto"
          >
            <span className="whitespace-nowrap underline decoration-white/30 underline-offset-[6px] transition-colors group-hover:decoration-turquoise">
              Prueba la demo del campus
            </span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        <ul className="hero-fade mt-10 flex flex-wrap gap-x-8 gap-y-4 text-[11px] font-bold uppercase leading-relaxed tracking-[0.18em] text-white/45 sm:tracking-[0.2em]">
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-turquoise" /> Creado por veterinarios
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-amber" /> 100% online
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-coral" /> Tutorías personalizadas
          </li>
        </ul>
      </div>

      {/* Indicador de scroll · oculto en móvil para no solaparse con la lista
          ("Tutorías personalizadas") cuando la altura del viewport es ajustada */}
      <div className="hero-fade pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">
        <span className="block h-12 w-px overflow-hidden bg-white/10">
          <span className="animate-scroll-line block h-full w-full bg-turquoise" />
        </span>
      </div>
    </section>
  );
}
