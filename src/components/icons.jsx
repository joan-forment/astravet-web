/*
 * ══════════════════════════════════════════════════════════════════════════
 *  SISTEMA DE ICONOS · AstraVet
 * ══════════════════════════════════════════════════════════════════════════
 *  Fuente única de todos los iconos de la web. Antes cada componente dibujaba
 *  los suyos: lienzos de 24×24, 16×16, 12×12 y 10×16, grosores de 1.5, 1.6,
 *  1.8 y 2, unos con remates redondos y otros en pico, y dos secciones tirando
 *  directamente de emoji a color. Puestos uno al lado de otro no parecían de
 *  la misma familia.
 *
 *  La referencia es la iconografía de "Cómo se imparte" (temario), que ya
 *  estaba bien resuelta. Sus reglas, ahora obligatorias para todos:
 *
 *    · Lienzo 20×20 sin excepción. Todos los dibujos ocupan el mismo alto
 *      óptico (~15 u) para que ninguno pese más que otro dentro de su caja.
 *    · Trazo abierto, nunca relleno: el icono hereda currentColor del padre,
 *      así que el color lo pone quien lo usa y funciona igual sobre fondo
 *      claro y oscuro.
 *    · Grosor 1.5 y remates/uniones redondos, en sintonía con los bordes
 *      redondeados (rounded-2xl) de las tarjetas.
 *
 *  CUÁNDO USAR UN ICONO (y cuándo no):
 *    · SÍ, cuando nombra una cosa concreta y distinguible de las demás de su
 *      lista: un libro impreso, una pantalla, una emisión en directo, un sitio
 *      físico, una videollamada, un reloj.
 *    · NO, cuando la lista está ORDENADA (pasos, estructura): ahí manda el
 *      número, y un icono al lado solo compite con él.
 *    · NO, para conceptos abstractos (valores, principios): el apretón de
 *      manos y la bombilla no informan de nada, solo decoran. En esos sitios
 *      mandan la tipografía y el color. Por eso los pilares de "Quiénes somos"
 *      y la estructura del curso ya no llevan icono.
 *
 *  Los logotipos de terceros (WhatsApp) NO viven aquí: son marcas registradas
 *  con su propio dibujo, no se pueden redibujar al estilo de la casa.
 * ══════════════════════════════════════════════════════════════════════════
 */

/* Atributos comunes. Van en el <svg>, no en cada trazo: los hijos los heredan,
   así que los dibujos de abajo son solo geometría. */
const TRAZO = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/* Cada entrada es solo geometría sobre el lienzo 20×20. Para añadir un icono
   nuevo, se dibuja aquí y se usa por su nombre: no se pega un <svg> suelto
   dentro de un componente. */
const DIBUJOS = {
  /* ── Formatos de impartición (temario) ─────────────────────────────── */

  /* Libro abierto · temario impreso */
  libro: (
    <path d="M10 5.6S8.4 4.2 5.8 4.2H3v10.6h2.8c2.6 0 4.2 1.4 4.2 1.4m0-10.6s1.6-1.4 4.2-1.4H17v10.6h-2.8c-2.6 0-4.2 1.4-4.2 1.4m0-10.6v10.6" />
  ),
  /* Pantalla con play · campus virtual */
  pantalla: (
    <>
      <rect x="2.5" y="3.5" width="15" height="10.5" rx="1.8" />
      <path d="M8.6 6.9l3.6 1.85-3.6 1.85V6.9Z" />
      <path d="M7 17h6M10 14v3" />
    </>
  ),
  /* Ondas de emisión · seminarios en directo */
  senal: (
    <>
      <circle cx="10" cy="10" r="1.9" />
      <path d="M6.2 6.2a5.4 5.4 0 0 0 0 7.6m7.6 0a5.4 5.4 0 0 0 0-7.6M3.7 3.7a8.9 8.9 0 0 0 0 12.6m12.6 0a8.9 8.9 0 0 0 0-12.6" />
    </>
  ),
  /* Marcador de mapa · talleres presenciales */
  lugar: (
    <>
      <path d="M10 17.4s5.6-4.7 5.6-8.6a5.6 5.6 0 1 0-11.2 0c0 3.9 5.6 8.6 5.6 8.6Z" />
      <circle cx="10" cy="8.7" r="1.9" />
    </>
  ),
  /* Cámara de vídeo · tutorías por videoconferencia */
  videollamada: (
    <>
      <rect x="2.5" y="5" width="11" height="10" rx="2.2" />
      <path d="M13.5 8.9l4-2.3v6.8l-4-2.3V8.9Z" />
    </>
  ),

  /* ── Motivos de "Por qué AstraVet" ─────────────────────────────────── */

  /* Estetoscopio · curso creado por veterinarios. Sustituye a un círculo con
     una cruz dentro, que era el símbolo genérico de "añadir". */
  estetoscopio: (
    <>
      <path d="M6.3 2.8v3.9c0 2 1.7 3.7 3.7 3.7s3.7-1.7 3.7-3.7V2.8" />
      <path d="M4.9 2.8h2.8M12.3 2.8h2.8" />
      <path d="M10 10.4v2.6q0 2.9 2.9 2.9" />
      <circle cx="14.8" cy="15.9" r="1.9" />
    </>
  ),
  /* Cuatro paneles · contenido en 4 formatos */
  formatos: (
    <>
      <rect x="2.8" y="2.8" width="6.4" height="6.4" rx="1.6" />
      <rect x="10.8" y="2.8" width="6.4" height="6.4" rx="1.6" />
      <rect x="2.8" y="10.8" width="6.4" height="6.4" rx="1.6" />
      <rect x="10.8" y="10.8" width="6.4" height="6.4" rx="1.6" />
    </>
  ),
  /* Reloj · flexibilidad de horarios */
  reloj: (
    <>
      <circle cx="10" cy="10" r="7.2" />
      <path d="M10 5.9V10l2.9 1.7" />
    </>
  ),
  /* Historia clínica · casos clínicos reales */
  historial: (
    <>
      <rect x="4" y="3.8" width="12" height="13.4" rx="2.2" />
      <rect x="7.5" y="2.4" width="5" height="2.8" rx="1.2" />
      <path d="M10 8.8v4.6M7.7 11.1h4.6" />
    </>
  ),
  /* Dos personas · comunidad activa */
  comunidad: (
    <>
      <circle cx="7.6" cy="7.4" r="2.7" />
      <path d="M2.8 16.8c0-2.7 2.1-4.8 4.8-4.8s4.8 2.1 4.8 4.8" />
      <path d="M13.4 5.1a2.7 2.7 0 0 1 0 4.9M14.5 12.3c1.6.6 2.7 2.1 2.7 4" />
    </>
  ),
  /* Una persona · tutorías personalizadas */
  tutor: (
    <>
      <circle cx="10" cy="7" r="3" />
      <path d="M4.2 16.9c0-3.2 2.6-5.3 5.8-5.3s5.8 2.1 5.8 5.3" />
    </>
  ),

  /* ── Iconos de interfaz ────────────────────────────────────────────── */
  /* Se usan a tamaños pequeños (10–16 px). A esos tamaños el trazo de 1.5
     casi desaparece, así que quien los pinta sube el grosor con `weight`. */

  check: <path d="M4.6 10.4l3.7 3.7 7.1-8.2" />,
  cerrar: <path d="M5.2 5.2l9.6 9.6M14.8 5.2l-9.6 9.6" />,
  mas: <path d="M10 4.4v11.2M4.4 10h11.2" />,
  flecha: <path d="M3.4 10h12.2M11.3 5.7 15.6 10l-4.3 4.3" />,
  "chevron-izquierda": <path d="M12.4 4.6 7 10l5.4 5.4" />,
  "chevron-derecha": <path d="M7.6 4.6 13 10l-5.4 5.4" />,
  "chevron-abajo": <path d="M4.6 7.6 10 13l5.4-5.4" />,
};

/**
 * Pinta un icono del sistema.
 *
 * @param name      Clave de DIBUJOS. Si no existe, no pinta nada (mejor un
 *                  hueco que un icono equivocado dando información falsa).
 * @param className Tamaño y color. Por defecto h-5 w-5, la medida de las
 *                  cajas de 48 px de las tarjetas.
 * @param weight    Grosor del trazo. 1.5 es el del sistema; se sube solo en
 *                  los iconos de interfaz pintados por debajo de 16 px.
 */
export default function Icon({
  name,
  className = "h-5 w-5",
  weight = 1.5,
  ...rest
}) {
  const dibujo = DIBUJOS[name];
  if (!dibujo) return null;

  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      strokeWidth={weight}
      aria-hidden="true"
      {...TRAZO}
      {...rest}
    >
      {dibujo}
    </svg>
  );
}
