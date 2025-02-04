import { useState } from "react";
import {
  TextField,
  SelectField,
  RadioGroup,
  TextArea,
  LegalConsent,
  Honeypot,
} from "./Fields.jsx";
import {
  SOURCE_OPTIONS,
  LANGUAGE_OPTIONS,
  STUDY_OPTIONS,
  SITUATION_OPTIONS,
  REQUESTER_OPTIONS,
} from "./options.js";
import { submitForm } from "./submitForm.js";

/* Formulario 2 · Reserva de plaza (plazas limitadas) */
export default function ReservationForm({ onSubmitted, pack }) {
  const [requester, setRequester] = useState("");
  const [workedAnimals, setWorkedAnimals] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    setError("");
    try {
      await submitForm(form, {
        subject: "Nueva reserva de plaza · Astra Vet",
        from_name: "Web Astra Vet",
      });
      onSubmitted();
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {pack && <input type="hidden" name="pack" value={pack} />}
      {pack && (
        <p className="rounded-2xl border border-turquoise/35 bg-turquoise/[0.08] px-5 py-3.5 text-sm font-semibold text-white">
          Pack elegido: <span className="text-turquoise-bright">{pack}</span>
        </p>
      )}
      {/* Intro destacada */}
      <div className="rounded-2xl border border-amber/35 bg-amber/[0.07] p-5">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber">
          <span className="animate-status-pulse h-1.5 w-1.5 rounded-full bg-amber" />
          Plazas limitadas · Convocatoria de septiembre
        </p>
        <p className="mt-2 text-sm font-medium leading-relaxed text-white/75">
          Reserva tu plaza prioritaria. Las plazas para la próxima convocatoria
          de septiembre son limitadas. Completa este breve formulario y tendrás
          acceso anticipado.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Nombre" name="nombre" autoComplete="given-name" required />
        <TextField label="Apellidos" name="apellidos" autoComplete="family-name" required />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          required
        />
        <TextField
          label="Teléfono"
          name="telefono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
        />
        <TextField
          label="Código postal"
          name="cp"
          inputMode="numeric"
          autoComplete="postal-code"
          required
        />
        <TextField
          label="Edad"
          name="edad"
          type="number"
          inputMode="numeric"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="¿Cómo nos has conocido?"
          name="origen"
          options={SOURCE_OPTIONS}
          required
        />
        <SelectField
          label="Idioma de preferencia"
          name="idioma"
          options={LANGUAGE_OPTIONS}
          required
        />
        <SelectField
          label="Estudios previos"
          name="estudios"
          options={STUDY_OPTIONS}
          required
        />
        <SelectField
          label="Situación actual"
          name="situacion"
          options={SITUATION_OPTIONS}
          required
        />
      </div>

      <RadioGroup
        label="¿Quién solicita la información?"
        name="solicitante"
        options={REQUESTER_OPTIONS}
        value={requester}
        onChange={setRequester}
        required
      />

      <RadioGroup
        label="¿Has trabajado anteriormente con animales?"
        name="trabajo_animales"
        options={["Sí", "No"]}
        value={workedAnimals}
        onChange={setWorkedAnimals}
        required
      />

      {/* Campo condicional: solo aparece si respondió "Sí".
          Texto corto con el mismo estilo visual que el campo "Nombre". */}
      {workedAnimals === "Sí" && (
        <TextField
          label="Por favor, indica el puesto de trabajo"
          name="puesto_animales"
          placeholder="Ej. Auxiliar en clínica veterinaria"
          required
        />
      )}

      <RadioGroup
        label="¿Interesado en recibir info por WhatsApp?"
        name="whatsapp"
        options={["Sí", "No"]}
        value={whatsapp}
        onChange={setWhatsapp}
        required
      />

      {/* Comentarios libres */}
      <TextArea
        label="Comentarios (opcional)"
        name="comentarios"
        placeholder="Cuéntanos más sobre ti o déjanos tus dudas…"
      />

      <LegalConsent />

      <Honeypot />

      {error && (
        <p className="text-sm font-medium text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        aria-busy={sending}
        data-cursor-label="Reservar"
        className="group relative w-full overflow-hidden rounded-full bg-amber px-7 py-4 text-sm font-bold tracking-wide text-navy transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="absolute inset-0 -translate-x-full bg-highlight transition-transform duration-500 ease-out group-hover:translate-x-0" />
        <span className="relative">
          {sending ? "Enviando…" : "Reservar mi plaza prioritaria"}
        </span>
      </button>
    </form>
  );
}
