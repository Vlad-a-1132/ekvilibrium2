import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const logoPath = path.join(root, "public/vitrina/Tovary dlya tvorchestva/logo.webp");
const appDir = path.join(root, "src/app");

const warmBackground = { r: 246, g: 241, b: 235, alpha: 1 };

async function composeSquareIcon(size) {
  const logo = sharp(logoPath);
  const meta = await logo.metadata();
  const logoWidth = meta.width ?? 256;
  const logoHeight = meta.height ?? 71;

  const maxLogoWidth = Math.round(size * 0.9);
  const maxLogoHeight = Math.round(size * 0.72);
  const scale = Math.min(maxLogoWidth / logoWidth, maxLogoHeight / logoHeight);
  const targetWidth = Math.max(1, Math.round(logoWidth * scale));
  const targetHeight = Math.max(1, Math.round(logoHeight * scale));

  const logoBuffer = await logo.resize(targetWidth, targetHeight, { fit: "inside" }).png().toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: warmBackground,
    },
  })
    .composite([{ input: logoBuffer, gravity: "center" }])
    .png()
    .toBuffer();
}

async function writePng(size, filename) {
  const buffer = await composeSquareIcon(size);
  await fs.writeFile(path.join(appDir, filename), buffer);
}

async function writeIco() {
  const pngBuffer = await composeSquareIcon(32);
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
