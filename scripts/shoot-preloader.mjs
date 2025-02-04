// QA visual del preloader: captura fotogramas clave de la animación de entrada.
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const OUT = "shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge", headless: true });

async function shoot(width, height, label) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:4173/", { waitUntil: "domcontentloaded" });

  // Momentos: logo entrando, carga a medias, 100 alcanzado, cortina subiendo
  const frames = [
    ["01-logo", 800],
    ["02-carga", 1700],
    ["03-cien", 2450],
    ["04-cortina", 3550],
    ["05-revelado", 4600],
  ];
  let elapsed = 0;
  for (const [name, t] of frames) {
    await page.waitForTimeout(t - elapsed);
    elapsed = t;
    await page.screenshot({ path: `${OUT}/preloader-${label}-${name}.png` });
  }
  await page.close();
}

await shoot(1440, 900, "desktop");
await shoot(390, 844, "mobile");
await browser.close();
console.log("done");
