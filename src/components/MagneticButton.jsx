import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * CTA magnético: el botón se siente atraído por el cursor y vuelve
 * con un rebote elástico al salir. En táctil / reduced-motion no actúa.
 */
export default function MagneticButton({
  children,
  strength = 0.35,
  reduced = false,
  className = "",
  ...props
}) {
  const wrapper = useRef(null);
  const button = useRef(null);

  useGSAP(
    () => {
      if (reduced || window.matchMedia("(pointer: coarse)").matches) return;

      const el = button.current;
      const zone = wrapper.current;
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = (e) => {
        const rect = zone.getBoundingClientRect();
        xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
      };
      const onLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.9,
          ease: "elastic.out(1, 0.35)",
        });
      };

      zone.addEventListener("pointermove", onMove);
      zone.addEventListener("pointerleave", onLeave);
      return () => {
        zone.removeEventListener("pointermove", onMove);
        zone.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: wrapper, dependencies: [reduced, strength] }
  );

  return (
    <span ref={wrapper} className="inline-block p-4 -m-4">
      <button ref={button} type="submit" className={className} {...props}>
        {children}
      </button>
    </span>
  );
}
