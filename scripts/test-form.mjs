// QA: comprueba el flujo de los formularios desplegables (info y reserva).
import { chromium } from "playwright-core";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(6200); // preloader (~4.4s) + intro del hero

// Abre el formulario "Solicitar información" desde el hero
await page.getByRole("button", { name: "Solicitar información" }).first().click();
await page.waitForTimeout(700);
await page.screenshot({ path: "shots/qa-form-info.png" });

// Rellena los campos mínimos y envía → debe verse el mensaje de éxito
const dlg = page.locator('div[role="dialog"]');
await dlg.locator('input[name="nombre"]').fill("Ana");
await dlg.locator('input[name="apellidos"]').fill("García");
await dlg.locator('input[name="email"]').fill("ana@correo.com");
await dlg.locator('input[name="telefono"]').fill("600123123");
await dlg.locator('input[name="cp"]').fill("08001");
await dlg.locator('input[name="edad"]').fill("22");
await dlg.locator('select[name="origen"]').selectOption({ index: 1 });
await dlg.locator('select[name="idioma"]').selectOption({ index: 1 });
await dlg.getByText("Soy el interesado", { exact: true }).click();
await dlg.locator('input[name="acepto_privacidad"]').check({ force: true });
await dlg.getByRole("button", { name: "Enviar solicitud" }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: "shots/qa-form-success.png" });

const ok = await page
  .getByText("con la mayor brevedad posible", { exact: false })
  .count();
console.log("Mensaje de éxito (info):", ok > 0 ? "OK" : "FALLO");

await browser.close();
console.log("done");
