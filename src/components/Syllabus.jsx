import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@studio-freight/react-lenis";

import Icon from "./icons.jsx";
import StarIcon from "./StarIcon.jsx";
import { useFormModal } from "../forms/FormModal.jsx";
import {
  bloques,
  formatosImparticion,
  instruccionBloques,
  introduccion,
  pasosDesarrollo,
  tituloDesarrollo,
  tituloImparticion,
  TOTAL_HORAS,
  TOTAL_TEMAS,
} from "../config/temario.js";

/* Columnas de la rejilla de módulos (mismos cortes que sm:grid-cols-2 y
   lg:grid-cols-3). Hace falta saberlas para abrir el panel de temas justo
   debajo de la fila del módulo pulsado y no al final de los seis: en el móvil
   (una columna) el panel quedaba fuera de la pantalla y había que buscarlo. */
function useColumnas() {
  const leer = () =>
    typeof window === "undefined"
      ? 3
      : window.matchMedia("(min-width: 1024px)").matches
        ? 3
        : window.matchMedia("(min-width: 640px)").matches
          ? 2
          : 1;
  const [columnas, setColumnas] = useState(leer);
  useEffect(() => {
    const alCambiar = () => setColumnas(leer());
    window.addEventListener("resize", alCambiar);
    return () => window.removeEventListener("resize", alCambiar);
  }, []);
  return columnas;
}

/*
 * Estructura del temario.
 *
 * Todos los textos, módulos y temas salen de src/config/temario.js: aquí no
 * hay contenido escrito a mano. Para cambiar un módulo o un tema se edita ese
 * archivo, no este.
 *
 * Objetivo de la sección, según el cliente: "que el alumno pueda entender de
 * un vistazo cómo está organizado el curso y profundizar en los módulos que le
 * interese". Solo se publica el total de horas (660 h, incluye la parte
 * práctica): las horas de cada módulo no se muestran (petición del 16/10/2026).
 *
 * TEMA CLARO: la sección va sobre fondo blanco (.section-light), igual que
 * "Por qué AstraVet" y "Empleabilidad". Recordatorio de cómo funciona ese tema
 * (ver src/index.css): dentro de .section-light la familia "white" pasa a ser
 * la TINTA navy, así que text-white/60 se lee como navy al 60 %. Los paneles
 * que siguen siendo oscuros (los seis bloques y el desplegable de temas)
 * llevan .theme-static para recuperar el blanco real dentro de ellos.
 *
 * Accesibilidad: los recuadros de bloque son <button> reales, navegables con
 * el teclado, con aria-expanded y aria-controls sobre el panel de temas, y el
 * panel se cierra con Escape. Las filas de impartición no son interactivas.
 */

/* Paleta de los formatos de impartición. Se elige desde el catálogo con el
   campo "acento" para que el cliente pueda cambiar un color sin tocar código.
   El color identifica el canal (físico / online / en vivo / presencial), no es
   decoración: la correspondencia está documentada en temario.js. */
const ACENTOS = {
  amber: {
    caja: "border-amber/40 bg-amber/[0.12]",
    titulo: "text-amber",
    punto: "bg-amber",
  },
  coral: {
    caja: "border-coral/40 bg-coral/[0.12]",
    titulo: "text-coral",
    punto: "bg-coral",
  },
  highlight: {
    caja: "border-highlight/45 bg-highlight/[0.12]",
    titulo: "text-highlight",
    punto: "bg-highlight",
  },
  turquoise: {
    caja: "border-turquoise/40 bg-turquoise/[0.12]",
    titulo: "text-turquoise",
    punto: "bg-turquoise",
  },
};

/* Los iconos de los formatos de impartición ya no se dibujan aquí: viven en
   src/components/icons.jsx junto con los del resto de la web, para que todos
   compartan lienzo, grosor y remates. El catálogo (temario.js) sigue eligiendo
   el suyo por nombre igual que antes. */

/* Párrafo de la introducción con una palabra en negrita, tal como la marcó el
   cliente. El texto no se reescribe: solo se resalta la primera aparición. */
function ParrafoIntro({ bloque }) {
  if (bloque.tipo === "lista") {
    return (
      <ul className="mt-4 space-y-2.5 pl-1">
        {bloque.elementos.map((elemento) => (
          <li
            key={elemento}
            className="flex items-start gap-3 text-base font-medium leading-relaxed text-white/70"
          >
            <StarIcon withCross={false} className="mt-1.5 h-3 w-3 shrink-0 text-turquoise" />
            {elemento}
          </li>
        ))}
      </ul>
    );
  }

  if (!bloque.fuerte) {
    return (
      <p className="mt-5 text-base font-medium leading-relaxed text-white/70">
        {bloque.texto}
      </p>
    );
  }

  const corte = bloque.texto.indexOf(bloque.fuerte);
  return (
    <p className="mt-5 text-base font-medium leading-relaxed text-white/70">
      {bloque.texto.slice(0, corte)}
      <strong className="font-black text-white">{bloque.fuerte}</strong>
      {bloque.texto.slice(corte + bloque.fuerte.length)}
    </p>
  );
}

/* Línea de progreso del curso: horizontal en escritorio, vertical en móvil. */
function LineaDesarrollo() {
  return (
    <ol className="mt-10 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {pasosDesarrollo.map((paso, i) => (
        <li key={paso} className="temario-paso relative flex gap-4 lg:block">
          {/* Conector vertical (móvil y tableta) */}
          {i < pasosDesarrollo.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-[1.125rem] top-10 h-[calc(100%+2rem)] w-px bg-turquoise/35 sm:hidden"
            />
          )}
          {/* Conector horizontal (escritorio), salvo al final de cada fila */}
          {i % 4 !== 3 && i < pasosDesarrollo.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-10 top-[1.125rem] hidden h-px w-[calc(100%-2.5rem)] bg-turquoise/35 lg:block"
            />
          )}

          {/* Sobre el fondo blanco el número va en un círculo navy sólido: el
              turquesa claro sobre blanco no llegaba a leerse. */}
          <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-black text-turquoise-bright">
            {i + 1}
          </span>
          <p className="text-sm font-semibold leading-snug text-white/80 lg:mt-4 lg:pr-4">
            {paso}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* Recuadro azul de un módulo formativo (sin horas: solo se publica el total).
   Sobre el fondo blanco de la sección el recuadro sigue siendo navy, así que
   lleva .theme-static para que el blanco de su interior sea blanco de verdad.
 *
 * ⚠️ La transición enumera las propiedades una a una y NO usa transition-all:
 *    estos recuadros los anima GSAP (opacity y transform, ver .temario-bloque
 *    más abajo) y una transición de CSS sobre esas dos propiedades se pelea con
 *    GSAP y deja los seis recuadros invisibles. Misma razón por la que el
 *    header entra con @keyframes y no con transition (ver src/index.css). */
function BotonBloque({ bloque, abierto, onToggle, refBoton }) {
  return (
    <button
      ref={refBoton}
      type="button"
      id={`bloque-${bloque.id}`}
      onClick={() => onToggle(bloque.id)}
      aria-expanded={abierto}
      aria-controls="temario-panel"
      data-cursor-label={abierto ? "Cerrar" : "Ver temas"}
      className={`temario-bloque theme-static group relative flex h-full flex-col rounded-card border p-5 text-left transition-[background-color,border-color,box-shadow] duration-300 ${
        abierto
          ? "border-turquoise bg-navy-soft shadow-[0_22px_45px_-24px_rgba(13,27,62,0.75)]"
          : "border-transparent bg-navy shadow-[0_14px_32px_-22px_rgba(13,27,62,0.6)] hover:border-turquoise/60 hover:bg-navy-soft hover:shadow-[0_22px_45px_-22px_rgba(13,27,62,0.8)]"
      }`}
    >
      {/* Sin horas por módulo: el cliente solo publica el total (incluye la
          parte práctica). Ver temario.js. */}
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-turquoise">
        Módulo {bloque.numero}
      </span>

      <span className="mt-4 flex-1 text-sm font-black leading-snug text-white">
        {bloque.titulo}
      </span>

      <span className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">
        <span
          aria-hidden="true"
          className={`flex h-5 w-5 items-center justify-center rounded-full border border-white/20 transition-transform duration-300 ${
            abierto ? "rotate-45" : ""
          }`}
        >
          <Icon name="mas" className="h-2.5 w-2.5" weight={2.2} />
        </span>
        {bloque.temas.length} temas
      </span>
    </button>
  );
}

/* Una forma de impartición.
 *
 * Antes eran cinco tarjetas de colores, de alto distinto, con el distintivo de
 * "en directo" sobresaliendo por arriba y huecos donde no había detalles. Ahora
 * las cinco comparten la misma anatomía —icono · título · detalles · modalidad—
 * dentro de una única lista con separadores, que es el mismo patrón con el que
 * se listan los temas de cada bloque justo encima. El color queda reducido al
 * recuadro del icono: así la fila se lee como parte de un sistema y no como
 * cinco piezas sueltas. */
function FilaFormato({ formato }) {
  const acento = ACENTOS[formato.acento] ?? ACENTOS.amber;
  /* El rojo de "en directo" se escribe en hex y no con un token de marca: no
     pertenece a la paleta, es la señal universal de emisión en vivo. */
  const distintivo = formato.enDirecto
    ? "border-[#e5322d]/35 bg-[#e5322d]/[0.08] text-[#c32621]"
    : "border-white/15 bg-white/[0.04] text-white/55";

  return (
    <li className="temario-formato flex flex-col gap-4 border-t border-white/10 px-5 py-6 transition-colors duration-300 first:border-t-0 hover:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-6 sm:px-7">
      <span
        aria-hidden="true"
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${acento.caja} ${acento.titulo}`}
      >
        <Icon name={formato.icono} />
      </span>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-black uppercase leading-snug tracking-tight text-white sm:text-base">
          {formato.titulo}
        </h4>

        {formato.detalles.length > 0 && (
          <ul className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {formato.detalles.map((detalle) => (
              <li
                key={detalle}
                className="flex items-center gap-2 text-xs font-medium text-white/60"
              >
                <span
                  aria-hidden="true"
                  className={`h-1 w-1 rounded-full ${acento.punto}`}
                />
                {detalle}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modalidad: el único distintivo de la fila. Va en rojo, con el punto
          tipo REC, cuando la clase ocurre en vivo con un profesor delante. */}
      <span
        className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full border px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] sm:self-auto ${distintivo}`}
      >
        {formato.enDirecto && (
          <span
            aria-hidden="true"
            className="animate-rec-pulse-ink h-1.5 w-1.5 rounded-full bg-[#e5322d]"
          />
        )}
        {formato.modalidad}
      </span>
    </li>
  );
}

export default function Syllabus({ reduced }) {
  const sectionRef = useRef(null);
  const { open } = useFormModal();
  const [abierto, setAbierto] = useState(null);
  const [flechaX, setFlechaX] = useState(null);
  const botonesRef = useRef({});
  const filaRef = useRef(null);
  const panelRef = useRef(null);
  const columnas = useColumnas();
  const lenis = useLenis();

  const bloqueAbierto = bloques.find((b) => b.id === abierto) ?? null;
  /* El panel va justo después del último módulo de la fila del pulsado. */
  const indiceAbierto = bloques.findIndex((b) => b.id === abierto);
  const panelTrasIndice =
    indiceAbierto < 0
      ? -1
      : Math.min(Math.ceil((indiceAbierto + 1) / columnas) * columnas, bloques.length) - 1;

  /* Si al abrir el panel su principio queda fuera de la vista —por debajo
     (módulo pulsado cerca del borde inferior) o por encima (al cambiar de
     módulo se cierra el panel anterior y todo sube)— se desplaza la vista
     hasta el módulo pulsado. */
  useEffect(() => {
    if (!abierto) return;
    const id = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const { top } = panel.getBoundingClientRect();
      if (top > 80 && top < window.innerHeight * 0.7) return;
      const destino = botonesRef.current[abierto] ?? panel;
      if (lenis && !reduced) lenis.scrollTo(destino, { offset: -96, duration: 0.9 });
      else destino.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [abierto, lenis, reduced]);

  const alternar = useCallback((id) => {
    setAbierto((actual) => (actual === id ? null : id));
  }, []);

  /* Coloca la flecha del panel justo debajo del bloque que se ha clicado. */
  const recolocarFlecha = useCallback(() => {
    if (!abierto || !filaRef.current) return;
    const boton = botonesRef.current[abierto];
    if (!boton) return;
    const fila = filaRef.current.getBoundingClientRect();
    const caja = boton.getBoundingClientRect();
    setFlechaX(caja.left - fila.left + caja.width / 2);
  }, [abierto]);

  useLayoutEffect(recolocarFlecha, [recolocarFlecha]);

  useEffect(() => {
    window.addEventListener("resize", recolocarFlecha);
    return () => window.removeEventListener("resize", recolocarFlecha);
  }, [recolocarFlecha]);

  /* Escape cierra el panel de temas y devuelve el foco al bloque. */
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e) => {
      if (e.key !== "Escape") return;
      botonesRef.current[abierto]?.focus();
      setAbierto(null);
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [abierto]);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".temario-bloque", {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".temario-fila", start: "top 85%", once: true },
      });
      gsap.from(".temario-paso", {
        autoAlpha: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".temario-desarrollo", start: "top 85%", once: true },
      });
      /* Las filas de impartición entran como el resto de la sección: antes
         aparecían de golpe y rompían el ritmo del scroll. */
      gsap.from(".temario-formato", {
        autoAlpha: 0,
        y: 24,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: ".temario-imparticion",
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      id="temario"
      ref={sectionRef}
      className="section-light relative overflow-hidden py-28 sm:py-36"
    >
      <div className="glow-turquoise pointer-events-none absolute -left-[15%] top-[15%] h-[50vmax] w-[50vmax]" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-12">
        {/* Encabezado de sección */}
        <div className="mb-16 flex items-baseline gap-6">
          <span className="text-sm font-black text-turquoise">04</span>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-white/50">
            Temario
          </p>
          <span className="hidden h-px flex-1 bg-white/10 sm:block" />
        </div>

        <div className="max-w-3xl">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-turquoise-deep">
            <StarIcon withCross={false} className="h-3.5 w-3.5 text-turquoise" />
            Estructura del temario
          </p>
          <h2 className="mt-5 text-4xl font-black uppercase leading-[1.04] tracking-tight sm:text-6xl">
            Qué vas a <span className="text-highlight">aprender</span>
          </h2>

          {introduccion.map((bloque, i) => (
            <ParrafoIntro key={i} bloque={bloque} />
          ))}
        </div>

        {/* ¿Cómo se desarrolla el curso? · va antes del esquema de recuadros */}
        <div className="temario-desarrollo mt-20">
          <h3 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            {tituloDesarrollo}
          </h3>
          <LineaDesarrollo />
        </div>

        {/* Los seis bloques formativos */}
        <div className="mt-24">
          {/* turquoise-deep en lugar de turquoise: el turquesa de marca sobre
              blanco se quedaba casi ilegible a este tamaño de texto. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="rounded-full bg-navy px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-turquoise-bright">
              {TOTAL_HORAS} horas · {bloques.length} módulos · {TOTAL_TEMAS} temas
            </span>
            <p className="text-base font-semibold leading-relaxed text-turquoise-deep">
              {instruccionBloques}
            </p>
          </div>

          <div
            ref={filaRef}
            className="temario-fila relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {bloques.map((bloque, i) => (
              <Fragment key={bloque.id}>
                <BotonBloque
                  bloque={bloque}
                  abierto={abierto === bloque.id}
                  onToggle={alternar}
                  refBoton={(el) => {
                    botonesRef.current[bloque.id] = el;
                  }}
                />

                {/* Panel de temas del módulo abierto, justo debajo de su fila,
                    con la flecha apuntando al recuadro que se ha clicado. */}
                {bloqueAbierto && i === panelTrasIndice && (
                  <div
                    id="temario-panel"
                    ref={panelRef}
                    role="region"
                    aria-labelledby={`bloque-${bloqueAbierto.id}`}
                    className="theme-static relative col-span-full mt-1"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -top-2 h-4 w-4 rotate-45 border-l border-t border-turquoise/50 bg-navy-deep"
                      style={{
                        left: flechaX == null ? "2rem" : `${flechaX - 8}px`,
                      }}
                    />
                    <div className="rounded-card border border-turquoise/50 bg-navy-deep p-6 shadow-[0_26px_55px_-30px_rgba(13,27,62,0.8)] sm:p-8">
                      <h4 className="max-w-3xl text-base font-black leading-snug text-white">
                        Módulo {bloqueAbierto.numero} · {bloqueAbierto.titulo}
                      </h4>

                      <ol className="mt-6 space-y-4">
                        {bloqueAbierto.temas.map((tema) => (
                          <li
                            key={tema.numero}
                            className="border-t border-white/10 pt-4 first:border-0 first:pt-0"
                          >
                            <p className="flex items-start gap-4 text-sm font-bold leading-snug text-white">
                              <span className="w-14 shrink-0 text-xs font-black uppercase tracking-wide text-turquoise-bright">
                                Tema {tema.numero}
                              </span>
                              {tema.titulo}
                            </p>
                            <ul className="mt-2 space-y-1 pl-[4.5rem]">
                              {tema.subtemas.map((subtema) => (
                                <li
                                  key={subtema}
                                  className="relative text-[13px] font-medium leading-snug text-white/65 before:absolute before:-left-3 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-turquoise/70"
                                >
                                  {subtema}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ol>

                      <button
                        type="button"
                        onClick={() => {
                          botonesRef.current[bloqueAbierto.id]?.focus();
                          setAbierto(null);
                        }}
                        data-cursor-label="Cerrar"
                        className="mt-6 rounded-full border border-white/20 px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-turquoise hover:text-turquoise"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Cómo se imparte el temario · lista de formatos, no interactiva */}
        <div className="temario-imparticion mt-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/50">
            Cómo se imparte
          </p>
          <h3 className="mt-4 max-w-2xl text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            {tituloImparticion}
          </h3>

          <ul className="mt-8 overflow-hidden rounded-panel border border-white/10 bg-white/[0.02]">
            {formatosImparticion.map((formato) => (
              <FilaFormato key={formato.id} formato={formato} />
            ))}
          </ul>
        </div>

        <div className="mt-16">
          <button
            type="button"
            onClick={() => open("info")}
            data-cursor-label="Sin compromiso"
            className="group relative inline-flex overflow-hidden rounded-full bg-turquoise px-8 py-4 text-sm font-bold tracking-wide text-navy transition-colors"
          >
            <span className="absolute inset-0 -translate-x-full bg-turquoise-bright transition-transform duration-500 ease-out group-hover:translate-x-0" />
            <span className="relative">Pide el temario completo</span>
          </button>
        </div>
      </div>
    </section>
  );
}
