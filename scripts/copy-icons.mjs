/**
 * Copies base icons to all required sizes
 * This is a build-time helper
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, '../public/icons');
const base512 = path.join(iconsDir, 'icon-512.png');
const base192 = path.join(iconsDir, 'icon-192.png');

const copies = [
  { src: base512, dest: 'icon-256.png' },
  { src: base512, dest: 'icon-384.png' },
  { src: base192, dest: 'icon-16.png' },
  { src: base192, dest: 'icon-32.png' },
  { src: base192, dest: 'icon-48.png' },
  { src: base192, dest: 'icon-72.png' },
  { src: base192, dest: 'icon-96.png' },
  { src: base192, dest: 'icon-128.png' },
  { src: base192, dest: 'icon-144.png' },
  { src: base192, dest: 'icon-152.png' },
  { src: base192, dest: 'icon-180.png' },
  { src: base192, dest: 'apple-touch-icon.png' },
];

copies.forEach(({ src, dest }) => {
  const destPath = path.join(iconsDir, dest);
  if (!fs.existsSync(destPath) && fs.existsSync(src)) {
    fs.copyFileSync(src, destPath);
    console.log(`✓ Copied to ${dest}`);
  }
});
