/*
 * Avisa a Bing (y con él a Edge, DuckDuckGo, Yandex y la búsqueda de ChatGPT) de
 * que las páginas de la web han cambiado, para que las vuelvan a leer pronto.
 * Protocolo IndexNow: https://www.indexnow.org
 *
 * Se ejecuta DESPUÉS de subir la web:  npm run avisar-buscadores
 *
 * La clave es pública por diseño: el archivo public/<clave>.txt demuestra que
 * la web es nuestra. Si se cambia, hay que cambiar también ese archivo.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const KEY = "8da2f8267c2ca6b8075185187ef30238";
const HOST = "www.astravet.es";
const sitemap = readFileSync(resolve(import.meta.dirname, "..", "dist", "sitemap.xml"), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => new URL(u).host === HOST);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
if (res.status === 200 || res.status === 202) {
  console.log(`✓ IndexNow: aviso enviado para ${urlList.length} páginas (HTTP ${res.status})`);
} else {
  console.error(`✗ IndexNow respondió HTTP ${res.status}: ${await res.text()}`);
  process.exit(1);
}
