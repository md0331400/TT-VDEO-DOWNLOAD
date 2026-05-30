/**
 * Icon generator script for tt vdo downloader
 * Creates all required icon sizes from the base SVG
 * Run: node scripts/generate-icons.mjs
 */
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, '../public/icons');

const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512];

function drawIcon(size, maskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const pad = maskable ? size * 0.1 : 0;
  const inner = size - pad * 2;

  // Background
  ctx.fillStyle = '#0f0f0f';
  if (size >= 48) {
    const r = size * 0.18;
    ctx.beginPath();
    ctx.moveTo(r, 0); ctx.lineTo(size - r, 0);
    ctx.arcTo(size, 0, size, r, r);
    ctx.lineTo(size, size - r);
    ctx.arcTo(size, size, size - r, size, r);
    ctx.lineTo(r, size);
    ctx.arcTo(0, size, 0, size - r, r);
    ctx.lineTo(0, r);
    ctx.arcTo(0, 0, r, 0, r);
    ctx.closePath();
  } else {
    ctx.rect(0, 0, size, size);
  }
  ctx.fill();

  // Gradient
  const grad = ctx.createLinearGradient(pad, pad, pad + inner, pad + inner);
  grad.addColorStop(0, '#ff2d55');
  grad.addColorStop(1, '#ff6b00');

  ctx.fillStyle = grad;
  ctx.strokeStyle = grad;

  const cx = size / 2;
  const fontSize = inner * 0.42;

  if (size >= 32) {
    // "TT" text
    ctx.font = `900 ${fontSize}px Arial Black, Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#ff2d55';
    ctx.shadowBlur = size * 0.06;
    ctx.fillText('TT', cx, size * 0.38);

    // Arrow down
    ctx.shadowBlur = size * 0.04;
    const aw = inner * 0.25;
    const ay1 = size * 0.58;
    const ay2 = size * 0.78;
    const lw = Math.max(1.5, size * 0.04);

    ctx.lineWidth = lw;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, ay1); ctx.lineTo(cx, ay2 - aw * 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - aw, ay2 - aw * 0.6);
    ctx.lineTo(cx, ay2);
    ctx.lineTo(cx + aw, ay2 - aw * 0.6);
    ctx.stroke();
  } else {
    // Simple square for tiny icons
    ctx.fillRect(size * 0.2, size * 0.2, size * 0.6, size * 0.6);
  }

  return canvas;
}

fs.mkdirSync(iconsDir, { recursive: true });

sizes.forEach(size => {
  const canvas = drawIcon(size);
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), buf);
  console.log(`✓ icon-${size}.png`);
});

// Maskable versions
[192, 512].forEach(size => {
  const canvas = drawIcon(size, true);
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconsDir, `maskable-${size}.png`), buf);
  console.log(`✓ maskable-${size}.png`);
});

// Apple touch icon (180px)
const canvas = drawIcon(180);
const buf = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), buf);
console.log('✓ apple-touch-icon.png');

console.log('\n🎉 All icons generated!');
