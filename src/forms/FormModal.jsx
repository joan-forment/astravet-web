import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLenis } from "@studio-freight/react-lenis";

import RequestInfoForm from "./RequestInfoForm.jsx";
import ReservationForm from "./ReservationForm.jsx";
import Icon from "../components/icons.jsx";
import StarIcon from "../components/StarIcon.jsx";
import { PAGO } from "../config/site.js";

/*
 * Sistema global de formularios desplegables.
 * Cualquier CTA llama a useFormModal().open("info" | "reserva"). Precios pasa
 * además el pack elegido: open("reserva", { pack: "Advanced" }).
 * El modal bloquea el scroll de Lenis, atrapa Escape y, al enviar,
 * sustituye el formulario por el mensaje de éxito correspondiente.
 */

const FormModalContext = createContext(null);

export function useFormModal() {
  const ctx = useContext(FormModalContext);
  if (!ctx) throw new Error("useFormModal debe usarse dentro de FormModalProvider");
  return ctx;
}

const CONFIG = {
  info: {
    eyebrow: "Sin compromiso",
    title: "Solicitar información",
    subtitle:
      "Déjanos tus datos y te explicamos todo sobre el curso de Auxiliar Veterinario.",
    Form: RequestInfoForm,
    success:
      "Muchas gracias. Contactaremos contigo con la mayor brevedad posible. Hasta pronto.",
  },
  reserva: {
    eyebrow: "Plazas limitadas",
    title: "Reserva tu plaza",
    subtitle: "Asegura tu acceso anticipado a la convocatoria de septiembre.",
    Form: ReservationForm,
    success:
      "Muchas gracias. Contactaremos contigo de forma prioritaria. Hasta pronto.",
  },
};

/* Datos para pagar la reserva por transferencia (mientras no haya TPV). */
function DatosTransferencia() {
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    navigator.clipboard?.writeText(PAGO.iban.replace(/\s/g, "")).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    });
  };
  return (
    <div className="mt-8 w-full max-w-md rounded-2xl border border-turquoise/30 bg-turquoise/[0.06] p-5 text-left">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-turquoise-bright">
        Pago por transferencia
      </p>
      <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">
        Para confirmar tu plaza puedes hacer una transferencia a esta cuenta. Te
        indicaremos el importe al contactar contigo.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <code className="rounded-lg bg-white/[0.06] px-3 py-2 font-mono text-[15px] font-bold tracking-wide text-white">
          {PAGO.iban}
        </code>
        <button
          type="button"
          onClick={copiar}
          data-cursor-label="Copiar"
          className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-turquoise hover:text-turquoise"
        >
          {copiado ? "¡Copiado!" : "Copiar IBAN"}
        </button>
      </div>
      <p className="mt-3 text-xs font-medium text-white/55">
        Concepto: <span className="text-white/80">{PAGO.concepto}</span>
      </p>
    </div>
  );
}

export function FormModalProvider({ children, reduced = false }) {
  const [type, setType] = useState(null); // "info" | "reserva" | null
  const [opciones, setOpciones] = useState({}); // p. ej. { pack: "Advanced" } desde Precios
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const panelRef = useRef(null);
  const lenis = useLenis();

  const open = useCallback((t, opts = {}) => {
    setType(t);
    setOpciones(opts);
    setSubmitted(false);
    // Monta primero, hace visible al frame siguiente (transición de entrada)
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    // Desmonta tras la transición de salida
    window.setTimeout(() => {
      setType(null);
      setSubmitted(false);
    }, reduced ? 0 : 320);
  }, [reduced]);

  // Bloqueo de scroll mientras hay modal
  useEffect(() => {
    if (!lenis) return;
    if (type) lenis.stop();
    else lenis.start();
  }, [lenis, type]);

  // Escape para cerrar; enfoca el panel al abrir
  useEffect(() => {
    if (!type) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.scrollTo?.(0, 0);
    return () => window.removeEventListener("keydown", onKey);
  }, [type, close]);

  const config = type ? CONFIG[type] : null;
  const Form = config?.Form;

  return (
    <FormModalContext.Provider value={{ open, close }}>
      {children}

      {type && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={config.title}
          className="fixed inset-0 z-[250] flex items-stretch justify-center sm:items-center sm:p-6"
        >
          {/* Telón */}
          <button
            type="button"
            aria-label="Cerrar"
            onClick={close}
            data-cursor-label="Cerrar"
            className={`absolute inset-0 bg-navy-deep/80 backdrop-blur-md transition-opacity duration-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Panel */}
          <div
            ref={panelRef}
            data-lenis-prevent
            className={`no-scrollbar relative z-10 flex w-full max-w-2xl flex-col overflow-y-auto bg-gradient-to-br from-navy-soft to-navy-deep shadow-[0_40px_120px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out sm:max-h-[90vh] sm:rounded-panel sm:border sm:border-white/10 ${
              visible
                ? "translate-y-0 opacity-100 sm:scale-100"
                : "translate-y-6 opacity-0 sm:scale-95"
            }`}
          >
            {/* Luz de marca dentro del panel */}
            <div className="glow-turquoise pointer-events-none absolute -right-[20%] -top-[10%] h-[40vmax] w-[40vmax]" />

            {/* Cabecera fija */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-navy-deep/80 px-7 py-6 backdrop-blur-md sm:px-9">
              <div>
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-turquoise">
                  <StarIcon withCross={false} className="h-3.5 w-3.5 text-turquoise" />
                  {config.eyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                  {config.title}
                </h2>
                {!submitted && (
                  <p className="mt-1.5 max-w-md text-sm font-medium text-white/55">
                    {config.subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar formulario"
                data-cursor-label="Cerrar"
                className="shrink-0 rounded-full border border-white/15 bg-white/[0.04] p-2.5 text-white/70 transition-colors hover:border-white/30 hover:text-white"
              >
                <Icon name="cerrar" className="h-4 w-4" weight={1.9} />
              </button>
            </div>

            {/* Cuerpo */}
            <div className="relative px-7 py-8 sm:px-9">
              {submitted ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="relative mb-7 flex h-20 w-20 items-center justify-center">
                    <span className="absolute inset-0 rounded-full border border-turquoise/40" />
                    <StarIcon className="h-12 w-12 text-turquoise" />
                  </span>
                  <p className="max-w-md text-lg font-medium leading-relaxed text-white sm:text-xl">
                    {config.success}
                  </p>
                  {type === "reserva" && <DatosTransferencia />}
                  <button
                    type="button"
                    onClick={close}
                    data-cursor-label="Cerrar"
                    className="mt-9 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white/80 transition-colors hover:border-white/30 hover:text-white"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <Form onSubmitted={() => setSubmitted(true)} pack={opciones.pack} />
              )}
            </div>
          </div>
        </div>
      )}
    </FormModalContext.Provider>
  );
}
