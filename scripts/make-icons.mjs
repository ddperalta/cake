// Genera los íconos PNG de la PWA (public/icon-192.png y public/icon-512.png)
// usando un Chromium headless. Uso: node scripts/make-icons.mjs
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage();
await page.setContent('<canvas id="c"></canvas>');

async function makeIcon(size, out) {
  const dataUrl = await page.evaluate((size) => {
    const c = document.getElementById('c');
    c.width = c.height = size;
    const x = c.getContext('2d');
    const r = size * 0.18;
    x.fillStyle = '#f2a91e';
    x.beginPath();
    x.roundRect(0, 0, size, size, r);
    x.fill();
    x.font = `${size * 0.62}px serif`;
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillText('🍺', size / 2, size / 2 + size * 0.04);
    return c.toDataURL('image/png');
  }, size);
  fs.writeFileSync(out, Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log('generado', out);
}

fs.mkdirSync('public', { recursive: true });
await makeIcon(192, 'public/icon-192.png');
await makeIcon(512, 'public/icon-512.png');
await browser.close();
