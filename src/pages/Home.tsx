import { Link } from 'wouter'
import { Meta } from '@/components/ui/Meta'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { featured, projects, type ProjectImage } from '@/data/projects'
import { profile } from '@/data/profile'
import seo from '@/data/seo.json'
import manifest from '@/data/image-manifest.json'
import ttLiveBlue from '@/assets/stills/tt-live-blue.webp'
import ttCrowd from '@/assets/stills/tt-crowd.webp'
import ccFacade from '@/assets/stills/cc-facade.webp'
import styles from './Home.module.css'

interface Dim {
  width: number
  height: number
}
const stillDims = manifest.stills as Record<string, Dim>

function still(name: string, src: string, alt: string): ProjectImage {
  const dim = stillDims[name]
  if (!dim) throw new Error(`Missing still "${name}" — run npm run migrate`)
  return { src, ...dim, alt }
}

/** Film stills — each image appears exactly once on this page */
const HERO_STILL = still(
  'tt-live-blue',
  ttLiveBlue,
  'Alex MacLean performing Terminal Taxonomy live — bathed in electric blue light at the modular rig, neon bars in haze',
)
const CARD_STILLS: Record<string, ProjectImage> = {
  'terminal-taxonomy': still(
    'tt-crowd',
    ttCrowd,
    'The crowd at Terminal Taxonomy, silhouetted against the projection and LED triangles',
  ),
  'concrete-canopy': still(
    'cc-facade',
    ccFacade,
    'The Kingsmill’s façade wrapped floor-to-roof in botanical projection at night',
  ),
}

interface PracticeRow {
  index: string
  title: string
  description: string
  href: string
  external?: boolean
}

const PRACTICE: PracticeRow[] = [
  {
    index: '01',
    title: 'Installations & projection mapping',
    description:
      'Interactive installations, public-scale projection, and VR sound art — from gallery rooms to building façades.',
    href: '/work',
  },
  {
    index: '02',
    title: 'Live A/V performance as “Sunntack”',
    description:
      'Improvised sets where modular synthesis, vocal transcription systems, and synthesized light behave as one instrument.',
    href: '/sunntack',
  },
  {
    index: '03',
    title: 'Creative technology — BluHeron Interactive',
    description:
      'Technical art direction and software for studios, museums, and events — real-time graphics, web, and immersive systems.',
    href: 'https://bluheroninteractive.com',
    external: true,
  },
]

function PracticeRowItem({ row }: { row: PracticeRow }) {
  const inner = (
    <>
      <span className={`${styles.practiceIndex} label-mono`}>{row.index}</span>
      <span className={styles.practiceBody}>
        <span className={styles.practiceTitle}>{row.title}</span>
        <span className={styles.practiceDescription}>{row.description}</span>
      </span>
      <span className={`${styles.practiceArrow} label-mono`} aria-hidden="true">
        {row.external ? '↗' : '→'}
      </span>
    </>
  )
  return (
    <li className={styles.practiceRow} data-st>
      {row.external ? (
        <a
          href={row.href}
          target="_blank"
          rel="noreferrer"
          className={styles.practiceLink}
        >
          {inner}
        </a>
      ) : (
        <Link href={row.href} className={styles.practiceLink}>
          {inner}
        </Link>
      )}
    </li>
  )
}

export default function Home() {
  return (
    <>
      <Meta path="/" {...seo['/']} />

      {/* Surface — one knockout frame, fused with the ocean */}
      <section className={styles.hero}>
        <div className={styles.heroMedia} aria-hidden="true">
          <img
            src={HERO_STILL.src}
            width={HERO_STILL.width}
            height={HERO_STILL.height}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <span className={styles.heroGrain} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <p className={`${styles.roles} label-mono`} data-reveal>
            {profile.roles.join(' / ')}
          </p>
          <h1 className={`${styles.name} display-hero`}>
            Alex <em className="display-italic">MacLean</em>
          </h1>
          <p className={`${styles.positioning} body-lg`} data-reveal>
            Sound, light, and code —{' '}
            <em className="display-italic">experiences that listen back.</em>
          </p>
          {profile.now && (
            <p className={`${styles.now} label-mono`} data-reveal>
              <span className={styles.nowLabel}>{profile.now.label}</span>
              <Link href={profile.now.href} className={styles.nowLink}>
                {profile.now.text} →
              </Link>
            </p>
          )}
        </div>

        <Link
          href="/work/terminal-taxonomy"
          className={`${styles.heroCaption} label-mono`}
        >
          Terminal Taxonomy — live at Honey Dip Bar, 2026 →
        </Link>

        <p className={`${styles.descend} label-mono`} aria-hidden="true">
          Descend
          <span className={styles.descendLine} />
        </p>
      </section>

      {/* Practice */}
      <section className={styles.practice} aria-labelledby="practice-heading">
        <div className="container">
          <h2 id="practice-heading" className="label-mono">
            The practice
          </h2>
          <ul className={styles.practiceList}>
            {PRACTICE.map((row) => (
              <PracticeRowItem key={row.index} row={row} />
            ))}
          </ul>
        </div>
      </section>

      {/* Selected works */}
      <section className={styles.works} aria-labelledby="selected-works">
        <div className="container">
          <header className={styles.worksHeader}>
            <h2 id="selected-works" className="label-mono">
              Selected works
            </h2>
            <Link href="/work" className={`${styles.allLink} label-mono`}>
              All work ({String(projects.length).padStart(2, '0')}) →
            </Link>
          </header>
          <div className={styles.worksGrid}>
            {featured.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                image={CARD_STILLS[project.slug]}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
