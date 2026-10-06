/**
 * Adds a caption bar above each raw 2160x1080 gameplay capture for the Play Store listing.
 * Raw captures come from tester/rastacamp-verify/games/7days-screenshots.mjs.
 * Usage: node scripts/caption-store-shots.mjs [store-assets/2026-10]
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.resolve(root, process.argv[2] || 'store-assets/2026-10');

const SHOTS = [
    ['1-title', 'SURVIVE 7 DAYS IN THE BASEMENT'],
    ['2-basement', 'SCAVENGE, EXPLORE, STAY ALIVE'],
    ['3-crafting', '55 RECIPES: BARRICADES, FILTERS, TRAPS'],
    ['4-seasons', 'EVERY SEASON CHANGES SURVIVAL'],
    ['6-rest', 'REST, RATION, OUTLAST THE NIGHT'],
];
const W = 2160;
const H = 1080;
const BAR = 170;

let n = 1;
for (const [file, caption] of SHOTS) {
    const svg = `<svg width="${W}" height="${BAR}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#05070b"/>
  <text x="50%" y="112" text-anchor="middle" font-family="Courier New, monospace" font-weight="700"
        font-size="74" fill="#4d8dff" letter-spacing="4">${caption}</text>
</svg>`;
    const out = path.join(dir, `7days-phone-${n++}.png`);
    await sharp({ create: { width: W, height: H + BAR, channels: 3, background: '#05070b' } })
        .composite([
            { input: Buffer.from(svg), top: 0, left: 0 },
            { input: path.join(dir, 'raw', `${file}.png`), top: BAR, left: 0 },
        ])
        .png()
        .toFile(out);
    const m = await sharp(out).metadata();
    console.log(path.basename(out), `${m.width}x${m.height}`, (m.width / m.height).toFixed(2));
}
