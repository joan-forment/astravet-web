// Herramienta de QA visual: recorre la página y captura cada sección.
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const OUT = "shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge", headless: true });

async function shoot(width, height, label) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(6200); // preloader (~4.4s) + intro del hero

  await page.screenshot({ path: `${OUT}/${label}-hero.png` });

  // Paradas verticales por cada sección de la landing
  const stops = await page.evaluate(() => {
    const top = (sel) => {
      const el = document.querySelector(sel);
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    };
    return [
      ["por-que", top("#por-que") + 80],
      ["por-que-calendario", top("#por-que") + 1100],
      ["quienes-somos", top("#quienes-somos") + 80],
      ["curso", top("#curso") + 80],
      ["empleabilidad", top("#empleabilidad") + 80],
      ["footer", document.body.scrollHeight],
    ];
  });

  for (const [name, y] of stops) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${OUT}/${label}-${name}.png` });
  }
  await page.close();
}

await shoot(1440, 900, "desktop");
await shoot(390, 844, "mobile");
await browser.close();
console.log("done");
