/*
 * Prepara el archivo que hay que subir a Hostinger.
 *
 * Se ejecuta solo con:  npm run publicar
 *
 * Lo que hace:
 *   1. Genera la web con los últimos cambios (npm run build).
 *   2. Mete todo el contenido de la carpeta dist/ en un ZIP.
 *   3. Deja el ZIP en la raíz del proyecto, listo para arrastrarlo al
 *      Administrador de archivos de Hostinger.
 *
 * El ZIP contiene los archivos SUELTOS, no una carpeta dentro. Es importante:
 * al descomprimirlo en public_html, los archivos quedan donde tienen que estar.
 */
import { execFileSync } from "node:child_process";
import { existsSync, rmSync, statSync } from "node:fs";
import { resolve } from "node:path";

const RAIZ = resolve(import.meta.dirname, "..");
const DIST = resolve(RAIZ, "dist");
const ZIP = resolve(RAIZ, "astravet-web.zip");

if (!existsSync(DIST)) {
  console.error(
    "\n❌ No existe la carpeta dist/. Ejecuta antes: npm run build\n"
  );
  process.exit(1);
}

// Un ZIP viejo confundiría a quien lo suba: se borra siempre.
if (existsSync(ZIP)) rmSync(ZIP);

console.log("\nEmpaquetando la web…");

try {
  // Compress-Archive viene con Windows: no hace falta instalar nada.
  execFileSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      `Compress-Archive -Path '${DIST}\\*' -DestinationPath '${ZIP}' -Force`,
    ],
    { stdio: "inherit" }
  );
} catch (error) {
  console.error(
    "\n❌ No se ha podido crear el ZIP automáticamente.\n" +
      "   Alternativa: entra en la carpeta dist/, selecciona TODO lo que hay\n" +
      "   dentro, haz clic derecho y elige «Comprimir en archivo ZIP».\n"
  );
  process.exit(1);
}

const megas = (statSync(ZIP).size / 1024 / 1024).toFixed(1);

console.log(`
✅ Listo.

   Archivo:  astravet-web.zip  (${megas} MB)
   Está en:  ${RAIZ}

   Siguiente paso: súbelo a Hostinger siguiendo la sección
   «Cómo publicar la web en Hostinger» del README.
`);
