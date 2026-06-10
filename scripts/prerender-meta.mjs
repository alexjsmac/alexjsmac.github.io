/**
 * Post-build SEO pass:
 * - copies dist/index.html to dist/<route>/index.html for every real route,
 *   string-replacing title/description/OG/canonical → deep links are real
 *   files on GitHub Pages (200s) and crawlers see correct per-page meta;
 * - emits per-project OG card images (dist/og/<slug>.jpg);
 * - emits dist/sitemap.xml.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const SITE = 'https://www.alexmaclean.ca'

const seo = JSON.parse(
  await readFile(path.join(ROOT, 'src/data/seo.json'), 'utf8'),
)
const projects = JSON.parse(
  await readFile(path.join(ROOT, 'src/data/projects-meta.json'), 'utf8'),
)

/** route → { title, description, image? } */
const routes = new Map(Object.entries(seo).map(([r, m]) => [r, { ...m }]))
for (const p of projects) {
  routes.set(`/work/${p.slug}`, {
    title: `${p.title} — Alex MacLean`,
    description: p.excerpt,
    image: `/og/${p.slug}.jpg`,
  })
}

const esc = (s) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const template = await readFile(path.join(DIST, 'index.html'), 'utf8')

function htmlFor(route, meta) {
  const url = SITE + (route === '/' ? '/' : `${route}/`)
  const image = SITE + (meta.image ?? '/og.jpg')
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(
      /(<meta name="description"\s+content=")[^"]*(")/,
      `$1${esc(meta.description)}$2`,
    )
    .replace(
      /(<meta property="og:title" content=")[^"]*(")/,
      `$1${esc(meta.title)}$2`,
    )
    .replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
      `$1${esc(meta.description)}$2`,
    )
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${image}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
}

let written = 0
for (const [route, meta] of routes) {
  const html = htmlFor(route, meta)
  if (route === '/') {
    await writeFile(path.join(DIST, 'index.html'), html)
  } else {
    const dir = path.join(DIST, route.slice(1))
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, 'index.html'), html)
  }
  written++
}

// Per-project OG cards from the optimized heroes
await mkdir(path.join(DIST, 'og'), { recursive: true })
for (const p of projects) {
  await sharp(path.join(ROOT, `src/assets/work/${p.slug}/hero.webp`))
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 80 })
    .toFile(path.join(DIST, 'og', `${p.slug}.jpg`))
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...routes.keys()]
  .map(
    (r) =>
      `  <url><loc>${SITE}${r === '/' ? '/' : `${r}/`}</loc></url>`,
  )
  .join('\n')}
</urlset>
`
await writeFile(path.join(DIST, 'sitemap.xml'), sitemap)

console.log(
  `prerender-meta: ${written} routes, ${projects.length} OG cards, sitemap.xml`,
)
