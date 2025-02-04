import { useId } from "react";
import Icon from "../components/icons.jsx";

/*
 * Primitivas de formulario para los modales de AstraVet.
 * Estilo sobre fondo navy: inputs translúcidos, foco turquesa,
 * etiquetas en versalitas. Todas conectan label ↔ control por id.
 */

const FIELD_BASE =
  "w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white placeholder:text-white/35 outline-none transition-colors focus:border-turquoise";

function Label({ htmlFor, children, required }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-white/55"
    >
      {children}
      {required && <span className="ml-1 text-turquoise">*</span>}
    </label>
  );
}

export function TextField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  autoComplete,
  inputMode,
  className = "",
}) {
  const id = useId();
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className={FIELD_BASE}
      />
    </div>
  );
}

export function SelectField({
  label,
  name,
  options,
  required = false,
  className = "",
}) {
  const id = useId();
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          defaultValue=""
          className={`${FIELD_BASE} appearance-none pr-10 [&>option]:bg-navy-deep [&>option]:text-white`}
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-abajo"
          className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-white/45"
          weight={2}
        />
      </div>
    </div>
  );
}

export function RadioGroup({
  label,
  name,
  options,
  required = false,
  value,
  onChange,
  className = "",
}) {
  return (
    <fieldset className={className}>
      <legend className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
        {label}
        {required && <span className="ml-1 text-turquoise">*</span>}
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const checked = value === opt;
          return (
            <label
              key={opt}
              data-cursor-label="Elegir"
              className={`flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                checked
                  ? "border-turquoise bg-turquoise/15 text-white"
                  : "border-white/15 bg-white/[0.04] text-white/70 hover:border-white/30"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt}
                required={required}
                checked={onChange ? checked : undefined}
                onChange={onChange ? () => onChange(opt) : undefined}
                className="sr-only"
              />
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  checked ? "border-turquoise" : "border-white/35"
                }`}
              >
                {checked && (
                  <span className="h-2 w-2 rounded-full bg-turquoise" />
                )}
              </span>
              {opt}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function TextArea({
  label,
  name,
  placeholder,
  rows = 4,
  required = false,
  className = "",
}) {
  const id = useId();
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className={`${FIELD_BASE} resize-none`}
      />
    </div>
  );
}

export function Checkbox({ name, children, required = false }) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      data-cursor-label="Aceptar"
      className="flex cursor-pointer items-start gap-3 text-sm font-medium leading-relaxed text-white/70"
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        required={required}
        className="peer sr-only"
      />
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/[0.04] transition-colors peer-checked:border-turquoise peer-checked:bg-turquoise peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-turquoise-bright">
        <Icon
          name="check"
          className="h-3 w-3 text-navy opacity-0 transition-opacity peer-checked:opacity-100"
          weight={2.2}
        />
      </span>
      <span>{children}</span>
    </label>
  );
}

/* Trampa anti-spam (honeypot) de Web3Forms: invisible para humanos,
   los bots la rellenan y el envío se descarta automáticamente. */
export function Honeypot() {
  return (
    <input
      type="checkbox"
      name="botcheck"
      tabIndex={-1}
      aria-hidden="true"
      autoComplete="off"
      className="hidden"
      style={{ display: "none" }}
    />
  );
}

/* Los dos consentimientos legales obligatorios en TODOS los formularios */
export function LegalConsent() {
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <Checkbox name="acepto_privacidad" required>
        He leído y acepto la{" "}
        <a
          href="/politica-de-privacidad.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-turquoise underline underline-offset-2 hover:text-turquoise-bright"
        >
          política de privacidad
        </a>
        .
      </Checkbox>
      <Checkbox name="acepto_comunicaciones">
        Acepto recibir información sobre el curso y futuras convocatorias.
      </Checkbox>
    </div>
  );
}
