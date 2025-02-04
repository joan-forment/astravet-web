/*
 * Envío de los formularios de la web (Solicitar info, Reserva tu plaza y
 * novedades del pie).
 *
 * Cada envío va a DOS sitios a la vez, para que ninguna solicitud se pierda:
 *
 *   1. El campus (principal): se guarda en el panel del campus
 *      (Panel de gestión → Solicitudes web) y llega por correo a
 *      admin@astravet.es.
 *   2. Web3Forms (copia de seguridad): reenvía el formulario al correo de la
 *      clave de abajo, astra.vet@outlook.com. Para que esa copia llegue también
 *      a admin@astravet.es, crea una clave nueva en https://web3forms.com con
 *      ese correo y pégala abajo.
 *
 * El formulario solo da error si fallan los dos.
 * La clave de Web3Forms es PÚBLICA por diseño (no es una contraseña).
 */
export const WEB3FORMS_ACCESS_KEY = "6fcf0b3a-e529-42f0-ab92-ce48c2e7c23f";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const CAMPUS_ENDPOINT = "https://campus.astravet.es/api/public/web-form";

async function enviar(url, body, mensajeError) {
  const response = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || mensajeError);
  }
  return data;
}

/**
 * Envía los campos de un <form> al campus y a Web3Forms.
 * @param {HTMLFormElement} formEl  El elemento <form> a enviar.
 * @param {Record<string,string>} extra  Campos adicionales (subject, from_name…).
 * @returns {Promise<object>} La respuesta del primer destino que lo acepte.
 * @throws {Error} Si fallan los dos envíos.
 */
export async function submitForm(formEl, extra = {}) {
  const datos = () => {
    const formData = new FormData(formEl);
    for (const [key, value] of Object.entries(extra)) formData.append(key, value);
    return formData;
  };
  const errorGenerico =
    "No se pudo enviar el formulario. Inténtalo de nuevo o escríbenos a admin@astravet.es.";

  const web3 = datos();
  web3.append("access_key", WEB3FORMS_ACCESS_KEY);

  const [campus, copia] = await Promise.allSettled([
    enviar(CAMPUS_ENDPOINT, datos(), errorGenerico),
    enviar(WEB3FORMS_ENDPOINT, web3, errorGenerico),
  ]);
  if (campus.status === "fulfilled") return campus.value;
  if (copia.status === "fulfilled") return copia.value;
  throw campus.reason instanceof Error ? campus.reason : new Error(errorGenerico);
}
