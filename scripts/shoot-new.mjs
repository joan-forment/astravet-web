// QA visual puntual de las secciones nuevas (temario, precios, reserva).
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const OUT = "shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge", headless: true });

async function shoot(width, height, label) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(6200);

  const stops = await page.evaluate(() => {
    const top = (sel) => {
      const el = document.querySelector(sel);
      return el ? el.getBoundingClientRect().top + window.scrollY : null;
    };
    return [
      ["temario", top("#temario")],
      ["precios", top("#precios")],
      ["reserva", top("#reserva-reunion")],
      ["footer-contacto", document.body.scrollHeight - (window.innerHeight * 2.2)],
    ].filter(([, y]) => y !== null);
  });

  for (const [name, y] of stops) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${OUT}/new-${label}-${name}.png` });
  }
  await page.close();
}

await shoot(1440, 900, "desktop");
await shoot(390, 844, "mobile");
await browser.close();
console.log("done");
