import { useEffect, useState } from "react";

import { CONTACT } from "../config/site.js";

/*
 * Botones flotantes de contacto directo (WhatsApp + llamada).
 * Permiten escribir o llamar sin pasar por el formulario ni agendar reunión.
 *
 * Posición: esquina inferior derecha, respetando el safe area del móvil.
 * Aparece tras dejar atrás el hero para no competir con el CTA principal.
 *
 * ⚠️ ÚNICO SITIO DE LA WEB CON ICONOS FUERA DEL SISTEMA DE LÍNEA
 *    (src/components/icons.jsx), y es a propósito:
 *
 *    · El glifo de WhatsApp es una marca registrada. Se muestra tal cual lo
 *      publica la compañía; redibujarlo al estilo de la casa no es una opción.
 *    · El teléfono va macizo, no de línea, para hacer pareja con él. Un trazo
 *      de 1.5 px al lado de un glifo macizo, ambos sobre un disco de color de
 *      56 px, se vería descolgado.
 *
 *    Las dos burbujas forman así su propia familia cerrada —glifo macizo sobre
 *    disco de color— que es el patrón reconocible de "botón de contacto". El
 *    resto de la web va de línea sin excepciones.
 */

const WHATSAPP_HREF = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
  CONTACT.whatsappMessage
)}`;
const CALL_HREF = `tel:${CONTACT.phoneE164}`;

export default function FloatingContact() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed right-4 z-[120] flex flex-col gap-3 transition-all duration-500 ease-out sm:right-6 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{
        bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)",
      }}
    >
      {/* WhatsApp */}
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        data-cursor-label="WhatsApp"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_12px_30px_rgba(37,211,102,0.4)] transition-transform duration-300 hover:scale-105"
      >
        {/* Tamaños compensados: este glifo sólo llena el 75% de su viewBox y
            el del teléfono el 100%, así que van a 32px y 24px para que ambos
            pinten los mismos ~24px de tinta. */}
        <svg viewBox="0 0 32 32" className="h-8 w-8 text-white" fill="currentColor" aria-hidden="true">
          <path d="M16.04 4C9.94 4 5 8.94 5 15.04c0 2.13.6 4.12 1.63 5.81L5 28l7.32-1.6a11 11 0 0 0 3.72.65h.01c6.1 0 11.04-4.94 11.04-11.04C27.09 8.94 22.14 4 16.04 4Zm0 20.18h-.01a9.1 9.1 0 0 1-4.64-1.27l-.33-.2-3.45.75.74-3.36-.22-.35a9.13 9.13 0 0 1-1.4-4.86c0-5.04 4.1-9.13 9.15-9.13 2.44 0 4.73.95 6.46 2.68a9.06 9.06 0 0 1 2.67 6.46c0 5.05-4.1 9.14-9.13 9.14Zm5.01-6.84c-.27-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.61.14-.18.27-.7.89-.86 1.07-.16.18-.32.2-.59.07-.27-.14-1.16-.43-2.2-1.36-.82-.73-1.36-1.63-1.52-1.9-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.02-.22-.53-.45-.46-.61-.46l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.28 0 1.34.98 2.64 1.12 2.82.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.58.65.21 1.25.18 1.72.11.52-.08 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.11-.25-.18-.52-.32Z" />
        </svg>
      </a>

      {/* Llamada directa */}
      <a
        href={CALL_HREF}
        aria-label="Llámanos"
        data-cursor-label="Llamar"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-turquoise text-navy shadow-[0_12px_30px_rgba(18,179,182,0.45)] transition-transform duration-300 hover:scale-105"
      >
        {/* Font Awesome 6 Free · "phone" solid (CC BY 4.0, fontawesome.com).
            Llena todo su viewBox, por eso va a 24px y no a 32px como el de WhatsApp. */}
        <svg viewBox="0 0 512 512" className="h-6 w-6" fill="none" aria-hidden="true">
          <path
            d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
  );
}
