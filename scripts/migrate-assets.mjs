/**
 * Asset migration pipeline.
 *
 * Reads content images from the old Jekyll site, emits optimized WebP
 * derivatives into src/assets, fixed-URL files into public/, and an
 * image-manifest.json with intrinsic dimensions for CLS-free <img> markup.
 *
 * Idempotent: re-running overwrites outputs. YouTube posters are cached in
 * scripts/.cache so the pipeline works offline after the first run.
 */
import sharp from 'sharp'
import { mkdir, copyFile, writeFile, readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OLD = '/Users/amaclean/Development/alexjsmac.github.io'
const IMAGES = path.join(OLD, 'assets/images')
const CACHE = path.join(ROOT, 'scripts/.cache')
const WORK_OUT = path.join(ROOT, 'src/assets/work')

const HERO_WIDTH = 1600
const THUMB_WIDTH = 800

/**
 * slug → image sources. Values are relative to the old site's
 * assets/images, or `youtube:<id>` (fetch thumbnail), or `local:<path>`
 * (relative to this repo's root).
 */
const PROJECTS = {
  murmuration: { teaser: 'youtube:H8nsqBQeO9E' },
  'a-v-nights': {
    teaser: 'local:images/AVN-8.jpg',
    gallery: ['local:images/AVN-5.jpg'],
  },
  'terminal-taxonomy': { teaser: 'youtube:gVczY7dNSvo' },
  'concrete-canopy': { teaser: 'youtube:4ILKOoMnx8w' },
  'green-space': { teaser: 'green-space.png' },
  'harp-chair': { teaser: 'harp-chair.png' },
  'blue-noise': { teaser: 'blue-noise.png' },
  outfalls: { teaser: 'outfalls.png' },
  'modular-grove': { teaser: 'modular-grove.jpg' },
  'planktonic-space': { teaser: 'plankton-2.png' },
  'oceanic-datanimism-vr': { teaser: 'oceanic-datanimism-vr.png' },
  'bev-deconstructed': { teaser: 'bev-deconstructed.png' },
  'robotic-noise': {
    teaser: 'rnoise-3.jpg',
    gallery: ['rnoise-1.jpg', 'rnoise-3.jpg', 'rnoise-4.jpg', 'rnoise-5.jpg'],
  },
  'oceanic-datanimism': { teaser: 'alex-maclean-oceanic-datanimism.png' },
  'switch-jockey': { teaser: 'switch-jockey.png' },
  'immersive-dreams': { teaser: 'immersive-dreams-1.png' },
  'scrap-focus': {
    teaser: 'scrap-focus-1.JPG',
    gallery: ['scrap-focus-1.JPG', 'scrap-focus-2.JPG', 'scrap-focus-3.JPG'],
  },
}

async function exists(p) {
  return access(p).then(
    () => true,
    () => false,
  )
}

async function sourceFor(spec) {
  if (spec.startsWith('local:')) {
    return path.join(ROOT, spec.slice('local:'.length))
  }
  if (!spec.startsWith('youtube:')) return path.join(IMAGES, spec)
  const id = spec.slice('youtube:'.length)
  const cached = path.join(CACHE, `${id}.jpg`)
  if (!(await exists(cached))) {
    const url = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
    await mkdir(CACHE, { recursive: true })
    await writeFile(cached, Buffer.from(await res.arrayBuffer()))
    console.log(`  fetched ${url}`)
  }
  return cached
}

/** Resize long edge to maxEdge, emit webp, return {width, height}. */
async function toWebp(src, dest, maxEdge, quality) {
  const info = await sharp(src)
    .rotate() // respect EXIF orientation
    .resize({
      width: maxEdge,
      height: maxEdge,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toFile(dest)
  return { width: info.width, height: info.height }
}

const manifest = { work: {}, about: {} }

for (const [slug, spec] of Object.entries(PROJECTS)) {
  const dir = path.join(WORK_OUT, slug)
  await mkdir(dir, { recursive: true })
  const src = await sourceFor(spec.teaser)

  manifest.work[slug] = {
    hero: await toWebp(src, path.join(dir, 'hero.webp'), HERO_WIDTH, 82),
    thumb: await toWebp(src, path.join(dir, 'thumb.webp'), THUMB_WIDTH, 80),
  }
  if (spec.gallery) {
    manifest.work[slug].gallery = []
    for (const [i, rel] of spec.gallery.entries()) {
      const dest = path.join(dir, `gallery-${i + 1}.webp`)
      manifest.work[slug].gallery.push(
        await toWebp(await sourceFor(rel), dest, HERO_WIDTH, 82),
      )
    }
  }
  console.log(`✓ ${slug}`)
}

// Sunntack press photos: web-display webp + print-quality JPG downloads.
// Sources live in images/ at the repo root (gitignored; outputs committed).
const PRESS = [
  { src: 'AVN-5.jpg', slug: 'sunntack-press-1' },
  { src: 'AVN-8.jpg', slug: 'sunntack-press-2' },
  { src: 'polaris-1.jpg', slug: 'sunntack-live-1' },
  { src: 'polaris-2.jpg', slug: 'sunntack-live-2' },
  { src: 'sunntack-square.png', slug: 'sunntack-portrait' },
]
const PRESS_SRC = path.join(ROOT, 'images')
const PRESS_DISPLAY = path.join(ROOT, 'src/assets/press')
const PRESS_DOWNLOAD = path.join(ROOT, 'public/press')
await mkdir(PRESS_DISPLAY, { recursive: true })
await mkdir(PRESS_DOWNLOAD, { recursive: true })
manifest.press = {}
for (const { src, slug } of PRESS) {
  const source = path.join(PRESS_SRC, src)
  if (!(await exists(source))) {
    console.warn(`! press source missing, skipping: ${src}`)
    continue
  }
  manifest.press[slug] = await toWebp(
    source,
    path.join(PRESS_DISPLAY, `${slug}.webp`),
    HERO_WIDTH,
    82,
  )
  await sharp(source)
    .rotate()
    .resize({ width: 3000, height: 3000, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 88 })
    .toFile(path.join(PRESS_DOWNLOAD, `${slug}.jpg`))
}
console.log('✓ press photos (display webp + print-quality downloads)')

// Film stills (extracted by scripts/extract-stills.mjs into images/stills)
const STILLS = ['tt-live-blue', 'tt-crowd', 'cc-facade']
const STILLS_SRC = path.join(ROOT, 'images/stills')
const STILLS_OUT = path.join(ROOT, 'src/assets/stills')
await mkdir(STILLS_OUT, { recursive: true })
manifest.stills = {}
for (const name of STILLS) {
  const source = path.join(STILLS_SRC, `${name}.jpg`)
  if (!(await exists(source))) {
    console.warn(`! still missing (run extract-stills): ${name}`)
    continue
  }
  // 1920 wide: the hero still is full-bleed
  manifest.stills[name] = await toWebp(
    source,
    path.join(STILLS_OUT, `${name}.webp`),
    1920,
    80,
  )
}
console.log('✓ film stills')

// Headshot
await mkdir(path.join(ROOT, 'src/assets/about'), { recursive: true })
manifest.about.headshot = await toWebp(
  path.join(IMAGES, 'sunntack-headshot.png'),
  path.join(ROOT, 'src/assets/about/headshot.webp'),
  THUMB_WIDTH,
  82,
)
console.log('✓ headshot')

// OG image: 1200x630 crop of the Terminal Taxonomy hero still
const OG_SRC = path.join(STILLS_SRC, 'tt-live-blue.jpg')
if (await exists(OG_SRC)) {
  await sharp(OG_SRC)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 80 })
    .toFile(path.join(ROOT, 'public/og.jpg'))
  console.log('✓ og.jpg')
} else {
  console.warn('! og source still missing (run extract-stills), keeping og.jpg')
}

// Fixed-URL files → public/
await copyFile(path.join(OLD, 'assets/cv.pdf'), path.join(ROOT, 'public/cv.pdf'))
const FAVICONS = [
  'favicon.ico',
  'favicon-96x96.png',
  'apple-touch-icon.png',
  'web-app-manifest-192x192.png',
  'web-app-manifest-512x512.png',
  // favicon.svg deliberately skipped: 1.7MB embedded-raster SVG
]
for (const f of FAVICONS) {
  await copyFile(
    path.join(IMAGES, 'favicon', f),
    path.join(ROOT, 'public', f),
  )
}
const webmanifest = JSON.parse(
  await readFile(path.join(IMAGES, 'favicon/site.webmanifest'), 'utf8'),
)
webmanifest.name = 'Alex MacLean'
webmanifest.short_name = 'MacLean'
webmanifest.theme_color = '#020610'
webmanifest.background_color = '#020610'
await writeFile(
  path.join(ROOT, 'public/site.webmanifest'),
  JSON.stringify(webmanifest, null, 2) + '\n',
)
await writeFile(path.join(ROOT, 'public/CNAME'), 'www.alexmaclean.ca\n')
console.log('✓ public/ (cv.pdf, favicons, site.webmanifest, CNAME)')

await writeFile(
  path.join(ROOT, 'src/data/image-manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n',
)
console.log('✓ image-manifest.json')
