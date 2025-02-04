// QA transversal: jerarquía de encabezados, contraste de los textos de precio
// y datos estructurados de los packs.
//
//   npm run build && npx vite preview --port 4173
//   node scripts/qa-global.mjs
import { chromium } from "playwright-core";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const fallos = [];
const ok = (condicion, mensaje) => {
  console.log(`${condicion ? "✓" : "✗"} ${mensaje}`);
  if (!condicion) fallos.push(mensaje);
};

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(6200);

/* Recorre la página entera para que se revele todo el contenido animado. */
await page.evaluate(async () => {
  const alto = document.body.scrollHeight;
  for (let y = 0; y <= alto; y += window.innerHeight * 0.6) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 220));
  }
});
await page.waitForTimeout(1200);

/* ── Encabezados ── */
const encabezados = await page.evaluate(() =>
  [...document.querySelectorAll("main h1, main h2, main h3, main h4")].map((h) => ({
    nivel: Number(h.tagName[1]),
    texto: h.innerText.trim().slice(0, 40),
  }))
);

const h1 = encabezados.filter((h) => h.nivel === 1);
ok(h1.length === 1, `hay un único h1 en la página (${h1.length})`);

const saltos = [];
for (let i = 1; i < encabezados.length; i += 1) {
  if (encabezados[i].nivel > encabezados[i - 1].nivel + 1) {
    saltos.push(`${encabezados[i - 1].nivel}→${encabezados[i].nivel} en "${encabezados[i].texto}"`);
  }
}
ok(saltos.length === 0, `la jerarquía de encabezados no salta niveles${saltos.length ? `: ${saltos.join(", ")}` : ""}`);

/* ── Contraste de los textos de precio, incluido el gris atenuado ── */
const contrastes = await page.evaluate(() => {
  /* Los colores de Tailwind 4 llegan como oklab(...), que no se puede sumar a
     mano. Se pintan de verdad en un canvas y se leen los píxeles resultantes:
     así el propio navegador resuelve la mezcla de capas y transparencias. */
  const lienzo = document.createElement("canvas");
  lienzo.width = 1;
  lienzo.height = 1;
  const ctx = lienzo.getContext("2d", { willReadFrequently: true });

  const pintar = (capas) => {
    ctx.clearRect(0, 0, 1, 1);
    for (const capa of capas) {
      ctx.fillStyle = capa;
      ctx.fillRect(0, 0, 1, 1);
    }
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  };

  const canal = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const luminancia = ([r, g, b]) =>
    0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);

  /* Capas de fondo desde el elemento hacia arriba, de fuera hacia dentro. */
  const capasFondo = (el) => {
    const capas = [];
    let actual = el;
    while (actual && actual !== document.documentElement) {
      const bg = getComputedStyle(actual).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") capas.unshift(bg);
      actual = actual.parentElement;
    }
    return ["rgb(13, 27, 62)", ...capas];
  };

  const seccion = document.querySelector("#precios");
  const textos = [...seccion.querySelectorAll("p, span, li")].filter((el) =>
    /PVP al acabar|Promoción válida|Promoción sujeta|cuotas · Total|AstraVet podrá/i.test(
      el.innerText ?? ""
    )
  );

  return textos.map((el) => {
    const estilo = getComputedStyle(el);
    const fondo = pintar(capasFondo(el));
    const color = pintar([...capasFondo(el), estilo.color]);
    const l1 = luminancia(color);
    const l2 = luminancia(fondo);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return {
      texto: el.innerText.trim().slice(0, 32),
      tamano: parseFloat(estilo.fontSize),
      ratio: Math.round(ratio * 100) / 100,
    };
  });
});

const bajoContraste = contrastes.filter((c) => c.ratio < 4.5);
ok(
  contrastes.length > 0,
  `se han medido ${contrastes.length} textos de precio y aviso legal`
);
ok(
  bajoContraste.length === 0,
  `todos cumplen contraste AA 4.5:1${
    bajoContraste.length
      ? `: ${bajoContraste.map((c) => `"${c.texto}" ${c.ratio}:1`).join(", ")}`
      : ` (mínimo medido: ${Math.min(...contrastes.map((c) => c.ratio))}:1)`
  }`
);

const pequenos = contrastes.filter((c) => c.tamano < 12);
ok(
  pequenos.length === 0,
  `ningún texto legal baja de 12px${
    pequenos.length ? `: ${pequenos.map((c) => `"${c.texto}" ${c.tamano}px`).join(", ")}` : ""
  }`
);

/* ── Datos estructurados ── */
const schema = await page.evaluate(() =>
  [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) =>
    JSON.parse(s.textContent)
  )
);

const productos = schema
  .flatMap((s) => s["@graph"] ?? [s])
  .filter((n) => n["@type"] === "Product");
ok(productos.length === 3, `hay tres Product en los datos estructurados (${productos.length})`);
ok(
  productos.every((p) => p.offers?.priceCurrency === "EUR" && Number(p.offers.price) > 0),
  "cada Product lleva su Offer con precio en euros"
);
ok(
  productos.every((p) => p.offers?.priceValidUntil === "2026-10-30"),
  "las ofertas indican priceValidUntil 2026-10-30"
);
ok(
  schema.some((s) => s["@type"] === "Course"),
  "el curso está marcado como schema.org/Course"
);

await page.close();

/* ── Sin scroll horizontal en toda la página, a los cuatro anchos ── */
for (const [w, h] of [
  [360, 780],
  [768, 1024],
  [1024, 800],
  [1440, 900],
]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  await p.waitForTimeout(6200);
  const desborde = await p.evaluate(async () => {
    const alto = document.body.scrollHeight;
    let peor = 0;
    for (let y = 0; y <= alto; y += window.innerHeight * 0.8) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
      peor = Math.max(peor, document.documentElement.scrollWidth - window.innerWidth);
    }
    return peor;
  });
  ok(desborde <= 1, `sin scroll horizontal a ${w}px (desborde: ${desborde}px)`);
  await p.close();
}

await browser.close();
console.log(
  fallos.length === 0
    ? "\n✅ Accesibilidad, contraste y datos estructurados correctos."
    : `\n❌ ${fallos.length} criterio(s) sin cumplir:\n   - ${fallos.join("\n   - ")}`
);
process.exit(fallos.length === 0 ? 0 : 1);
