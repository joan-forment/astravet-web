// QA de la sección "Estructura del temario".
// Comprueba en un navegador real los criterios de aceptación del cliente y
// deja capturas en shots/temario-*.png.
//
//   npm run build && npx vite preview --port 4173
//   node scripts/qa-temario.mjs
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const OUT = "shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge", headless: true });
const fallos = [];
const ok = (condicion, mensaje) => {
  console.log(`${condicion ? "✓" : "✗"} ${mensaje}`);
  if (!condicion) fallos.push(`${mensaje}`);
};

async function revisar(width, height, etiqueta) {
  console.log(`\n── ${etiqueta} (${width}×${height}) ──`);
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(6200);

  /* La sección es larga: hay que recorrerla entera para que se disparen las
     animaciones de entrada, o los elementos siguen ocultos y no se pueden
     medir ni enfocar. */
  for (const sel of [
    "#temario",
    ".temario-desarrollo",
    ".temario-fila",
    "#temario-panel",
  ]) {
    await page.evaluate((s) => {
      const el = document.querySelector(s);
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 120);
    }, sel);
    await page.waitForTimeout(1200);
  }
  await page.evaluate(() => {
    const el = document.querySelector(".temario-fila");
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 140);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/temario-${etiqueta}.png` });

  const base = await page.evaluate(() => {
    const seccion = document.querySelector("#temario");
    const bloques = [...seccion.querySelectorAll(".temario-bloque")];
    const naranjas = [...seccion.querySelectorAll(".temario-formato")];
    const texto = seccion.innerText;

    const posicion = (sel) => {
      const el = seccion.querySelector(sel);
      return el ? el.getBoundingClientRect().top + window.scrollY : null;
    };

    return {
      totalBloques: bloques.length,
      sonBotones: bloques.every((b) => b.tagName === "BUTTON"),
      horasVisibles: bloques.filter((b) => /[0-9]+ h/i.test(b.innerText)).length,
      instruccion: /Haz clic sobre cada bloque para consultar los temas/i.test(texto),
      // El bloque "¿Cómo se desarrolla el curso?" tiene que ir ANTES de los recuadros
      yDesarrollo: posicion(".temario-desarrollo"),
      yFila: posicion(".temario-fila"),
      pasos: seccion.querySelectorAll(".temario-paso").length,
      exclamacionFinal: /ATV AstraVet!/.test(texto),
      naranjasTotal: naranjas.length,
      naranjasClicables: naranjas.filter(
        (a) =>
          a.tagName === "BUTTON" ||
          a.querySelector("button, a") ||
          a.getAttribute("role") === "button"
      ).length,
      enDirecto: naranjas
        .filter((a) => a.querySelector(".animate-rec-pulse-ink"))
        .map((a) => a.querySelector("h4")?.innerText.trim()),
      panelOculto: seccion.querySelector("#temario-panel")?.hidden,
      sumaHoras: /660/.test(texto),
      desborde: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });

  ok(base.totalBloques === 6, "hay seis bloques formativos");
  ok(base.sonBotones, "los bloques son <button> reales, no divs");
  ok(base.horasVisibles === 6, `las horas se ven dentro del recuadro sin clicar (${base.horasVisibles}/6)`);
  ok(base.instruccion, 'aparece "Haz clic sobre cada bloque…"');
  ok(
    base.yDesarrollo !== null && base.yDesarrollo < base.yFila,
    '"¿Cómo se desarrolla el curso?" va antes del esquema de recuadros'
  );
  ok(base.pasos === 8, "la línea de progreso tiene los 8 pasos");
  ok(base.exclamacionFinal, "el último paso conserva el signo de exclamación");
  ok(base.naranjasTotal === 5, `hay 5 recuadros de impartición (${base.naranjasTotal})`);
  ok(base.naranjasClicables === 0, "los recuadros naranjas no son clicables");
  ok(
    base.enDirecto.length === 3,
    `tres recuadros llevan distintivo de directo (${base.enDirecto.join(", ")})`
  );
  ok(base.panelOculto === true, "el panel de temas empieza cerrado");
  ok(!base.sumaHoras, "no se muestra el total de 660 h");
  ok(!base.desborde, "no hay scroll horizontal");

  /* Interacción: abrir un bloque con el teclado y comprobar el panel */
  const primerBloque = await page.$(".temario-bloque");
  await primerBloque.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);

  const abierto = await page.evaluate(() => {
    const seccion = document.querySelector("#temario");
    const panel = seccion.querySelector("#temario-panel");
    const boton = seccion.querySelector(".temario-bloque");
    const flecha = panel.querySelector("span[aria-hidden]");
    return {
      visible: !panel.hidden,
      expandido: boton.getAttribute("aria-expanded") === "true",
      controla: boton.getAttribute("aria-controls") === "temario-panel",
      temas: panel.querySelectorAll("li").length,
      // La flecha del panel debe caer bajo el bloque que se ha clicado
      flechaCentrada: flecha
        ? Math.abs(
            flecha.getBoundingClientRect().left +
              flecha.getBoundingClientRect().width / 2 -
              (boton.getBoundingClientRect().left +
                boton.getBoundingClientRect().width / 2)
          ) < 4
        : false,
    };
  });

  ok(abierto.visible, "al pulsar Intro se abre el panel de temas");
  ok(abierto.expandido && abierto.controla, "aria-expanded y aria-controls correctos");
  ok(abierto.temas === 3, `el primer bloque muestra sus 3 temas (${abierto.temas})`);
  ok(abierto.flechaCentrada, "la flecha del panel apunta al bloque clicado");

  await page.screenshot({ path: `${OUT}/temario-${etiqueta}-abierto.png` });

  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const cerrado = await page.evaluate(() => ({
    oculto: document.querySelector("#temario-panel").hidden,
    foco: document.activeElement?.classList.contains("temario-bloque"),
  }));
  ok(cerrado.oculto, "Escape cierra el panel");
  ok(cerrado.foco, "al cerrar, el foco vuelve al bloque");

  await page.close();
}

await revisar(360, 780, "360");
await revisar(768, 1024, "768");
await revisar(1024, 800, "1024");
await revisar(1440, 900, "1440");

/* El pulso del punto de grabación debe pararse si el usuario pide menos
   animación. */
const pagina = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await pagina.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await pagina.waitForTimeout(6200);
const sinAnimacion = await pagina.evaluate(() => {
  const punto = document.querySelector("#temario .animate-rec-pulse-ink");
  return punto ? getComputedStyle(punto).animationName : "no-encontrado";
});
console.log("\n── prefers-reduced-motion ──");
ok(sinAnimacion === "none", `el punto de grabación no se anima (${sinAnimacion})`);
await pagina.close();

await browser.close();
console.log(
  fallos.length === 0
    ? "\n✅ Todos los criterios de la sección de temario se cumplen."
    : `\n❌ ${fallos.length} criterio(s) sin cumplir:\n   - ${fallos.join("\n   - ")}`
);
process.exit(fallos.length === 0 ? 0 : 1);
