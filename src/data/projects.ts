import type { ComponentType } from 'react'
import meta from './projects-meta.json'
import manifest from './image-manifest.json'

import Murmuration from '@/content/murmuration'
import AvNights from '@/content/a-v-nights'
import TerminalTaxonomy from '@/content/terminal-taxonomy'
import ConcreteCanopy from '@/content/concrete-canopy'
import GreenSpace from '@/content/green-space'
import HarpChair from '@/content/harp-chair'
import BlueNoise from '@/content/blue-noise'
import Outfalls from '@/content/outfalls'
import ModularGrove from '@/content/modular-grove'
import PlanktonicSpace from '@/content/planktonic-space'
import OceanicDatanimismVr from '@/content/oceanic-datanimism-vr'
import BevDeconstructed from '@/content/bev-deconstructed'
import RoboticNoise from '@/content/robotic-noise'
import SwitchJockey from '@/content/switch-jockey'
import OceanicDatanimism from '@/content/oceanic-datanimism'
import ImmersiveDreams from '@/content/immersive-dreams'
import ScrapFocus from '@/content/scrap-focus'

export interface ProjectImage {
  src: string
  width: number
  height: number
  alt: string
}

export interface ProjectVideo {
  provider: 'vimeo' | 'youtube' | 'file'
  id: string
}

/** Self-hosted recordings for `provider: 'file'` videos, keyed by video id. */
export const FILE_VIDEOS: Record<string, { src: string; poster: string }> = {}

export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  slug: string
  title: string
  year: number
  excerpt: string
  medium: string
  materials: string[]
  /** Absent for photo-documented work (e.g. event series) */
  video?: ProjectVideo
  hero: ProjectImage
  thumb: ProjectImage
  gallery?: ProjectImage[]
  galleryCaption?: string
  links?: ProjectLink[]
  funders?: string[]
  /** Where the work has been shown/performed, e.g. "Nuit Blanche London, 2025" */
  venues?: string[]
  featured: boolean
  Body: ComponentType
}

const BODIES: Record<string, ComponentType> = {
  murmuration: Murmuration,
  'a-v-nights': AvNights,
  'terminal-taxonomy': TerminalTaxonomy,
  'concrete-canopy': ConcreteCanopy,
  'green-space': GreenSpace,
  'harp-chair': HarpChair,
  'blue-noise': BlueNoise,
  outfalls: Outfalls,
  'modular-grove': ModularGrove,
  'planktonic-space': PlanktonicSpace,
  'oceanic-datanimism-vr': OceanicDatanimismVr,
  'bev-deconstructed': BevDeconstructed,
  'robotic-noise': RoboticNoise,
  'switch-jockey': SwitchJockey,
  'oceanic-datanimism': OceanicDatanimism,
  'immersive-dreams': ImmersiveDreams,
  'scrap-focus': ScrapFocus,
}

interface Dim {
  width: number
  height: number
}
interface WorkImages {
  hero: Dim
  thumb: Dim
  gallery?: Dim[]
}

const dims = manifest.work as Record<string, WorkImages>

const heroSrcs = import.meta.glob<string>('../assets/work/*/hero.webp', {
  eager: true,
  import: 'default',
})
const thumbSrcs = import.meta.glob<string>('../assets/work/*/thumb.webp', {
  eager: true,
  import: 'default',
})
const gallerySrcs = import.meta.glob<string>(
  '../assets/work/*/gallery-*.webp',
  { eager: true, import: 'default' },
)

function image(
  slug: string,
  kind: 'hero' | 'thumb',
  alt: string,
): ProjectImage {
  const src = (kind === 'hero' ? heroSrcs : thumbSrcs)[
    `../assets/work/${slug}/${kind}.webp`
  ]
  const dim = dims[slug]?.[kind]
  if (!src || !dim) {
    throw new Error(
      `Missing ${kind} image for "${slug}" — run \`npm run migrate\``,
    )
  }
  return { src, ...dim, alt }
}

function gallery(slug: string, title: string): ProjectImage[] | undefined {
  const galleryDims = dims[slug]?.gallery
  if (!galleryDims?.length) return undefined
  return galleryDims.map((dim, i) => {
    const src = gallerySrcs[`../assets/work/${slug}/gallery-${i + 1}.webp`]
    if (!src) {
      throw new Error(
        `Missing gallery image ${i + 1} for "${slug}" — run \`npm run migrate\``,
      )
    }
    return { src, ...dim, alt: `${title} — installation view ${i + 1}` }
  })
}

export const projects: Project[] = meta.map((m) => {
  const Body = BODIES[m.slug]
  if (!Body) throw new Error(`Missing body component for "${m.slug}"`)
  return {
    slug: m.slug,
    title: m.title,
    year: m.year,
    excerpt: m.excerpt,
    medium: m.medium,
    materials: m.materials,
    video: 'video' in m ? (m.video as ProjectVideo) : undefined,
    hero: image(m.slug, 'hero', m.heroAlt),
    thumb: image(m.slug, 'thumb', m.heroAlt),
    gallery: gallery(m.slug, m.title),
    galleryCaption: 'galleryCaption' in m ? m.galleryCaption : undefined,
    links: 'links' in m ? m.links : undefined,
    funders: 'funders' in m ? m.funders : undefined,
    venues: 'venues' in m ? m.venues : undefined,
    featured: 'featured' in m ? (m.featured ?? false) : false,
    Body,
  }
})

export const bySlug: Record<string, Project> = Object.fromEntries(
  projects.map((p) => [p.slug, p]),
)

export const featured: Project[] = projects.filter((p) => p.featured)

/** Old Jekyll URLs that moved */
export const LEGACY_SLUGS: Record<string, string> = {
  'tidal-hybrid-interactive-visualizer': 'bev-deconstructed',
}
