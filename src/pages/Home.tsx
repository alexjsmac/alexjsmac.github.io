import { Link } from 'wouter'
import { Meta } from '@/components/ui/Meta'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { featured, projects } from '@/data/projects'
import { profile } from '@/data/profile'
import seo from '@/data/seo.json'
import styles from './Home.module.css'

interface PracticeRow {
  index: string
  title: string
  href: string
  external?: boolean
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
    href: '/sunntack',
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
          {profile.now && (
            <p className={`${styles.now} label-mono`} data-reveal>
              <span className={styles.nowLabel}>{profile.now.label}</span>
              <Link href={profile.now.href} className={styles.nowLink}>
                {profile.now.text} →
              </Link>
            </p>
          )}
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
          <p className={`${styles.practiceLede} display-lg measure`} data-st>
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
    </>
  )
}
