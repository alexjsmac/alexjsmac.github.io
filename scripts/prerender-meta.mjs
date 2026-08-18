/**
 * Post-build SEO pass:
 * - copies dist/index.html to dist/<route>/index.html for every real route,
 *   string-replacing title/description/OG/canonical → deep links are real
 *   files on GitHub Pages (200s) and crawlers see correct per-page meta;
 * - emits per-project OG card images (dist/og/<slug>.jpg);
 * - emits a 200 redirect stub at every legacy Jekyll URL (see
 *   src/data/legacy-redirects.json) — GitHub Pages has no server-side
 *   redirect, and letting these fall through to 404.html serves them as a
 *   hard 404, so crawlers drop the URL instead of following it;
 * - emits dist/sitemap.xml (per-route <lastmod> from git history, plus the
 *   live project sites from src/data/project-sites.json).
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
const legacyRedirects = JSON.parse(
  await readFile(path.join(ROOT, 'src/data/legacy-redirects.json'), 'utf8'),
)
const projectSites = JSON.parse(
  await readFile(path.join(ROOT, 'src/data/project-sites.json'), 'utf8'),
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

/**
 * Redirect stubs for legacy URLs.
 *
 * Instant meta refresh + canonical is the strongest signal available on a
 * static host: Google documents meta refresh as a supported redirect and
 * consolidates ranking signals across it. The stub must NOT be noindexed —
 * that would tell the crawler to drop the URL rather than follow it — and
 * must not appear in the sitemap.
 */
function redirectStub(target) {
  const abs = SITE + target
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Redirecting — Alex MacLean</title>
    <link rel="canonical" href="${abs}" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <style>
      html {
        background: #020610;
        color: #e8ecf4;
        font: 16px/1.5 system-ui, sans-serif;
      }
      body {
        margin: 0;
        padding: 2rem;
      }
    </style>
    <script>
      location.replace(${JSON.stringify(target)})
    </script>
  </head>
  <body>
    <p>This page has moved to <a href="${target}">${abs}</a>.</p>
  </body>
</html>
`
}

/** Trailing slash to match the prerendered routes; file targets left alone. */
const normalizeTarget = (t) =>
  t === '/' || path.extname(t) ? t : `${t}/`

// Separate repos publish as GitHub Pages project sites at /<repo>/ under this
// domain. Writing a stub there would deploy a file over a working demo, so
// refuse the build rather than silently shadowing one.
const reserved = new Set(
  projectSites.sites.map((s) => s.path.replace(/\/$/, '')),
)

let redirects = 0
for (const [from, to] of Object.entries(legacyRedirects)) {
  if (from.startsWith('_')) continue // JSON has no comments; skip _-prefixed keys
  if (reserved.has(from)) {
    throw new Error(
      `legacy-redirects.json: ${from} is a live project site, not a dead URL. ` +
        `A stub there would shadow the deployed demo.`,
    )
  }
  const html = redirectStub(normalizeTarget(to))
  if (from.endsWith('.html')) {
    const file = path.join(DIST, from.slice(1))
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, html)
  } else {
    const dir = path.join(DIST, from.slice(1))
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, 'index.html'), html)
  }
  redirects++
}

const routeUrls = [...routes.entries()].map(([r, meta]) => {
  const loc = `${SITE}${r === '/' ? '/' : `${r}/`}`
  return `  <url><loc>${loc}</loc><lastmod>${lastmodFor(meta.sources)}</lastmod></url>`
})

// Project sites deploy from their own repos, so this build has no basis for a
// <lastmod> — omitted rather than stamped with a value that would be wrong.
// They need listing here precisely because the only links to them are the
// /work/ "Live piece" buttons, which do not exist until the SPA hydrates.
const projectSiteUrls = projectSites.sites.map(
  (s) => `  <url><loc>${SITE}${s.path}</loc></url>`,
)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...routeUrls, ...projectSiteUrls].join('\n')}
</urlset>
`
await writeFile(path.join(DIST, 'sitemap.xml'), sitemap)

console.log(
  `prerender-meta: ${written} routes, ${projects.length} OG cards, ` +
    `${redirects} redirect stubs, ` +
    `sitemap.xml (${routeUrls.length} routes + ${projectSiteUrls.length} project sites)`,
)
