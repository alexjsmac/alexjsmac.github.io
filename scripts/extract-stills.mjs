/**
 * Extracts hero-grade film stills from Alex's own YouTube documentation
 * videos at exact timestamps. Sources cache in scripts/.cache (videos) and
 * land in images/stills/ (gitignored, like all source imagery); the migrate
 * pipeline turns them into optimized webp + manifest entries.
 *
 * Requires: yt-dlp, ffmpeg.   Run: node scripts/extract-stills.mjs
 */
import { execFileSync } from 'node:child_process'
import { mkdir, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CACHE = path.join(ROOT, 'scripts/.cache')
const OUT = path.join(ROOT, 'images/stills')

/** name → { videoId, timestamp (s) } — curated frames */
const STILLS = {
  // Terminal Taxonomy live at Honey Dip — the electric-blue rig shot
  'tt-live-blue': { videoId: 'gVczY7dNSvo', time: 548 },
  // Terminal Taxonomy — crowd silhouettes against the LED triangles
  'tt-crowd': { videoId: 'gVczY7dNSvo', time: 555 },
  // Concrete Canopy — the projection-wrapped Kingsmill's façade, wide
  'cc-facade': { videoId: '4ILKOoMnx8w', time: 78 },
}

const exists = (p) => access(p).then(() => true, () => false)

await mkdir(CACHE, { recursive: true })
await mkdir(OUT, { recursive: true })

const videoIds = [...new Set(Object.values(STILLS).map((s) => s.videoId))]
for (const id of videoIds) {
  const file = path.join(CACHE, `${id}.mp4`)
  if (await exists(file)) continue
  console.log(`downloading ${id}…`)
  execFileSync('yt-dlp', [
    '-q',
    '-f', 'bestvideo[height<=1080][ext=mp4]',
    '--no-playlist',
    '-o', file,
    `https://www.youtube.com/watch?v=${id}`,
  ])
}

for (const [name, { videoId, time }] of Object.entries(STILLS)) {
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-ss', String(time),
    '-i', path.join(CACHE, `${videoId}.mp4`),
    '-frames:v', '1',
    '-q:v', '2',
    path.join(OUT, `${name}.jpg`),
  ])
  console.log(`✓ ${name} (${videoId} @ ${time}s)`)
}
