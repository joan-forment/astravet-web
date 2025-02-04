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
  REQUESTER_OPTIONS,
} from "./options.js";
import { submitForm } from "./submitForm.js";

/* Formulario 1 · Solicitar información */
export default function RequestInfoForm({ onSubmitted }) {
  const [requester, setRequester] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    setError("");
    try {
      await submitForm(form, {
        subject: "Nueva solicitud de información · Astra Vet",
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
          label="Edad del interesado"
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
          label="Idioma de preferencia para ser atendido"
          name="idioma"
          options={LANGUAGE_OPTIONS}
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

      <TextArea
        label="Comentarios que nos quieras hacer llegar"
        name="comentarios"
        placeholder="Cuéntanos lo que necesites…"
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
        data-cursor-label="Enviar"
        className="group relative w-full overflow-hidden rounded-full bg-turquoise px-7 py-4 text-sm font-bold tracking-wide text-navy transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="absolute inset-0 -translate-x-full bg-turquoise-bright transition-transform duration-500 ease-out group-hover:translate-x-0" />
        <span className="relative">
          {sending ? "Enviando…" : "Enviar solicitud"}
        </span>
      </button>
    </form>
  );
}
