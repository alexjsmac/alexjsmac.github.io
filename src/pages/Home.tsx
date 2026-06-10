import { Link } from 'wouter'
import { Meta } from '@/components/ui/Meta'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { featured, bySlug, projects } from '@/data/projects'
import { profile } from '@/data/profile'
import seo from '@/data/seo.json'
import styles from './Home.module.css'

export default function Home() {
  const terminalTaxonomy = bySlug['terminal-taxonomy']

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

      {/* Statement */}
      <section className={styles.statement}>
        <div className="container">
          <p className={`${styles.statementText} display-lg measure`}>
            Sound becomes a conduit for storytelling — installations,
            performances, and instruments that listen back. Work at the
            crossroads of <em className="display-italic">art</em> and{' '}
            <em className="display-italic">technology</em>.
          </p>
          <Link href="/about" className={`${styles.statementLink} label-mono`}>
            More about Alex →
          </Link>
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

      {/* Music / Sunntack */}
      <section className={styles.music} aria-labelledby="music-heading">
        <div className="container">
          <p className="label-mono">Music</p>
          <h2 id="music-heading" className={`${styles.musicTitle} display-xl`}>
            Performing as{' '}
            <em className="display-italic">{profile.alias}</em>
          </h2>
          <p className={`${styles.musicText} measure`}>
            Live audiovisual sets where modular synthesis, custom vocal
            processing, and generative visuals share one nervous system.
          </p>
          {terminalTaxonomy && (
            <div className={styles.musicVideo}>
              <VideoEmbed
                video={terminalTaxonomy.video}
                poster={terminalTaxonomy.hero}
                title={terminalTaxonomy.title}
              />
              <Link
                href={`/work/${terminalTaxonomy.slug}`}
                className={`${styles.musicVideoLink} label-mono`}
              >
                {terminalTaxonomy.title} ({terminalTaxonomy.year}) →
              </Link>
            </div>
          )}
          <ul className={styles.musicLinks}>
            <li>
              <a
                href={profile.music.linktree}
                target="_blank"
                rel="noreferrer"
                className={`${styles.musicLink} label-mono`}
              >
                Listen / follow — Linktree
              </a>
            </li>
            <li>
              <a
                href={profile.music.soundcloud}
                target="_blank"
                rel="noreferrer"
                className={`${styles.musicLink} label-mono`}
              >
                SoundCloud
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
