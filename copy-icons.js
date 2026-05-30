#!/usr/bin/env node
/**
 * Creates all required icon sizes for tt vdo downloader
 * Copies from the base generated icons to all required sizes
 */
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'public', 'icons');
const base512 = path.join(iconsDir, 'icon-512.png');
const base192 = path.join(iconsDir, 'icon-192.png');
const base32  = path.join(iconsDir, 'icon-32.png');
const mask512 = path.join(iconsDir, 'maskable-512.png');
const mask192 = path.join(iconsDir, 'maskable-192.png');
const apple   = path.join(iconsDir, 'apple-touch-icon.png');

const copies = [
  // Small icons use base32 if available, else base192
  { src: base32,  dest: 'icon-16.png'  },
  { src: base32,  dest: 'icon-48.png'  },
  { src: base192, dest: 'icon-72.png'  },
  { src: base192, dest: 'icon-96.png'  },
  { src: base192, dest: 'icon-128.png' },
  { src: base192, dest: 'icon-144.png' },
  { src: base192, dest: 'icon-152.png' },
  { src: base192, dest: 'icon-180.png' },
  { src: base512, dest: 'icon-256.png' },
  { src: base512, dest: 'icon-384.png' },
];

fs.mkdirSync(iconsDir, { recursive: true });

copies.forEach(({ src, dest }) => {
  const destPath = path.join(iconsDir, dest);
  try {
    if (!fs.existsSync(destPath)) {
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, destPath);
        console.log(`✓ Created ${dest}`);
      } else {
        console.warn(`⚠ Source not found: ${path.basename(src)}`);
      }
    } else {
      console.log(`  ${dest} already exists`);
    }
  } catch (e) {
    console.error(`✗ Failed ${dest}: ${e.message}`);
  }
});

console.log('\nIcon setup complete!');
