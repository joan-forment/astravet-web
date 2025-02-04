import { useEffect, useRef, useState } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import { useFormModal } from "../forms/FormModal.jsx";

/*
 * Etiquetas cortas a propósito: la barra tiene que caber en una sola línea
 * entre el logo y los CTAs, sin que ningún enlace parta en dos renglones.
 */
const LINKS = [
  { label: "Por qué", target: "#por-que" },
  { label: "Nosotros", target: "#quienes-somos" },
  { label: "El curso", target: "#curso" },
  { label: "Temario", target: "#temario" },
  { label: "Precios", target: "#precios" },
  { label: "Empleo", target: "#empleabilidad" },
];

/*
 * Secciones de fondo claro: cuando una de ellas queda por debajo de la barra,
 * el header se pasa a tinta oscura (logo, enlaces, hamburguesa y difuminado).
 *
 * ⚠️ Esta lista se mantiene A MANO. Si una sección cambia de tema hay que
 *    añadirla o quitarla aquí, o el header se quedará en blanco sobre blanco.
 *    Van en el orden en que aparecen en la página, y deben coincidir con las
 *    secciones que llevan .section-light (o fondo blanco propio, como el pie).
 */
const LIGHT_SECTION_IDS = [
  "por-que",
  "quienes-somos",
  "temario",
  "empleabilidad",
  "contacto",
];

export default function Header({ reduced, start }) {
  const headerRef = useRef(null);
  const progressRef = useRef(null);
  const [lightSection, setLightSection] = useState(false);
  // Estado del menú móvil (hamburguesa). Solo afecta a pantallas < lg.
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useFormModal();

  const lenis = useLenis((l) => {
    const headerBottom = 80;
    const isLight = LIGHT_SECTION_IDS.some((id) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const { top, bottom } = el.getBoundingClientRect();
      return top <= headerBottom && bottom > 0;
    });
    setLightSection(isLight);

    if (progressRef.current) {
      const p = l.limit > 0 ? l.scroll / l.limit : 0;
      progressRef.current.style.transform = `scaleX(${Math.min(p, 1)})`;
    }
  });

  // Cierra el menú móvil al pulsar Escape o al pasar a viewport de escritorio (lg)
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  /* La barra es fija: sin este margen, al saltar a una sección su primera
     línea queda POR DEBAJO del header y parece que el enlace se ha pasado de
     largo. El mismo valor va en scroll-mt-24 (src/index.css) para la
     navegación que no pasa por aquí (enlaces pegados, vuelta atrás). */
  const DESPLAZAMIENTO_HEADER = 88;

  const go = (e, target) => {
    e.preventDefault();
    setMenuOpen(false); // cierra el panel móvil antes de navegar
    if (target === "#hero") {
      /* Arriba del todo: sin margen, o se quedaría el hero cortado. */
      if (lenis && !reduced) lenis.scrollTo(0, { duration: 1.6 });
      else window.scrollTo({ top: 0 });
      return;
    }
    if (lenis && !reduced) {
      lenis.scrollTo(target, {
        offset: -DESPLAZAMIENTO_HEADER,
        duration: 1.6,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      document.querySelector(target)?.scrollIntoView();
    }
  };

  // Acciones de CTA desde el menú móvil: cierran el panel y abren el formulario
  const openForm = (kind) => {
    setMenuOpen(false);
    open(kind);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-[150] transition-colors duration-300 ${
        reduced ? "" : start ? "animate-header-drop" : "-translate-y-[110%]"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:gap-6 sm:px-12">
        {/* Logo adaptativo */}
        <a
          href="#hero"
          onClick={(e) => go(e, "#hero")}
          data-cursor-label="Subir"
          className="shrink-0"
        >
          <img
            src={lightSection ? "/logo-default.png" : "/logo-white.png"}
            alt="AstraVet"
            /* Logo algo más compacto en móviles pequeños para no comerse el ancho */
            className="h-11 w-auto transition-opacity duration-300 sm:h-14"
          />
        </a>

        {/* Navegación de escritorio (oculta en móvil/tablet, sustituida por el menú hamburguesa) */}
        <nav aria-label="Principal" className="hidden shrink-0 items-center gap-6 lg:flex xl:gap-7">
          {LINKS.map((link) => (
            <a
              key={link.target}
              href={link.target}
              onClick={(e) => go(e, link.target)}
              data-cursor-label="Ir"
              /* whitespace-nowrap: un enlace nunca parte en dos renglones,
                 aunque la barra se quede justa de ancho. */
              className={`group relative whitespace-nowrap py-2 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-300 xl:tracking-[0.22em] ${
                lightSection
                  ? "text-navy/65 hover:text-navy-deep"
                  : "text-white/65 hover:text-white"
              }`}
            >
              {link.label}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-turquoise transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        {/* CTAs + disparador del menú móvil */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => open("info")}
            data-cursor-label="Sin compromiso"
            /* whitespace-nowrap: "Solicitar info" partía en dos renglones
               cuando la barra se quedaba justa (~1024px). */
            className={`hidden whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.18em] transition-colors md:inline ${
              lightSection ? "text-navy/70 hover:text-navy-deep" : "text-white/70 hover:text-white"
            }`}
          >
            <span className="hidden xl:inline">Solicitar info</span>
            <span className="xl:hidden">Info</span>
          </button>
          <button
            type="button"
            onClick={() => open("reserva")}
            data-cursor-label="Plazas limitadas"
            /* Texto y padding reducidos en móvil para que el botón no desborde junto a la hamburguesa */
            className="group relative shrink-0 overflow-hidden rounded-full bg-[#F5A429] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-navy sm:px-5 sm:text-[11px] sm:tracking-[0.18em]"
          >
            <span className="absolute inset-0 -translate-x-full bg-amber transition-transform duration-500 ease-out group-hover:translate-x-0" />
            {/* Tres longitudes según el ancho: el texto largo solo aparece
                cuando la barra tiene sitio de sobra para él. */}
            <span className="relative whitespace-nowrap">
              <span className="hidden xl:inline">Reserva tu plaza</span>
              <span className="hidden sm:inline xl:hidden">Reservar plaza</span>
              <span className="sm:hidden">Reservar</span>
            </span>
          </button>

          {/* Botón hamburguesa: solo < lg. Área táctil de 44x44px (h-11 w-11) */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            data-cursor-label={menuOpen ? "Cerrar" : "Menú"}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors lg:hidden ${
              lightSection
                ? "border-navy/15 text-navy-deep hover:border-navy/35"
                : "border-white/15 text-white hover:border-white/35"
            }`}
          >
            {/* Icono de líneas que se transforma en una X al abrir */}
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-full -translate-y-1/2 rounded-full bg-current transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Panel del menú móvil: se despliega bajo la barra. Hereda el tema claro/oscuro de la sección. */}
      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full px-5 pt-2 transition-all duration-300 ease-out lg:hidden ${
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <div
          className={`overflow-hidden rounded-3xl border p-2.5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
            lightSection ? "border-navy/10 bg-white/95" : "border-white/10 bg-navy-deep/95"
          }`}
        >
          <nav aria-label="Menú móvil" className="flex flex-col">
            {LINKS.map((link) => (
              <a
                key={link.target}
                href={link.target}
                onClick={(e) => go(e, link.target)}
                /* py-3.5 => >44px de alto: cómodo para el dedo */
                className={`rounded-2xl px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em] transition-colors ${
                  lightSection
                    ? "text-navy/75 hover:bg-navy/[0.04] hover:text-navy-deep"
                    : "text-white/75 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className={`my-2 h-px ${lightSection ? "bg-navy/10" : "bg-white/10"}`} />

          {/* CTAs dentro del menú: separación y altura amplias para el toque */}
          <div className="flex flex-col gap-2.5 p-1.5">
            <button
              type="button"
              onClick={() => openForm("info")}
              className={`w-full rounded-full border px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] transition-colors ${
                lightSection
                  ? "border-navy/20 text-navy-deep hover:border-turquoise hover:text-turquoise-deep"
                  : "border-white/20 text-white hover:border-turquoise hover:text-turquoise-bright"
              }`}
            >
              Solicitar información
            </button>
            <button
              type="button"
              onClick={() => openForm("reserva")}
              className="w-full rounded-full bg-[#F5A429] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-navy transition-colors hover:bg-amber"
            >
              Reserva tu plaza
            </button>
          </div>
        </div>
      </div>

      {/* Barra de progreso de lectura */}
      <div
        ref={progressRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-turquoise via-turquoise-bright to-amber"
      />

      {/* Difuminado de fondo — empieza en el top del header, se desvanece hacia abajo */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 z-[-1] h-52 bg-gradient-to-b from-navy to-transparent transition-opacity duration-500 ${
          lightSection ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 z-[-1] h-52 bg-gradient-to-b from-white to-transparent transition-opacity duration-500 ${
          lightSection ? "opacity-100" : "opacity-0"
        }`}
      />
    </header>
  );
}
