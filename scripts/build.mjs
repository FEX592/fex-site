// Copies the site into dist/ and fills in the site URL used by link previews (og:image, og:url).
// URL comes from SITE_URL if you set it, otherwise from the domain Vercel provides at build time.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const raw = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || '';
const site = raw ? (raw.startsWith('http') ? raw : `https://${raw}`).replace(/\/$/, '') : '';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const item of ['index.html', 'favicon.ico', 'robots.txt', 'css', 'js', 'assets']) {
  await cp(item, `dist/${item}`, { recursive: true });
}

const html = (await readFile('dist/index.html', 'utf8')).replaceAll('__SITE_URL__', site);
await writeFile('dist/index.html', html);
console.log(site ? `Site URL set to ${site}` : 'No site URL found. Link previews will use a relative image path.');
