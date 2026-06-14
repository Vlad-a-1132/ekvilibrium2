import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const logoPath = path.join(root, "public/vitrina/Tovary dlya tvorchestva/logo.webp");
const appDir = path.join(root, "src/app");

const warmBackground = { r: 246, g: 241, b: 235, alpha: 1 };

async function writePng(size, filename) {
  await sharp(logoPath)
    .resize(size, size, { fit: "contain", background: warmBackground })
    .png()
    .toFile(path.join(appDir, filename));
}

async function writeIco() {
  const pngBuffer = await sharp(logoPath)
    .resize(32, 32, { fit: "contain", background: warmBackground })
    .png()
    .toBuffer();

  const width = 32;
  const height = 32;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry[0] = width >= 256 ? 0 : width;
  entry[1] = height >= 256 ? 0 : height;
  entry[2] = 0;
  entry[3] = 0;
  entry[4] = 1;
  entry[5] = 0;
  entry[6] = 32;
  entry[7] = 0;
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);

  await fs.writeFile(path.join(appDir, "favicon.ico"), Buffer.concat([header, entry, pngBuffer]));
}

await fs.mkdir(appDir, { recursive: true });
await writePng(192, "icon.png");
await writePng(180, "apple-icon.png");
await writeIco();

console.log("Favicons generated in src/app/");
