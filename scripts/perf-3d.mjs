// Mide el coste real de la escena 3D en un navegador.
//
// Cuenta las llamadas de dibujado a la GPU y los fotogramas por segundo en tres
// situaciones: durante la intro, con el hero a la vista y con el hero fuera de
// pantalla (donde la escena no debería estar haciendo nada).
//
//   npm run build && npx vite preview --port 4173
//   node scripts/perf-3d.mjs
import { chromium } from "playwright-core";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

/* Instrumenta WebGL antes de que cargue nada de la página. */
await page.addInitScript(() => {
  window.__medida = { draws: 0, frames: 0 };
  for (const ctx of [WebGLRenderingContext, WebGL2RenderingContext]) {
    if (!ctx) continue;
    for (const metodo of ["drawArrays", "drawElements", "drawArraysInstanced", "drawElementsInstanced"]) {
      const original = ctx.prototype[metodo];
      if (!original) continue;
      ctx.prototype[metodo] = function (...args) {
        window.__medida.draws += 1;
        return original.apply(this, args);
      };
    }
  }
  const contar = () => {
    window.__medida.frames += 1;
    requestAnimationFrame(contar);
  };
  requestAnimationFrame(contar);
});

const muestra = async (etiqueta, ms = 3000) => {
  const inicio = await page.evaluate(() => ({ ...window.__medida, t: performance.now() }));
  await page.waitForTimeout(ms);
  const fin = await page.evaluate(() => ({ ...window.__medida, t: performance.now() }));
  const segundos = (fin.t - inicio.t) / 1000;
  const draws = fin.draws - inicio.draws;
  const frames = fin.frames - inicio.frames;
  console.log(
    `${etiqueta.padEnd(34)} ${(draws / segundos).toFixed(0).padStart(6)} dibujados/s   ` +
      `${(frames / segundos).toFixed(0).padStart(3)} fps   ` +
      `${(draws / Math.max(frames, 1)).toFixed(1).padStart(5)} dibujados/fotograma`
  );
  return { draws, frames, segundos };
};

const t0 = Date.now();
await page.goto("http://localhost:4173/", { waitUntil: "domcontentloaded" });
await page.waitForSelector("canvas", { timeout: 20000 });
console.log(`\nEl canvas 3D aparece a los ${Date.now() - t0} ms`);

await page.waitForTimeout(1000);
await muestra("Durante la intro");

await page.waitForTimeout(4000);
await muestra("Hero visible, en reposo");

/* Fuera de pantalla: la escena no debería consumir nada */
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1500);
const lejos = await muestra("Hero fuera de pantalla");

/* Peso de los archivos */
const recursos = await page.evaluate(() =>
  performance
    .getEntriesByType("resource")
    .filter((r) => /\.js$/.test(r.name))
    .map((r) => ({
      archivo: r.name.split("/").pop(),
      kb: Math.round((r.encodedBodySize || r.transferSize) / 1024),
    }))
    .sort((a, b) => b.kb - a.kb)
);
console.log("\nJavaScript descargado:");
for (const r of recursos) console.log(`   ${String(r.kb).padStart(5)} kB  ${r.archivo}`);
console.log(`   ${String(recursos.reduce((s, r) => s + r.kb, 0)).padStart(5)} kB  TOTAL`);

const pintado = await page.evaluate(() => {
  const fcp = performance.getEntriesByName("first-contentful-paint")[0];
  const nav = performance.getEntriesByType("navigation")[0];
  return {
    fcp: fcp ? Math.round(fcp.startTime) : null,
    interactivo: nav ? Math.round(nav.domInteractive) : null,
  };
});
console.log(
  `
Primer pintado: ${pintado.fcp} ms   ·   DOM interactivo: ${pintado.interactivo} ms`
);

console.log(
  lejos.draws > 100
    ? "\n⚠️  La escena sigue dibujando con el hero fuera de pantalla: trabajo tirado a la basura."
    : "\n✅ La escena se detiene cuando el hero no se ve."
);

await browser.close();
