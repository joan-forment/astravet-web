import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Preloader de entrada sobre blanco: el logo emerge de una máscara junto al
 * tagline mientras un contador gigante avanza de 000 a 100; al completar,
 * todo se recoge y una doble cortina (blanca + turquesa) sube con borde
 * curvo revelando la página. `onReveal` se dispara en cuanto la cortina
 * empieza a abrirse para encadenar las animaciones del hero y el header.
 */
export default function Preloader({ reduced, onReveal }) {
  const rootRef = useRef(null);
  const counterRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useGSAP(
    () => {
      const finish = () => setHidden(true);

      if (reduced) {
        gsap
          .timeline({ onComplete: finish })
          .add(() => onReveal(), 0.45)
          .to(rootRef.current, {
            autoAlpha: 0,
            duration: 0.5,
            delay: 0.45,
            ease: "power1.out",
          });
        return;
      }

      const progress = { value: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      tl
        // Entrada: logo y tagline emergen de sus máscaras
        .from(".pre-logo", { yPercent: 110, duration: 1.1, ease: "power4.out" }, 0.15)
        .from(
          ".pre-tagline",
          { yPercent: 130, autoAlpha: 0, duration: 0.9, ease: "power3.out" },
          0.5
        )
        .from(".pre-label", { autoAlpha: 0, duration: 0.6, ease: "power1.out" }, 0.6)
        // Carga: contador y barra avanzan a la vez
        .to(
          progress,
          {
            value: 100,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(
                  Math.round(progress.value)
                ).padStart(3, "0");
              }
            },
          },
          0.35
        )
        .to(".pre-bar", { scaleX: 1, duration: 2, ease: "power2.inOut" }, 0.35)
        // Respiro del logo al llegar a 100
        .to(".pre-logo", { scale: 1.04, duration: 0.3, ease: "power2.out" }, "-=0.15")
        // Salida del contenido hacia sus máscaras
        .to(
          [".pre-logo", ".pre-tagline"],
          { yPercent: -125, duration: 0.6, ease: "power3.in", stagger: 0.06 },
          "+=0.15"
        )
        .to(".pre-counter", { yPercent: 115, duration: 0.6, ease: "power3.in" }, "<")
        .to([".pre-label", ".pre-bar"], { autoAlpha: 0, duration: 0.4 }, "<")
        // Doble cortina con borde curvo
        .to(
          ".pre-panel-white",
          { yPercent: -115, duration: 1.05, ease: "power4.inOut" },
          "-=0.1"
        )
        .add(() => onReveal(), "<+=0.25")
        .to(
          ".pre-panel-teal",
          { yPercent: -115, duration: 1.05, ease: "power4.inOut" },
          "<-=0.13"
        );
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  if (hidden) return null;

  return (
    <div ref={rootRef} aria-hidden="true" className="fixed inset-0 z-[300]">
      {/* Cortina secundaria turquesa: asoma tras la blanca al salir */}
      <div className="pre-panel-teal absolute inset-0 bg-turquoise will-change-transform">
        <div className="absolute inset-x-0 top-full h-[12vh] rounded-b-[100%] bg-turquoise" />
      </div>

      {/* Panel principal blanco con el contenido del loader */}
      <div className="pre-panel-white absolute inset-0 flex flex-col items-center justify-center bg-white will-change-transform">
        <div className="absolute inset-x-0 top-full h-[12vh] rounded-b-[100%] bg-white" />

        <div className="overflow-hidden px-4 pb-2">
          <img
            src="/logo-default.png"
            alt=""
            className="pre-logo h-28 w-auto sm:h-36"
            draggable="false"
          />
        </div>

        <div className="mt-5 overflow-hidden">
          <p className="pre-tagline text-[10px] font-bold uppercase tracking-[0.42em] text-navy/60 sm:text-xs">
            Conocimiento que sana
          </p>
        </div>

        <p className="pre-label absolute bottom-7 left-6 text-[10px] font-bold uppercase tracking-[0.3em] text-navy/40 sm:bottom-12 sm:left-12">
          Astra Vet · Cargando
        </p>

        <div className="absolute bottom-5 right-6 overflow-hidden sm:bottom-8 sm:right-12">
          <span
            ref={counterRef}
            className="pre-counter block text-6xl font-black leading-none tracking-tight text-navy tabular-nums sm:text-8xl"
          >
            000
          </span>
        </div>

        <div className="pre-bar absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-turquoise" />
      </div>
    </div>
  );
}
