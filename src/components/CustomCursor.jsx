import { useEffect, useRef } from "react";

const LERP_STAR = 0.32; // estrella: precisa pero con cuerpo
const LERP_GLOW = 0.11; // aura: rezagada, da el arrastre líquido
const STAR_AMBER = "#F5A429";

/**
 * Cursor "Estrella Polar" de Astra Vet.
 *
 * Capas (hermanas, `fixed`, sin contenedor para no crear stacking contexts):
 *  - un aura radial ámbar que persigue con retardo (estela líquida) y crece
 *    con la velocidad y sobre elementos interactivos,
 *  - la estrella polar de marca en #F5A429 que gira lento y parpadea (twinkle),
 *    inclinándose según el movimiento y dando un "pop" al hacer clic,
 *  - un anillo fino que aparece al posarse sobre algo interactivo,
 *  - una etiqueta flotante ("Reservar", "Ver foto"…) leída de data-cursor-label.
 *
 * Desactivado en táctil y con prefers-reduced-motion.
 */
export default function CustomCursor({ reduced = false }) {
  const glowRef = useRef(null);
  const starRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !finePointer) return;

    document.documentElement.classList.add("has-custom-cursor");

    const glow = glowRef.current;
    const star = starRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;

    const mouse = { x: -200, y: -200 };
    const starPos = { x: -200, y: -200 };
    const glowPos = { x: -200, y: -200 };

    // mode: "idle" | "hover" | "label"
    const state = {
      mode: "idle",
      scale: 0.85, // escala de la estrella (eased)
      ring: 0, // visibilidad/escala del anillo (eased)
      labelScale: 0, // visibilidad de la etiqueta (eased)
      rot: 0, // rotación acumulada (giro lento continuo)
      lean: 0, // inclinación según velocidad (eased)
      press: 1, // factor de "pop" al hacer clic (eased)
      glowAmp: 0, // intensidad extra del aura por velocidad (eased)
      visible: false,
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!state.visible) {
        state.visible = true;
        starPos.x = glowPos.x = mouse.x;
        starPos.y = glowPos.y = mouse.y;
        glow.style.opacity = "1";
        star.style.opacity = "1";
      }
    };

    const onLeaveWindow = () => {
      state.visible = false;
      glow.style.opacity = "0";
      star.style.opacity = "0";
      ring.style.opacity = "0";
      label.style.opacity = "0";
    };

    const onDown = () => {
      state.press = 0.62;
    };
    const onUp = () => {
      state.press = 1;
    };

    const INTERACTIVE =
      "[data-cursor-label], a, button, input, textarea, select, [data-cursor]";

    const resolveMode = (target) => {
      const el = target?.closest?.(INTERACTIVE);
      if (!el) {
        state.mode = "idle";
        return;
      }
      const text = el.getAttribute("data-cursor-label");
      if (text) {
        state.mode = "label";
        label.textContent = text;
      } else {
        state.mode = "hover";
      }
    };

    const onOver = (e) => resolveMode(e.target);
    const onOut = (e) => resolveMode(e.relatedTarget);

    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      // --- Posiciones (estrella ágil, aura rezagada = arrastre líquido) ---
      starPos.x += (mouse.x - starPos.x) * LERP_STAR;
      starPos.y += (mouse.y - starPos.y) * LERP_STAR;

      const gdx = mouse.x - glowPos.x;
      const gdy = mouse.y - glowPos.y;
      glowPos.x += gdx * LERP_GLOW;
      glowPos.y += gdy * LERP_GLOW;

      // Velocidad (basada en el rezago del aura) -> estela e inclinación
      const speed = Math.hypot(gdx, gdy);
      const speedN = Math.min(speed / 140, 1);

      // --- Objetivos por modo ---
      const targetScale =
        state.mode === "hover" ? 1.7 : state.mode === "label" ? 0.58 : 0.85;
      state.scale += (targetScale - state.scale) * 0.16;

      const targetRing = state.mode === "hover" ? 1 : 0;
      state.ring += (targetRing - state.ring) * 0.18;

      const targetLabel = state.mode === "label" ? 1 : 0;
      state.labelScale += (targetLabel - state.labelScale) * 0.16;

      state.press += (1 - state.press) * 0.2;
      state.glowAmp += (speedN - state.glowAmp) * 0.1;

      // Inclinación: la estrella "se ladea" hacia el movimiento horizontal
      const targetLean = Math.max(-1, Math.min(1, gdx / 22)) * 14;
      state.lean += (targetLean - state.lean) * 0.12;

      // Giro continuo: lento en reposo, acelera con la velocidad
      state.rot += (12 + speedN * 90) * dt;

      // Parpadeo (twinkle) sutil de la estrella en reposo
      const twinkle = 1 + Math.sin(t * 2.4) * 0.06;

      // --- Aura ---
      const glowScale = 1 + state.glowAmp * 0.9 + (state.mode !== "idle" ? 0.5 : 0);
      const glowOpacity = 0.16 + state.glowAmp * 0.32 + state.ring * 0.18;
      glow.style.transform = `translate3d(${glowPos.x}px, ${glowPos.y}px, 0) translate(-50%, -50%) scale(${glowScale})`;
      glow.style.opacity = state.visible ? String(glowOpacity) : "0";

      // --- Estrella ---
      const s = state.scale * twinkle * state.press;
      star.style.transform = `translate3d(${starPos.x}px, ${starPos.y}px, 0) translate(-50%, -50%) rotate(${
        state.rot + state.lean
      }deg) scale(${s})`;

      // --- Anillo (hover) ---
      ring.style.opacity = state.visible ? String(state.ring * 0.9) : "0";
      ring.style.transform = `translate3d(${starPos.x}px, ${starPos.y}px, 0) translate(-50%, -50%) scale(${
        0.4 + state.ring * 0.6
      })`;

      // --- Etiqueta ---
      label.style.opacity = String(state.labelScale);
      label.style.transform = `translate3d(${starPos.x}px, ${starPos.y}px, 0) translate(-50%, -185%) scale(${
        0.7 + state.labelScale * 0.3
      })`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [reduced]);

  return (
    <>
      {/* Aura ámbar: estela líquida que persigue con retardo */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[299] h-[260px] w-[260px] rounded-full opacity-0 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(245,164,41,0.45) 0%, rgba(245,164,41,0.12) 32%, transparent 68%)",
        }}
      />

      {/* Anillo de enfoque sobre elementos interactivos */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[300] h-14 w-14 rounded-full opacity-0 will-change-transform"
        style={{
          border: "1.5px solid rgba(245,164,41,0.55)",
          boxShadow: "0 0 18px rgba(245,164,41,0.25)",
        }}
      />

      {/* Estrella polar de marca */}
      <div
        ref={starRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[301] h-6 w-6 opacity-0 will-change-transform"
        style={{ filter: "drop-shadow(0 0 7px rgba(245,164,41,0.85))" }}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z"
            fill={STAR_AMBER}
          />
          <circle cx="12" cy="12" r="1.7" fill="#FFE3AE" />
        </svg>
      </div>

      {/* Etiqueta flotante contextual */}
      <div
        ref={labelRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[302] whitespace-nowrap rounded-full bg-highlight px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-navy opacity-0 shadow-[0_8px_30px_rgba(245,164,41,0.45)] will-change-transform"
      />
    </>
  );
}
