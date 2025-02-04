import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";

import CustomCursor from "./components/CustomCursor.jsx";
import Preloader from "./components/Preloader.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import WhyAstra from "./components/WhyAstra.jsx";
import Manifesto from "./components/Manifesto.jsx";
import Offer from "./components/Offer.jsx";
import Syllabus from "./components/Syllabus.jsx";
import Pricing from "./components/Pricing.jsx";
import Booking from "./components/Booking.jsx";
import Employability from "./components/Employability.jsx";
import MotivationalBanner from "./components/MotivationalBanner.jsx";
import Footer from "./components/Footer.jsx";
import FloatingContact from "./components/FloatingContact.jsx";
import { FormModalProvider } from "./forms/FormModal.jsx";
import usePrefersReducedMotion from "./hooks/usePrefersReducedMotion.js";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin);
gsap.ticker.lagSmoothing(0);

/* Mantiene ScrollTrigger sincronizado con el scroll suave de Lenis */
function ScrollSync() {
  useLenis(ScrollTrigger.update);
  return null;
}

/* Congela el scroll de Lenis mientras el preloader está en pantalla */
function IntroScrollLock({ locked }) {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, [lenis, locked]);

  /* Enlaces desde fuera con ancla (p. ej. la demo del campus →
     astravet.es/#precios): el navegador no puede ir a la sección mientras el
     preloader bloquea el scroll, así que se va al terminar la intro. */
  useEffect(() => {
    if (!lenis || locked || !window.location.hash) return;
    const destino = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (!destino) return;
    const id = window.setTimeout(() => lenis.scrollTo(destino, { offset: -80, duration: 1.4 }), 150);
    return () => window.clearTimeout(id);
  }, [lenis, locked]);
  return null;
}

/* Grano sutil sobre toda la experiencia */
function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

/*
 * Versión sin pago: esta web no lleva sección de Precios, ni carrito, ni
 * checkout. El contacto se hace por los formularios de "Solicitar info" y
 * "Reserva tu plaza", y por la reserva de reunión informativa.
 */
export default function App() {
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const onReveal = useCallback(() => setRevealed(true), []);

  // Las imágenes y fuentes cambian las medidas: recalcular los triggers
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready?.then(refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <ReactLenis
      root
      options={{ lerp: 0.09, smoothWheel: !reduced, wheelMultiplier: 1 }}
    >
      <ScrollSync />
      <IntroScrollLock locked={!revealed} />
      <Preloader reduced={reduced} onReveal={onReveal} />
      <CustomCursor reduced={reduced} />
      <NoiseOverlay />
      <FormModalProvider reduced={reduced}>
        <>
          <Header reduced={reduced} start={revealed} />
          <main id="hero">
            <Hero reduced={reduced} start={revealed} />
            <WhyAstra reduced={reduced} />
            <Manifesto reduced={reduced} />
            <Offer reduced={reduced} />
            <Syllabus reduced={reduced} />
            <Pricing reduced={reduced} />
            <Booking />
            <Employability reduced={reduced} />
            <MotivationalBanner reduced={reduced} />
            <Footer reduced={reduced} />
          </main>
          <FloatingContact />
        </>
      </FormModalProvider>
    </ReactLenis>
  );
}
