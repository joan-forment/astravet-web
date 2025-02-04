// QA visual de la entrada del hero 3D: captura fases de la animación.
// Preloader ~4.4s + entrada 3D ~3.8s + títulos ~1.2s.
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const OUT = "shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });

// Marcas de tiempo desde la carga (ms) → nombre del fotograma
const frames = [
  [5200, "entrance-1-pierce"], // fase 1: la punta de luz
  [6100, "entrance-2-fall"], // fase 2: caída y ensamblaje
  [7000, "entrance-3-flash"], // destello AV
  [7800, "entrance-4-titles"], // fase 3: títulos desenfoque→foco
  [9500, "entrance-5-final"], // estado de reposo
];

const t0 = Date.now();
for (const [at, name] of frames) {
  const wait = at - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

// Interactividad: cursor sobre el libro (derecha-centro) para el glow de proximidad
await page.mouse.move(1020, 430);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/entrance-6-proximity.png` });

await browser.close();
console.log("done");
