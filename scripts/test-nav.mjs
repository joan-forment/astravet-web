// QA: los enlaces del header fijo deben navegar con scroll suave.
import { chromium } from "playwright-core";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(6200); // preloader (~4.4s) + intro del hero

await page.click("header >> text=El curso");
await page.waitForTimeout(2200);
await page.screenshot({ path: "shots/qa-nav-curso.png" });

await page.click("header >> text=Empleo");
await page.waitForTimeout(2200);
await page.screenshot({ path: "shots/qa-nav-empleabilidad.png" });

await browser.close();
console.log("done");
