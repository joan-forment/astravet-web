// Extrae las fotos adjuntadas en el chat desde el transcript de la sesión.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const transcript = process.argv[2];
const outDir = "public/photos";
mkdirSync(outDir, { recursive: true });

const seen = new Set();
let n = 0;

for (const line of readFileSync(transcript, "utf8").split("\n")) {
  if (!line.trim()) continue;
  let entry;
  try {
    entry = JSON.parse(line);
  } catch {
    continue;
  }
  const content = entry?.message?.content;
  if (!Array.isArray(content)) continue;
  for (const item of content) {
    if (item?.type !== "image" || item?.source?.type !== "base64") continue;
    const { data, media_type } = item.source;
    const key = data.slice(0, 80) + data.length;
    if (seen.has(key)) continue;
    seen.add(key);
    n++;
    const ext = media_type === "image/png" ? "png" : "jpg";
    const file = join(outDir, `attached-${String(n).padStart(2, "0")}.${ext}`);
    writeFileSync(file, Buffer.from(data, "base64"));
    console.log(`${file}  (${media_type}, ${Math.round(data.length * 0.75 / 1024)} KB)`);
  }
}
console.log(`Total: ${n}`);
