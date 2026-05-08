/**
 * Google Play listing assets:
 * - Feature graphic: 1024 × 500 (PNG)
 * - Phone screenshots: 1080 × 1920 (PNG), 4 variants
 *
 * Run: npm run generate:store-graphics
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'store-assets');

const featureSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="fgBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#07080c"/>
      <stop offset="55%" style="stop-color:#12151c"/>
      <stop offset="100%" style="stop-color:#0d1520"/>
    </linearGradient>
    <linearGradient id="fgGlow" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" style="stop-color:#00d9ff;stop-opacity:0"/>
      <stop offset="50%" style="stop-color:#00d9ff;stop-opacity:0.22"/>
      <stop offset="100%" style="stop-color:#00d9ff;stop-opacity:0"/>
    </linearGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="24"/>
    </filter>
  </defs>
  <rect width="1024" height="500" fill="url(#fgBg)"/>
  <ellipse cx="512" cy="280" rx="420" ry="180" fill="#00d9ff" opacity="0.06" filter="url(#blur)"/>
  <rect x="0" y="220" width="1024" height="120" fill="url(#fgGlow)"/>
  <!-- Door silhouette -->
  <rect x="452" y="120" width="120" height="280" rx="4" fill="#1a1f28" stroke="#2a3544" stroke-width="3"/>
  <rect x="462" y="130" width="100" height="260" rx="2" fill="#141820"/>
  <path d="M556 130 L568 138 L568 382 L556 390 Z" fill="#00d9ff" opacity="0.35"/>
  <!-- Tally 7 -->
  <g stroke="#c8c8c8" stroke-width="3" stroke-linecap="round" fill="none">
    <path d="M388 200 V235 M402 200 V235 M416 200 V235 M430 200 V235 M444 200 V235"/>
    <path d="M392 248 V283 M406 248 V283"/>
  </g>
  <text x="512" y="95" text-anchor="middle" fill="#e8e8e8" font-family="Georgia, 'Times New Roman', serif" font-size="56" font-weight="bold">7 DAYS…</text>
  <text x="512" y="455" text-anchor="middle" fill="#8899aa" font-family="Segoe UI, Arial, sans-serif" font-size="22">Survive the basement. Keep your sanity.</text>
</svg>`;

function phoneFrame(innerContent) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="pBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" style="stop-color:#050608"/>
      <stop offset="100%" style="stop-color:#0f1218"/>
    </linearGradient>
    <radialGradient id="shotMoon" cx="50%" cy="32%" r="65%">
      <stop offset="0%" style="stop-color:#1a2535"/>
      <stop offset="100%" style="stop-color:#020305"/>
    </radialGradient>
    <clipPath id="screenClip">
      <rect x="36" y="72" width="1008" height="1764" rx="36"/>
    </clipPath>
  </defs>
  <rect width="1080" height="1920" fill="url(#pBg)"/>
  <!-- Phone bezel -->
  <rect x="24" y="56" width="1032" height="1796" rx="44" fill="#1a1d24" stroke="#333842" stroke-width="4"/>
  <rect x="36" y="72" width="1008" height="1764" rx="36" fill="#0a0b0e"/>
  <g clip-path="url(#screenClip)">
    ${innerContent}
  </g>
  <!-- Status bar hint -->
  <rect x="36" y="72" width="1008" height="44" fill="#0a0b0e" opacity="0.9"/>
  <text x="72" y="102" fill="#666" font-family="Arial, sans-serif" font-size="22">9:41</text>
</svg>`;
}

const shots = [
    {
        name: 'phone-01-title.png',
        body: `
  <rect width="1080" height="1920" fill="#0c0d10"/>
  <rect x="0" y="600" width="1080" height="4" fill="#00d9ff" opacity="0.15"/>
  <text x="540" y="720" text-anchor="middle" fill="#e0e0e0" font-family="Georgia, serif" font-size="72" font-weight="bold">7 DAYS…</text>
  <text x="540" y="800" text-anchor="middle" fill="#7a8a9a" font-family="Arial, sans-serif" font-size="28">Survive the basement</text>
  <rect x="340" y="980" width="400" height="64" rx="8" fill="#2a3140" stroke="#4488ff"/>
  <text x="540" y="1022" text-anchor="middle" fill="#ddd" font-family="Arial, sans-serif" font-size="26">NEW GAME</text>
  <rect x="340" y="1070" width="400" height="64" rx="8" fill="#222830" stroke="#555"/>
  <text x="540" y="1112" text-anchor="middle" fill="#aaa" font-family="Arial, sans-serif" font-size="26">CONTINUE</text>
`,
    },
    {
        name: 'phone-02-gameplay.png',
        body: `
  <rect width="1080" height="1920" fill="#08090c"/>
  <!-- Left HUD -->
  <rect x="0" y="0" width="200" height="1920" fill="#0d0f14"/>
  <text x="24" y="120" fill="#888" font-family="Arial, sans-serif" font-size="20">STATUS</text>
  <rect x="24" y="150" width="152" height="14" rx="4" fill="#222"/><rect x="24" y="150" width="110" height="14" rx="4" fill="#44aa66"/>
  <rect x="24" y="180" width="152" height="14" rx="4" fill="#222"/><rect x="24" y="180" width="90" height="14" rx="4" fill="#66aa44"/>
  <rect x="24" y="210" width="152" height="14" rx="4" fill="#222"/><rect x="24" y="210" width="70" height="14" rx="4" fill="#cc8844"/>
  <!-- Center play -->
  <rect x="200" y="0" width="680" height="1920" fill="#050505"/>
  <rect x="220" y="200" width="640" height="360" fill="#121820" stroke="#223040"/>
  <text x="540" y="400" text-anchor="middle" fill="#334455" font-family="Arial, sans-serif" font-size="24">Basement</text>
  <!-- Right HUD -->
  <rect x="880" y="0" width="200" height="1920" fill="#0d0f14"/>
  <text x="904" y="120" fill="#888" font-family="Arial, sans-serif" font-size="20">DAY 3</text>
  <text x="904" y="160" fill="#aaa" font-family="Arial, sans-serif" font-size="18">Evening</text>
  <!-- Bottom ad strip -->
  <rect x="200" y="1820" width="680" height="80" fill="#000" stroke="#222"/>
`,
    },
    {
        name: 'phone-03-inventory.png',
        body: `
  <rect width="1080" height="1920" fill="#0a0b0e"/>
  <text x="540" y="100" text-anchor="middle" fill="#ccc" font-family="Arial, sans-serif" font-size="36" font-weight="bold">Inventory</text>
  <rect x="80" y="180" width="920" height="120" rx="12" fill="#1a1f28" stroke="#444"/>
  <text x="120" y="235" fill="#ddd" font-family="Arial, sans-serif" font-size="26">Canned food</text>
  <text x="120" y="265" fill="#888" font-family="Arial, sans-serif" font-size="20">×2</text>
  <rect x="80" y="320" width="920" height="120" rx="12" fill="#1a1f28" stroke="#444"/>
  <text x="120" y="375" fill="#ddd" font-family="Arial, sans-serif" font-size="26">Flashlight</text>
  <rect x="80" y="460" width="920" height="120" rx="12" fill="#1a1f28" stroke="#444"/>
  <text x="120" y="515" fill="#ddd" font-family="Arial, sans-serif" font-size="26">Water bottle</text>
`,
    },
    {
        name: 'phone-04-atmosphere.png',
        body: `
  <rect width="1080" height="1920" fill="url(#shotMoon)"/>
  <text x="540" y="880" text-anchor="middle" fill="#00d9ff" font-family="Georgia, serif" font-size="42" opacity="0.7">The week isn’t over.</text>
  <text x="540" y="960" text-anchor="middle" fill="#667788" font-family="Arial, sans-serif" font-size="28">Every choice costs something.</text>
  <rect x="120" y="1200" width="840" height="4" fill="#00d9ff" opacity="0.2"/>
`,
    },
];

async function main() {
    await fs.mkdir(outDir, { recursive: true });

    await sharp(Buffer.from(featureSvg)).png().toFile(path.join(outDir, 'feature-graphic-1024x500.png'));

    for (const s of shots) {
        const svg = phoneFrame(s.body);
        await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, s.name));
    }

    console.log('Play graphics written to:', outDir);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
