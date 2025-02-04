# AstraVet · web (versión sin pago)

Web de AstraVet, academia de formación de Auxiliar Técnico Veterinario (ATV).

**Esta carpeta es la web sin la parte de cobro.** No lleva sección de Precios,
ni carrito, ni checkout, ni pasarela de pago. Es una carpeta independiente: se
puede compilar y subir tal cual, sin depender del otro proyecto.

El contacto con los alumnos se hace por tres vías, que sí funcionan:

- el formulario **Solicitar info**,
- el formulario **Reserva tu plaza**,
- la **reserva de reunión informativa** (calendario).

> La versión **con** precios y carrito sigue viviendo en la carpeta
> `web astravet`. Esta es una copia aparte: un cambio hecho aquí **no** llega
> a la otra, ni al revés.

## Comandos

| Comando | Para qué sirve |
|---|---|
| `npm install` | Solo la primera vez: descarga lo que la web necesita. |
| `npm run dev` | Abre la web en tu ordenador mientras trabajas. |
| `npm run build` | Genera la versión publicable en la carpeta `dist/`. |
| `npm run publicar` | Genera la web **y** prepara el ZIP para subir a Hostinger. |
| `npm run preview` | Muestra el resultado de `build` como se verá publicado. |
| `npm run avisar-buscadores` | Después de subir la web: avisa a Bing/Edge (IndexNow) de que las páginas han cambiado. |

---

# Cómo publicar la web en Hostinger

**Esta sección está escrita para cualquier persona del equipo.**

Son dos partes: una en tu ordenador y otra en la web de Hostinger. La primera
vez te llevará unos diez minutos; a partir de ahí, dos.

## Parte 1 · En tu ordenador (un solo comando)

Abre una terminal en esta carpeta y escribe:

```bash
npm run publicar
```

Cuando termine, tendrás un archivo nuevo en la carpeta del proyecto:

```
astravet-web.zip
```

Ese archivo es la web entera, lista para subir. **Es lo único que necesitas.**

## Parte 2 · En Hostinger

1. Entra en **hpanel.hostinger.com** con tu cuenta.
2. En **Webs** (o *Sitios web*), busca `astravet.es` y pulsa **Administrar**.
3. En el menú de la izquierda: **Archivos → Administrador de archivos**.
4. Haz doble clic en la carpeta **`public_html`**. Aquí dentro es donde vive la
   web.
5. **No borres nada de `public_html`.** Al extraer el ZIP, los archivos nuevos
   sustituyen a los antiguos.
   🚨 **La carpeta `campus` es el campus virtual (campus.astravet.es)**, con
   su propia web. Si la borras, el campus deja de funcionar para todos los
   alumnos. No la toques nunca desde aquí: el campus se publica desde su
   propio proyecto.
   🚨 **La carpeta `demo` es la demo del campus (astravet.es/demo/)**. Tampoco
   la borres: se publica junto con el campus, desde su proyecto.
6. Pulsa **Subir archivos** (la flecha hacia arriba, arriba a la derecha) y
   elige el `astravet-web.zip` que has generado en la Parte 1. Espera a que
   llegue al 100 %.
7. Haz **clic derecho sobre el ZIP → Extraer** y confirma. Los archivos se
   descomprimen directamente en `public_html`, que es justo donde tienen que
   estar.
8. Ya puedes **borrar el `astravet-web.zip`** del servidor: no hace falta para
   nada.
9. Abre **https://www.astravet.es** en una ventana de incógnito para verlo sin
   la caché de tu navegador.

**Eso es todo.** Para publicar cualquier cambio futuro repite exactamente los
mismos pasos desde la Parte 1.

## Detalles que conviene saber

**El archivo `.htaccess`.** Dentro del ZIP viaja un archivo llamado `.htaccess`
que hace que la web cargue más rápido (comprime los archivos y le dice al
navegador qué puede guardar en memoria). Empieza por punto, así que el
Administrador de archivos de Hostinger puede tenerlo oculto: si quieres
comprobar que está, activa **Configuración → Mostrar archivos ocultos**.

**No veo mis cambios.** Pulsa **Ctrl + F5** (o Cmd + Shift + R en Mac) para
recargar sin caché. Si tienes activada la caché de Hostinger, vacíala en
**Rendimiento → Caché** dentro del panel del sitio.

**Antes de una publicación importante**, puedes crear una copia de seguridad
desde **Archivos → Copias de seguridad** en hPanel. Así puedes volver atrás en
un clic si algo sale mal.

---

# Qué se puede editar

## Datos de contacto y calendario

Todo en `src/config/site.js`: teléfono, WhatsApp, email, horario de atención y
la URL del calendario de reserva de reuniones.

> El calendario está **pendiente de conectar**: mientras `BOOKING.url` esté
> vacío, la web muestra un aviso de «próximamente» en lugar del calendario, sin
> romper nada. Pega ahí la URL de Calendly cuando la tengas.

## El temario

Los bloques, las horas y los temas están en `src/config/temario.js`, con
explicaciones dentro. Ahí se cambian también los textos de introducción y los
pasos de «¿Cómo se desarrolla el curso?».

## SEO (Google y asistentes de IA)

Todo en `src/config/seo.js`: el título y la descripción de cada página, las
preguntas frecuentes y las guías. Al publicar (`npm run build` o
`npm run publicar`), `scripts/seo.mjs` genera a partir de ahí:

- las páginas `/temario-auxiliar-tecnico-veterinario/`, `/que-es-un-auxiliar-tecnico-veterinario/`,
  `/preguntas-frecuentes/` y `/campus-virtual/`;
- el contenido de la portada en HTML, para buscadores e IA que no ejecutan JavaScript;
- los datos estructurados de Google (academia, curso, preguntas frecuentes);
- `sitemap.xml`, `robots.txt` y `llms.txt`.

No cambies la dirección (`slug`) de una página ya publicada: se perdería su
posicionamiento.

---

# Qué se quitó respecto a la versión completa

Para que quede constancia de qué habría que recuperar el día que se conecte el
cobro:

| Quitado | Dónde estaba |
|---|---|
| Sección de Precios | `src/components/Pricing.jsx` |
| Carrito, panel y checkout | `src/tienda/` |
| Catálogo comercial (packs, precios, promoción, códigos) | `src/config/catalogo.js`, `src/config/precios.js` |
| Validación del catálogo al compilar | plugin en `vite.config.js` |
| Tests del catálogo (`npm test`) | `src/config/catalogo.test.js` |
| Bloque de la pasarela Snipcart | `index.html` |
| Enlace «Precios» y botón de carrito del menú | `src/components/Header.jsx` |

Todo eso sigue intacto en la carpeta `web astravet`. Para volver a la versión
con cobro, se publica aquella en lugar de esta.
