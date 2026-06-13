import { useState } from 'react'
import { Link } from 'wouter'
import { Meta } from '@/components/ui/Meta'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { BandcampEmbed } from '@/components/ui/BandcampEmbed'
import { bySlug } from '@/data/projects'
import { sunntack } from '@/data/sunntack'
import seo from '@/data/seo.json'
import styles from './Sunntack.module.css'

function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle')
  // Clipboard API needs a secure context; hide a dead control otherwise
  if (typeof navigator === 'undefined' || !navigator.clipboard) return null
  return (
    <button
      type="button"
      className={`${styles.copy} label-mono`}
      onClick={() => {
        navigator.clipboard
          .writeText(text)
          .then(() => setState('ok'))
          .catch(() => setState('fail'))
          .finally(() => setTimeout(() => setState('idle'), 2000))
      }}
    >
      {state === 'ok' ? 'Copied ✓' : state === 'fail' ? 'Copy failed' : label}
    </button>
  )
}

export default function Sunntack() {
  const currentWork = bySlug[sunntack.currentSet.workSlug]

  return (
    <>
      <Meta path="/sunntack" {...seo['/sunntack']} />
      <article className={styles.page}>
        <div className="container">
          {/* Identity */}
          <header className={styles.header}>
            <p className="label-mono" data-reveal>
              Live A/V · Electronic press kit
            </p>
            <h1 className="display-hero">
              Sunn<em className="display-italic">tack</em>
            </h1>
            <p className={`${styles.oneLiner} body-lg measure`} data-reveal>
              {sunntack.oneLiner}
            </p>
            <p className={`${styles.locationLine} label-mono`} data-reveal>
              {sunntack.location}
            </p>
          </header>

          {/* Album callout */}
          <a
            href={sunntack.album.href}
            target="_blank"
            rel="noreferrer"
            className={styles.album}
            data-st
          >
            <span className="label-mono">{sunntack.album.label}</span>
            <span className={`${styles.albumTitle} display-lg`}>
              <em className="display-italic">{sunntack.album.title}</em>
            </span>
            <span className={styles.albumDescription}>
              {sunntack.album.description}
            </span>
            <span className={`${styles.albumDetail} label-mono`}>
              {sunntack.album.detail} Linktree ↗
            </span>
            <span className={`${styles.albumSupport} label-mono`}>
              {sunntack.album.support}
            </span>
          </a>

          {/* Listen — the single that's out now */}
          <section className={styles.section} aria-labelledby="epk-listen">
            <h2 id="epk-listen" className="label-mono" data-st>
              Listen — out now
            </h2>
            <div className={styles.listen} data-st>
              <BandcampEmbed
                trackId={sunntack.listen.trackId}
                title={sunntack.listen.trackTitle}
                meta={sunntack.listen.meta}
              />
              <a
                href={sunntack.listen.href}
                target="_blank"
                rel="noreferrer"
                className={`${styles.inlineLink} label-mono`}
              >
                Full release on Bandcamp ↗
              </a>
            </div>
          </section>

          {/* Watch */}
          <section className={styles.section} aria-labelledby="epk-watch">
            <h2 id="epk-watch" className="label-mono" data-st>
              Watch — the current set
            </h2>
            {currentWork?.video && (
              <div className={styles.video} data-st>
                <VideoEmbed
                  video={currentWork.video}
                  poster={currentWork.hero}
                  title={currentWork.title}
                />
              </div>
            )}
            <div className={styles.watchBody} data-st>
              <p className={styles.prose}>{sunntack.currentSet.description}</p>
              <div className={styles.watchLinks}>
                <Link
                  href={`/work/${sunntack.currentSet.workSlug}`}
                  className={`${styles.inlineLink} label-mono`}
                >
                  About {sunntack.currentSet.title} →
                </Link>
              </div>
            </div>
          </section>

          {/* Live history */}
          <section className={styles.section} aria-labelledby="epk-live">
            <h2 id="epk-live" className="label-mono" data-st>
              Live
            </h2>
            <ul className={styles.shows}>
              {sunntack.shows.map((show) => (
                <li
                  key={`${show.date}-${show.title}`}
                  className={styles.show}
                  data-st
                >
                  <span className={`${styles.showDate} label-mono`}>
                    {show.date}
                  </span>
                  <span className={styles.showBody}>
                    <span className={styles.showTitle}>{show.title}</span>
                    <span className={`${styles.showVenue} label-mono`}>
                      {show.venue}
                      {show.note ? ` · ${show.note}` : ''}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Press photos */}
          <section className={styles.section} aria-labelledby="epk-photos">
            <h2 id="epk-photos" className="label-mono" data-st>
              Press photos
            </h2>
            <p className={`${styles.sectionNote} label-mono`} data-st>
              Click any photo for the print-quality original
            </p>
            <div className={styles.photoGrid}>
              {sunntack.photos.map((p) => (
                <a
                  key={p.download}
                  href={p.download}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.photoLink}
                  data-st
                >
                  <img
                    src={p.src}
                    width={p.width}
                    height={p.height}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              ))}
            </div>
          </section>

          {/* Bio */}
          <section className={styles.section} aria-labelledby="epk-bio">
            <h2 id="epk-bio" className="label-mono" data-st>
              Bio
            </h2>
            <div className={styles.bio} data-st>
              <p className={`${styles.prose} measure`}>{sunntack.bio}</p>
              <div className={styles.bioActions}>
                <CopyButton text={sunntack.bio} label="Copy bio" />
                <Link href="/about" className={`${styles.inlineLink} label-mono`}>
                  Full artist bio →
                </Link>
              </div>
            </div>
          </section>

          {/* Booking */}
          <section className={styles.section} aria-labelledby="epk-booking">
            <h2 id="epk-booking" className="label-mono" data-st>
              Booking & links
            </h2>
            <div className={styles.bookingRow} data-st>
              <Link href="/contact" className={`${styles.pill} ${styles.pillSolid} label-mono`}>
                Booking inquiries →
              </Link>
              {sunntack.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.inlineLink} label-mono`}
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  )
}
