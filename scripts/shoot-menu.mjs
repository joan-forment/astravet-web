// Verificación rápida del menú hamburguesa móvil (cerrado/abierto, tema claro/oscuro).
import { chromium } from "playwright-core";

const PORT = process.argv[2] || "4173";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(6500); // preloader + intro

const toggleMenu = () =>
  page.evaluate(() => document.querySelector('[aria-controls="mobile-menu"]').click());

// 1) Header sobre el hero (tema oscuro), menú cerrado
await page.screenshot({ path: "shots/menu-mobile-closed-dark.png" });

// 2) Menú abierto sobre hero
await toggleMenu();
await page.waitForTimeout(500);
await page.screenshot({ path: "shots/menu-mobile-open-dark.png" });

// Cierra y navega a una sección clara para comprobar el tema claro del menú
await toggleMenu();
await page.waitForTimeout(400);
await page.evaluate(() => {
  const el = document.getElementById("por-que");
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 120);
});
await page.waitForTimeout(900);

// 3) Menú abierto sobre sección clara
await toggleMenu();
await page.waitForTimeout(500);
await page.screenshot({ path: "shots/menu-mobile-open-light.png" });

await browser.close();
console.log("done");
