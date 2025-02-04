/*
 * SEO y GEO (buscadores con IA) de astravet.es. Se ejecuta solo después de
 * `vite build` (npm run build / npm run publicar). No hay que tocarlo: los
 * textos se editan en src/config/seo.js, temario.js y site.js.
 *
 * Qué hace sobre la carpeta dist/:
 *   1. Portada: título, descripción, datos estructurados (schema.org) y una
 *      versión en HTML del contenido dentro de #root, para buscadores y
 *      asistentes de IA que no ejecutan JavaScript. React la sustituye al
 *      cargar; con JavaScript activo no se llega a ver.
 *   2. Páginas de contenido en carpetas propias (/preguntas-frecuentes/, …),
 *      HTML estático puro: rápidas y legibles por cualquier robot.
 *   3. sitemap.xml, robots.txt y llms.txt.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { CONTACT } from "../src/config/site.js";
import {
  bloques,
  formatosImparticion,
  TOTAL_HORAS,
  TOTAL_TEMAS,
  introduccion,
  pasosDesarrollo,
} from "../src/config/temario.js";
import { ACADEMIA, CAMPUS_DEMO_URL, FAQ, PAGINAS, PORTADA, SITE_URL } from "../src/config/seo.js";

const DIST = resolve(import.meta.dirname, "..", "dist");
const HOY = new Date().toISOString().slice(0, 10);

/* ───────────────────────────── utilidades ───────────────────────────── */
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
// Los formatos de impartición vienen en MAYÚSCULAS: en HTML se escriben en frase normal.
const frase = (s) => {
  const t = s.toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const url = (slug) => `${SITE_URL}/${slug ? `${slug}/` : ""}`;
const ld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

const ORG_ID = `${SITE_URL}/#organization`;
const CURSO_ID = `${SITE_URL}/#curso-atv`;
const SALIDAS = [
  "Clínicas veterinarias",
  "Hospitales veterinarios",
  "Consultorios veterinarios",
  "Centros de investigación y de recuperación de animales",
  "Tiendas del sector",
];
const OFERTA = [
  ["Duración", "Aproximadamente 12 meses, a tu ritmo, con una dedicación recomendada de 8-10 horas semanales."],
  ["Temario", `${TOTAL_HORAS} horas (incluida la parte práctica) en 6 módulos y ${TOTAL_TEMAS} temas, adaptado al RD 705/2017 y al RD 489/2026.`],
  ["Teoría", "Curso teórico en 4 formatos, con examen al final de cada módulo."],
  ["Talleres", "Talleres prácticos presenciales y opcionales, en grupo reducido, para prepararte antes de las prácticas."],
  ["Prácticas", "Acceso a centros clínicos: te facilitamos la estancia de prácticas."],
  ["Empleo", "Bolsa de trabajo y contacto con centros veterinarios al terminar."],
];

/* ─────────────────────────── datos estructurados ─────────────────────────── */
const organizacion = {
  "@type": ["EducationalOrganization", "Organization"],
  "@id": ORG_ID,
  name: ACADEMIA.nombre,
  alternateName: [ACADEMIA.nombreLegal, "AstraVet Academia", "Astra Vet Academia de formación veterinaria"],
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-default.png` },
  image: `${SITE_URL}/photos/consulta-golden.jpg`,
  description: ACADEMIA.descripcion,
  slogan: ACADEMIA.lema,
  email: CONTACT.email,
  telephone: CONTACT.phoneE164,
  address: {
    "@type": "PostalAddress",
    addressLocality: ACADEMIA.ciudad,
    postalCode: ACADEMIA.codigoPostal,
    addressRegion: ACADEMIA.region,
    addressCountry: ACADEMIA.pais,
  },
  areaServed: { "@type": "Country", name: "España" },
  knowsAbout: [
    "Auxiliar Técnico Veterinario",
    "Formación veterinaria",
    "Asistencia en clínicas veterinarias",
    "Atención al cliente en centros veterinarios",
    "Laboratorio veterinario",
    "Quirófano veterinario",
    "Hospitalización de animales",
    "Diagnóstico por imagen veterinario",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    areaServed: "ES",
    availableLanguage: ["es"],
  },
};

const sitioWeb = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: ACADEMIA.nombre,
  inLanguage: "es-ES",
  publisher: { "@id": ORG_ID },
};

const curso = {
  "@type": "Course",
  "@id": CURSO_ID,
  name: "Curso de Auxiliar Técnico Veterinario (ATV) Online",
  alternateName: ["Curso de ATV online", "Curso de Auxiliar Veterinario online", "Curso de Auxiliar de Clínica Veterinaria"],
  description:
    "Curso online de Auxiliar Técnico Veterinario (ATV) creado por veterinarios. Temario de 6 módulos y 660 horas adaptado al RD 705/2017 y al RD 489/2026, campus virtual, seminarios en directo, tutorías individuales, talleres presenciales opcionales y prácticas en centros clínicos.",
  url: `${SITE_URL}/`,
  inLanguage: "es-ES",
  provider: { "@id": ORG_ID },
  educationalCredentialAwarded: "Diploma AstraVet de Auxiliar Técnico Veterinario",
  occupationalCredentialAwarded: "Auxiliar Técnico Veterinario (ATV)",
  teaches: bloques.map((b) => b.titulo),
  syllabusSections: bloques.map((b) => ({
    "@type": "Syllabus",
    name: `Módulo ${b.numero}: ${b.titulo}`,
    description: b.temas.map((t) => `Tema ${t.numero}. ${t.titulo}`).join(". "),
  })),
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: ["Online", "Blended"],
    location: "Online",
    courseWorkload: `PT${TOTAL_HORAS}H`,
    inLanguage: "es-ES",
    courseSchedule: { "@type": "Schedule", repeatFrequency: "Weekly", repeatCount: 52, duration: "PT10H" },
  },
};

const migas = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: [["Inicio", url("")], ...items].map(([name, item], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item,
  })),
});

const faqSchema = {
  "@type": "FAQPage",
  "@id": `${url(PAGINAS.faq.slug)}#faq`,
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.p,
    acceptedAnswer: { "@type": "Answer", text: f.r },
  })),
};

const grafo = (...nodos) => ld({ "@context": "https://schema.org", "@graph": nodos });

/* ───────────────────────────── fragmentos HTML ───────────────────────────── */
const NAV = [
  ["Curso de ATV", "/"],
  ...Object.values(PAGINAS).map((p) => [p.nav, `/${p.slug}/`]),
  ["Demo del campus", CAMPUS_DEMO_URL],
];

const htmlTemario = (nivel = 3) =>
  bloques
    .map(
      (b) => `
      <section class="bloque">
        <h${nivel}>Módulo ${b.numero}. ${esc(b.titulo)}</h${nivel}>
        ${b.temas.map((t) => `<p class="tema"><strong>Tema ${t.numero}. ${esc(t.titulo)}</strong></p><ul>${t.subtemas.map((st) => `<li>${esc(st)}</li>`).join("")}</ul>`).join("")}
      </section>`
    )
    .join("");

const htmlIntroTemario = introduccion
  .map((b) =>
    b.tipo === "lista"
      ? `<ul>${b.elementos.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>`
      : `<p>${esc(b.texto)}</p>`
  )
  .join("\n");

const htmlFormatos = `<ul>${formatosImparticion
  .map((f) => `<li><strong>${esc(frase(f.titulo))}</strong> · ${esc(f.modalidad)}${f.detalles?.length ? ` (${esc(f.detalles.join(", "))})` : ""}</li>`)
  .join("")}</ul>`;

const htmlPasos = `<ol>${pasosDesarrollo.map((p) => `<li>${esc(p)}</li>`).join("")}</ol>`;

const htmlFaq = (lista, nivel = 2) =>
  lista.map((f) => `<h${nivel}>${esc(f.p)}</h${nivel}>\n<p>${esc(f.r)}</p>`).join("\n");

const htmlContacto = `
  <div class="card">
    <p><strong>¿Hablamos?</strong> Pide información sin compromiso o reserva tu plaza para la próxima convocatoria.</p>
    <p>WhatsApp y teléfono: <a href="https://wa.me/${CONTACT.whatsapp}">${esc(CONTACT.phoneDisplay)}</a> · Correo: <a href="mailto:${CONTACT.email}">${esc(CONTACT.email)}</a></p>
    <p><a class="btn" href="/#contacto">Solicitar información</a> <a class="btn btn-ghost" href="${CAMPUS_DEMO_URL}">Probar la demo del campus</a></p>
  </div>`;

/* ─────────────────────────── plantilla de página ─────────────────────────── */
const CSS = readFileSync(resolve(import.meta.dirname, "seo-pagina.css"), "utf8");

function pagina({ slug, titulo, descripcion, h1, eyebrow, cuerpo, schema, ogImage = "/photos/consulta-golden.jpg" }) {
  const canonical = url(slug);
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(titulo)}</title>
    <meta name="description" content="${esc(descripcion)}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="es-ES" href="${canonical}" />
    <link rel="alternate" hreflang="x-default" href="${canonical}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta name="theme-color" content="#070f26" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="AstraVet" />
    <meta property="og:locale" content="es_ES" />
    <meta property="og:title" content="${esc(titulo)}" />
    <meta property="og:description" content="${esc(descripcion)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE_URL}${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="apple-touch-icon" href="/favicon-180.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <style>${CSS}</style>
    ${schema}
  </head>
  <body>
    <div class="glow"></div>
    <header class="topbar">
      <a href="/" aria-label="AstraVet, curso de Auxiliar Técnico Veterinario online"><img src="/logo-white.png" alt="AstraVet" width="150" height="30" /></a>
      <a class="btn btn-small" href="/#contacto">Pedir información</a>
    </header>
    <nav class="subnav" aria-label="Secciones">
      ${NAV.map(([t, h]) => `<a href="${h}"${h === `/${slug}/` ? ' aria-current="page"' : ""}>${esc(t)}</a>`).join("\n      ")}
    </nav>
    <main>
      <nav class="breadcrumb" aria-label="Ruta"><a href="/">Inicio</a> <span aria-hidden="true">›</span> <span>${esc(h1)}</span></nav>
      <p class="eyebrow">${esc(eyebrow)}</p>
      <h1>${esc(h1)}</h1>
      <p class="updated">Actualizado el ${new Date(HOY).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })} · Escrito por el equipo de veterinarios de AstraVet</p>
      <div class="divider"></div>
      ${cuerpo}
      ${htmlContacto}
    </main>
    <footer>
      <span>© ${HOY.slice(0, 4)} AstraVet · Academia de formación veterinaria · ${esc(ACADEMIA.ciudad)}, España</span>
      <span><a href="/aviso-legal.html">Aviso legal</a> · <a href="/politica-de-privacidad.html">Privacidad</a></span>
    </footer>
  </body>
</html>
`;
}

/* ───────────────────────────────── páginas ───────────────────────────────── */
const seccionesHtml = (secciones) =>
  secciones
    .map(
      (s) => `
      <h2>${esc(s.h2)}</h2>
      ${(s.parrafos ?? []).map((p) => `<p>${esc(p)}</p>`).join("\n")}
      ${s.lista ? `<ul>${s.lista.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>` : ""}
      ${s.cta ? `<p><a class="btn" href="${s.cta.href}">${esc(s.cta.texto)}</a></p>` : ""}`
    )
    .join("\n");

const pageSchema = (p, extra = []) =>
  grafo(
    organizacion,
    {
      "@type": "WebPage",
      "@id": `${url(p.slug)}#webpage`,
      url: url(p.slug),
      name: p.titulo,
      description: p.descripcion,
      inLanguage: "es-ES",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": CURSO_ID },
      dateModified: HOY,
    },
    migas([[p.h1, url(p.slug)]]),
    ...extra
  );

const paginas = [
  {
    ...PAGINAS.temario,
    eyebrow: "Curso de Auxiliar Técnico Veterinario",
    cuerpo: `
      <p class="lead">${esc(PAGINAS.temario.intro)}</p>
      <h2>Los 6 módulos del temario (${TOTAL_HORAS} horas)</h2>
      ${htmlTemario(3)}
      <h2>Cómo se imparte el temario</h2>
      ${htmlIntroTemario}
      <h2>¿En qué formato recibes la formación?</h2>
      ${htmlFormatos}
      <h2>¿Cómo se desarrolla el curso?</h2>
      ${htmlPasos}
      <p>¿Quieres ver cómo se estudia este temario? <a href="${CAMPUS_DEMO_URL}">Prueba gratis la demo del campus virtual</a> o consulta las <a href="/${PAGINAS.faq.slug}/">preguntas frecuentes</a>.</p>`,
    schema: pageSchema(PAGINAS.temario, [curso]),
  },
  {
    ...PAGINAS.queEs,
    eyebrow: "Guía de la profesión",
    cuerpo: `
      <p class="lead">${esc(PAGINAS.queEs.intro)}</p>
      ${seccionesHtml(PAGINAS.queEs.secciones)}
      <p>Consulta el <a href="/${PAGINAS.temario.slug}/">temario completo del curso de ATV</a> o las <a href="/${PAGINAS.faq.slug}/">preguntas frecuentes</a>.</p>`,
    schema: pageSchema(PAGINAS.queEs, [
      {
        "@type": "Article",
        "@id": `${url(PAGINAS.queEs.slug)}#article`,
        headline: PAGINAS.queEs.h1,
        description: PAGINAS.queEs.descripcion,
        inLanguage: "es-ES",
        author: { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
        dateModified: HOY,
        mainEntityOfPage: { "@id": `${url(PAGINAS.queEs.slug)}#webpage` },
        image: `${SITE_URL}/photos/exploracion-beagle.jpg`,
      },
    ]),
    ogImage: "/photos/exploracion-beagle.jpg",
  },
  {
    ...PAGINAS.faq,
    eyebrow: "Resolvemos tus dudas",
    cuerpo: `
      <p class="lead">${esc(PAGINAS.faq.intro)}</p>
      ${htmlFaq(FAQ, 2)}`,
    schema: pageSchema(PAGINAS.faq, [faqSchema]),
  },
  {
    ...PAGINAS.campus,
    eyebrow: "Así se estudia en AstraVet",
    cuerpo: `
      <p class="lead">${esc(PAGINAS.campus.intro)}</p>
      ${seccionesHtml(PAGINAS.campus.secciones)}`,
    schema: pageSchema(PAGINAS.campus),
  },
];

for (const p of paginas) {
  mkdirSync(resolve(DIST, p.slug), { recursive: true });
  writeFileSync(resolve(DIST, p.slug, "index.html"), pagina(p));
}

/* ─────────────────────────────── portada ─────────────────────────────── */
const prerender = `
<div id="prerender">
  <header>
    <a href="/"><img src="/logo-default.png" alt="AstraVet" width="150" height="30" /></a>
    <nav aria-label="Secciones">${NAV.map(([t, h]) => `<a href="${h}">${esc(t)}</a>`).join(" · ")}</nav>
  </header>
  <main>
    <p>Academia de formación veterinaria</p>
    <h1>Curso de Auxiliar Técnico Veterinario (ATV) online</h1>
    <p>${esc(ACADEMIA.lema)} Una nueva manera de estudiar. ${esc(ACADEMIA.descripcion)}</p>
    <h2>Qué ofrecemos</h2>
    <ul>${OFERTA.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join("")}</ul>
    <h2>Quiénes somos</h2>
    <p>AstraVet se construye a partir de un equipo de veterinarios con años de experiencia clínica que buscan optimizar el proceso formativo y ayudar a la siguiente generación de profesionales a construir su futuro en el sector veterinario. Cuidamos de la salud animal y te enseñamos a cuidar.</p>
    <h2>Temario del curso de Auxiliar Técnico Veterinario</h2>
    ${htmlIntroTemario}
    ${htmlTemario(3)}
    <h2>¿En qué formato recibes la formación?</h2>
    ${htmlFormatos}
    <h2>¿Cómo se desarrolla el curso?</h2>
    ${htmlPasos}
    <h2>¿Dónde podrás trabajar como ATV?</h2>
    <ul>${SALIDAS.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    <h2>Preguntas frecuentes</h2>
    ${htmlFaq(FAQ.slice(0, 6), 3)}
    <p><a href="/${PAGINAS.faq.slug}/">Ver todas las preguntas frecuentes</a></p>
    <h2>Contacto</h2>
    <p>Teléfono y WhatsApp: ${esc(CONTACT.phoneDisplay)} · Correo: <a href="mailto:${CONTACT.email}">${esc(CONTACT.email)}</a></p>
    <p>Horario: ${CONTACT.hours.map(([d, h]) => `${esc(d)}: ${esc(h)}`).join(" · ")}</p>
  </main>
</div>`;

const indexPath = resolve(DIST, "index.html");
let index = readFileSync(indexPath, "utf8");
index = index
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(PORTADA.titulo)}</title>`)
  .replace(/(<meta\s+name="description"\s+content=")[^"]*/, `$1${esc(PORTADA.descripcion)}`)
  // FAQPage solo en /preguntas-frecuentes/: Google pide no repetir las mismas preguntas en varias páginas.
  .replace("</head>", `    ${grafo(organizacion, sitioWeb, curso)}\n  </head>`)
  .replace('<div id="root"></div>', `<div id="root">${prerender}</div>`);
if (!index.includes('id="prerender"')) throw new Error("seo.mjs: no se encontró <div id=\"root\"></div> en dist/index.html");
writeFileSync(indexPath, index);

/* ─────────────────────── sitemap, robots y llms.txt ─────────────────────── */
const urls = [
  [url(""), "1.0"],
  ...paginas.map((p) => [url(p.slug), "0.8"]),
  [CAMPUS_DEMO_URL, "0.7"], // publicada por el proyecto del campus (npm run deploy)
  [`${SITE_URL}/aviso-legal.html`, "0.2"],
  [`${SITE_URL}/politica-de-privacidad.html`, "0.2"],
];
writeFileSync(
  resolve(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, prio]) => `  <url><loc>${loc}</loc><lastmod>${HOY}</lastmod><priority>${prio}</priority></url>`).join("\n")}
</urlset>
`
);

writeFileSync(
  resolve(DIST, "robots.txt"),
  `# Todos los buscadores y asistentes de IA son bienvenidos.
User-agent: *
Allow: /

# Asistentes de IA (citan a AstraVet cuando alguien pregunta por cursos de ATV)
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: PerplexityBot
User-agent: Google-Extended
User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
);

writeFileSync(
  resolve(DIST, "llms.txt"),
  `# AstraVet

> ${ACADEMIA.descripcion}

AstraVet (${SITE_URL}) es una academia de formación veterinaria con sede en ${ACADEMIA.ciudad} (España). Su curso de Auxiliar Técnico Veterinario (ATV) es online, dura aproximadamente 12 meses (8-10 horas de estudio a la semana) y está creado por veterinarios con experiencia clínica.

## El curso de Auxiliar Técnico Veterinario

${OFERTA.map(([k, v]) => `- ${k}: ${v}`).join("\n")}

## Temario (6 módulos, ${TOTAL_HORAS} horas incluida la parte práctica; adaptado al RD 705/2017 y al RD 489/2026)

${bloques.map((b) => `### Módulo ${b.numero}. ${b.titulo}\n${b.temas.map((t) => `- Tema ${t.numero}. ${t.titulo}: ${t.subtemas.join("; ")}`).join("\n")}`).join("\n\n")}

## Preguntas frecuentes

${FAQ.map((f) => `### ${f.p}\n${f.r}`).join("\n\n")}

## Páginas

- [Curso de Auxiliar Técnico Veterinario online](${url("")})
${paginas.map((p) => `- [${p.h1}](${url(p.slug)}): ${p.descripcion}`).join("\n")}
- [Demo gratuita del campus virtual](${CAMPUS_DEMO_URL})

## Contacto

- Correo: ${CONTACT.email}
- Teléfono y WhatsApp: ${CONTACT.phoneDisplay}
`
);

console.log(`✓ SEO: portada + ${paginas.length} páginas, sitemap.xml (${urls.length} URLs), robots.txt y llms.txt`);
