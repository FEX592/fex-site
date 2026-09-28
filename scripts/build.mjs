// Copies the site into dist/ and fills in:
// - the site URL used by link previews (og:image, og:url) — from SITE_URL if you set it,
//   otherwise the domain Vercel provides at build time.
// - a cache-busting ?v= on every /assets/ reference — from the git commit Vercel builds,
//   otherwise the build timestamp. assets/ is served with a 1-year "immutable" cache
//   header (see vercel.json), so replacing a video/image but keeping its filename would
//   otherwise leave anyone who already visited stuck on the old cached file. Changing this
//   query string changes the URL, which is what actually busts that cache — bump it just by
//   deploying (each Vercel deployment gets a new commit SHA); no manual editing needed.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const raw = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || '';
const site = raw ? (raw.startsWith('http') ? raw : `https://${raw}`).replace(/\/$/, '') : '';
const assetVersion = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 10) || String(Date.now());

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const item of ['index.html', 'favicon.ico', 'robots.txt', 'css', 'js', 'assets']) {
  await cp(item, `dist/${item}`, { recursive: true });
}

const html = (await readFile('dist/index.html', 'utf8'))
  .replaceAll('__SITE_URL__', site)
  .replaceAll('__ASSET_V__', assetVersion);
await writeFile('dist/index.html', html);
console.log(site ? `Site URL set to ${site}` : 'No site URL found. Link previews will use a relative image path.');
console.log(`Asset cache version set to ${assetVersion}`);
