/**
 * One-off: record the Murmuration promo page (live generative visual) with
 * the system Chrome via puppeteer-core screencast, then compress to a
 * loop-friendly webm + extract a poster.
 *
 * Output: src/assets/murmuration/loop.webm (+ poster.webp via sharp)
 */
import puppeteer from 'puppeteer-core'
import { execFileSync } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CACHE = path.join(ROOT, 'scripts/.cache')
const OUT_DIR = path.join(ROOT, 'src/assets/murmuration')
const URL = 'https://murmuration-app.web.app/promo/'
const SECONDS = 9

await mkdir(CACHE, { recursive: true })
await mkdir(OUT_DIR, { recursive: true })

const browser = await puppeteer.launch({
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 })
  // Let the generative visual settle in
  await new Promise((r) => setTimeout(r, 3000))

  const raw = path.join(CACHE, 'murmuration-raw.webm')
  const recorder = await page.screencast({ path: raw })
  await new Promise((r) => setTimeout(r, SECONDS * 1000))
  await recorder.stop()
  console.log(`captured ${SECONDS}s → ${raw}`)
} finally {
  await browser.close()
}

// Compress: the promo content is square — crop the pillarboxing, 640px is
// plenty for the card. Thin neon wireframes are brutal for VP9, hence the
// high CRF; checked visually at card size.
const raw = path.join(CACHE, 'murmuration-raw.webm')
const loop = path.join(OUT_DIR, 'loop.webm')
execFileSync('ffmpeg', [
  '-y',
  '-i', raw,
  '-an',
  '-vf', 'crop=ih:ih,scale=640:640:flags=lanczos,fps=20',
  '-c:v', 'libvpx-vp9',
  '-crf', '52',
  '-b:v', '0',
  '-deadline', 'good',
  '-cpu-used', '2',
  '-row-mt', '1',
  loop,
])
console.log(`compressed → ${loop}`)

// Poster: a frame from a second in
const posterPng = path.join(CACHE, 'murmuration-poster.png')
execFileSync('ffmpeg', [
  '-y',
  '-ss', '1.5',
  '-i', loop,
  '-frames:v', '1',
  posterPng,
])
await sharp(posterPng)
  .webp({ quality: 80 })
  .toFile(path.join(OUT_DIR, 'poster.webp'))
console.log(`poster → ${path.join(OUT_DIR, 'poster.webp')}`)
