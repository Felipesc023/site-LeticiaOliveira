// One-shot: turn the raw brand + photo files into web assets.
//   node scripts/build-assets.mjs "C:/Users/felip/Downloads/Fotos"
// HEIC (iPhone) photos are decoded via heic-convert; everything else via sharp.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import heicConvert from "heic-convert";

const SRC = process.argv[2] || "C:/Users/felip/Downloads/Fotos";
const ROOT = path.resolve(import.meta.dirname, "..");
const CANVAS = { r: 251, g: 249, b: 246 }; // --color-canvas

async function load(file) {
  const buf = fs.readFileSync(path.join(SRC, file));
  if (buf.subarray(4, 12).toString("latin1") === "ftypheic") {
    return Buffer.from(await heicConvert({ buffer: buf, format: "JPEG", quality: 0.92 }));
  }
  return buf;
}

async function photo(srcFile, outName, width = 1400) {
  const buf = await load(srcFile);
  const out = path.join(ROOT, "public/leticia", outName);
  await sharp(buf)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(out);
  console.log("photo", outName, (fs.statSync(out).size / 1024).toFixed(0) + " kB");
}

async function brand() {
  const symbol = fs.readFileSync(path.join(SRC, "logo_simbolo_transparente.png"));
  const lockup = fs.readFileSync(path.join(SRC, "logo_lockup_marrom_transparente.png"));
  fs.mkdirSync(path.join(ROOT, "public/brand"), { recursive: true });

  // Header mark — trimmed, transparent, original espresso strokes.
  await sharp(symbol)
    .trim()
    .resize({ width: 240 })
    .png()
    .toFile(path.join(ROOT, "public/brand/monogram.png"));

  // Dark surfaces reuse monogram.png recoloured in CSS (brightness/invert).

  // Full lockup for the footer — already cream artwork, just trim + size.
  await sharp(lockup)
    .trim()
    .resize({ width: 640 })
    .png()
    .toFile(path.join(ROOT, "public/brand/lockup.png"));

  // Favicon (transparent) + Apple icon (on canvas, padded).
  const iconBody = await sharp(symbol).trim().resize({ width: 400, height: 400, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: iconBody, gravity: "center" }])
    .png()
    .toFile(path.join(ROOT, "app/icon.png"));
  await sharp({ create: { width: 180, height: 180, channels: 4, background: CANVAS } })
    .composite([{ input: await sharp(symbol).trim().resize({ width: 132, height: 132, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(), gravity: "center" }])
    .png()
    .toFile(path.join(ROOT, "app/apple-icon.png"));
  console.log("brand » monogram, monogram-cream, lockup, app/icon.png, app/apple-icon.png");
}

await brand();
await photo("IMG_2467.png", "home.jpg", 1500);
await photo("IMG_3749.png", "sobre.jpg", 1200);
await photo("IMG_3741__1_.jpg", "contato.jpg", 1000);
console.log("done");
