import { useEffect, useState } from "react";

import { useFormModal } from "../forms/FormModal.jsx";

/* Barra de conversión persistente para tráfico de Google Ads / orgánico móvil.
   Aparece tras dejar atrás el hero (~80% del viewport) para no competir con el
   CTA principal del hero y se oculta en ≥sm, donde el CTA del hero ya es visible. */
export default function StickyCTA() {
  const { open } = useFormModal();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[80] border-t border-white/10 bg-navy/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur transition-transform duration-500 ease-out sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => open("info")}
          className="flex-1 rounded-full border border-amber/60 px-5 py-3.5 text-sm font-bold tracking-wide text-amber"
        >
          Información
        </button>
        <button
          type="button"
          onClick={() => open("reserva")}
          className="flex-1 rounded-full bg-turquoise px-5 py-3.5 text-sm font-bold tracking-wide text-navy"
        >
          Reserva tu plaza
        </button>
      </div>
    </div>
  );
}
