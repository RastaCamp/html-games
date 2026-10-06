/**
 * Copy static game assets into www/ for Capacitor (excludes node_modules, android, www).
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dest = path.join(root, 'www');

const COPY_DIRS = ['js', 'ads', 'data', 'VISUALS', 'sounds'];
const COPY_FILES = ['index.html', 'styles.css'];

async function rmrf(p) {
    await fs.rm(p, { recursive: true, force: true });
}

async function copyDir(src, dst) {
    await fs.mkdir(dst, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    for (const e of entries) {
        const s = path.join(src, e.name);
        const d = path.join(dst, e.name);
        if (e.isDirectory()) await copyDir(s, d);
        else await fs.copyFile(s, d);
    }
}

async function main() {
    await rmrf(dest);
    await fs.mkdir(dest, { recursive: true });
    for (const f of COPY_FILES) {
        await fs.copyFile(path.join(root, f), path.join(dest, f));
    }
    for (const d of COPY_DIRS) {
        const src = path.join(root, d);
        try {
            await fs.access(src);
            await copyDir(src, path.join(dest, d));
        } catch {
            console.warn('sync-www: skip missing folder', d);
        }
    }
    // The website's analytics loader (and its RASTACAMP_SITE config) is web-only: the file isn't
    // bundled into the app and the Play listing declares no data collection. Strip the tags.
    const indexPath = path.join(dest, 'index.html');
    let html = await fs.readFile(indexPath, 'utf8');
    html = html
        .replace(/<script>window\.RASTACAMP_SITE=[^<]*<\/script>/g, '')
        .replace(/<script[^>]*rastacamp-analytics\.js[^>]*><\/script>/g, '');
    await fs.writeFile(indexPath, html);
    console.log('sync-www: OK →', dest);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
