import { Link } from 'wouter'
import { Meta } from '@/components/ui/Meta'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { featured, projects } from '@/data/projects'
import { profile } from '@/data/profile'
import seo from '@/data/seo.json'
import murmurationLoop from '@/assets/murmuration/loop.webm'
import murmurationPoster from '@/assets/murmuration/poster.webp'
import styles from './Home.module.css'

interface PracticeRow {
  index: string
  title: string
  href: string
  external?: boolean
  secondary?: { label: string; href: string }
}

const PRACTICE: PracticeRow[] = [
  {
    index: '01',
    title: 'Installations & projection mapping',
    href: '/work',
  },
  {
    index: '02',
    title: 'Live A/V performance as “Sunntack”',
    href: 'https://linktr.ee/alexjsmac',
    external: true,
    secondary: {
      label: 'SoundCloud',
      href: 'https://soundcloud.com/xanderjohnscott',
    },
  },
  {
    index: '03',
    title: 'Creative technology — BluHeron Interactive',
    href: 'https://bluheroninteractive.com',
    external: true,
  },
]

function PracticeRowItem({ row }: { row: PracticeRow }) {
  const inner = (
    <>
      <span className={`${styles.practiceIndex} label-mono`}>{row.index}</span>
      <span className={styles.practiceTitle}>{row.title}</span>
      <span className={`${styles.practiceArrow} label-mono`} aria-hidden="true">
        {row.external ? '↗' : '→'}
      </span>
    </>
  )
  return (
    <li className={styles.practiceRow}>
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
      {row.secondary && (
        <a
          href={row.secondary.href}
          target="_blank"
          rel="noreferrer"
          className={`${styles.practiceSecondary} label-mono`}
        >
          {row.secondary.label} ↗
        </a>
      )}
    </li>
  )
}

export default function Home() {
  const reduced = useReducedMotion()

  return (
    <>
      <Meta path="/" {...seo['/']} />

      {/* Surface */}
      <section className={styles.hero}>
        <div className="container">
          <p className={`${styles.roles} label-mono`} data-reveal>
            {profile.roles.join(' / ')}
          </p>
          <h1 className={`${styles.name} display-hero`}>
            Alex <em className="display-italic">MacLean</em>
          </h1>
          <p className={`${styles.location} label-mono`} data-reveal>
            {profile.location} · “{profile.alias}”
          </p>
        </div>
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
          <p className={`${styles.practiceLede} display-lg measure`}>
            Sound, light, and code —{' '}
            <em className="display-italic">experiences that listen back.</em>
          </p>
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
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Murmuration — live now */}
      <section
        className={styles.murmuration}
        aria-labelledby="murmuration-heading"
      >
        <div className="container">
          <a
            href="https://murmuration-app.web.app/promo/"
            target="_blank"
            rel="noreferrer"
            className={styles.murmurationCard}
            data-cursor="view"
          >
            <span className={styles.murmurationMedia}>
              {reduced ? (
                <img
                  src={murmurationPoster}
                  width={640}
                  height={640}
                  alt="Murmuration — a neon wireframe sphere from the live visual installation"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <video
                  src={murmurationLoop}
                  poster={murmurationPoster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Looping recording of the Murmuration live visual"
                />
              )}
            </span>
            <span className={styles.murmurationBody}>
              <span className="label-mono">
                Live visual installation · BluHeron Interactive
              </span>
              <span
                id="murmuration-heading"
                className={`${styles.murmurationTitle} display-xl`}
              >
                Murmuration
              </span>
              <span className={styles.murmurationText}>
                A live visual installation, co-created by everyone in the room
                — each phone places into a shared, evolving scene.
              </span>
              <span className={`${styles.murmurationLink} label-mono`}>
                See the live promo ↗
              </span>
            </span>
          </a>
        </div>
      </section>
    </>
  )
}
