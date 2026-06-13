/**
 * Post-build SEO pass:
 * - copies dist/index.html to dist/<route>/index.html for every real route,
 *   string-replacing title/description/OG/canonical → deep links are real
 *   files on GitHub Pages (200s) and crawlers see correct per-page meta;
 * - emits per-project OG card images (dist/og/<slug>.jpg);
 * - emits dist/sitemap.xml (with per-route <lastmod> from git history).
 */
import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const SITE = 'https://www.alexmaclean.ca'
const BUILD_DATE = new Date().toISOString().slice(0, 10)

/** Source files each route's content is derived from, for sitemap <lastmod>. */
const STATIC_SOURCES = {
  '/': ['src/pages/Home.tsx', 'src/data/seo.json'],
  '/work': ['src/pages/WorkIndex.tsx', 'src/data/projects-meta.json'],
  '/sunntack': ['src/pages/Sunntack.tsx', 'src/data/seo.json'],
  '/about': ['src/pages/About.tsx', 'src/data/seo.json'],
  '/contact': ['src/pages/Contact.tsx', 'src/data/seo.json'],
}

/**
 * Last commit date (YYYY-MM-DD, a W3C-valid <lastmod>) touching any of the
 * given files. Falls back to the build date when git history is unavailable
 * (e.g. a shallow clone) or the files are uncommitted.
 */
function lastmodFor(files) {
  if (!files?.length) return BUILD_DATE
  try {
    const out = execFileSync(
      'git',
      ['log', '-1', '--format=%cs', '--', ...files],
      { cwd: ROOT, encoding: 'utf8' },
    ).trim()
    return out || BUILD_DATE
  } catch {
    return BUILD_DATE
  }
}

const seo = JSON.parse(
  await readFile(path.join(ROOT, 'src/data/seo.json'), 'utf8'),
)
const projects = JSON.parse(
  await readFile(path.join(ROOT, 'src/data/projects-meta.json'), 'utf8'),
)

/** route → { title, description, image?, sources } */
const routes = new Map(
  Object.entries(seo).map(([r, m]) => [
    r,
    { ...m, sources: STATIC_SOURCES[r] ?? [] },
  ]),
)
for (const p of projects) {
  routes.set(`/work/${p.slug}`, {
    title: `${p.title} — Alex MacLean`,
    description: p.excerpt,
    image: `/og/${p.slug}.jpg`,
    sources: [`src/content/${p.slug}.tsx`, 'src/data/projects-meta.json'],
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
${[...routes.entries()]
  .map(([r, meta]) => {
    const loc = `${SITE}${r === '/' ? '/' : `${r}/`}`
    return `  <url><loc>${loc}</loc><lastmod>${lastmodFor(meta.sources)}</lastmod></url>`
  })
  .join('\n')}
</urlset>
`
await writeFile(path.join(DIST, 'sitemap.xml'), sitemap)

console.log(
  `prerender-meta: ${written} routes, ${projects.length} OG cards, sitemap.xml`,
)
