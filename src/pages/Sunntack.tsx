import { useState } from 'react'
import { Link } from 'wouter'
import { Meta } from '@/components/ui/Meta'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
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
            <span className={`${styles.albumDetail} label-mono`}>
              {sunntack.album.detail} · Listen ↗
            </span>
          </a>

          {/* Watch */}
          <section className={styles.section} aria-labelledby="epk-watch">
            <h2 id="epk-watch" className="label-mono" data-st>
              Watch — the current set
            </h2>
            {currentWork && (
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
                <a
                  href={sunntack.currentSet.demoHref}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.inlineLink} label-mono`}
                >
                  Watch the short demo cut ↗
                </a>
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

          {/* Bios */}
          <section className={styles.section} aria-labelledby="epk-bios">
            <h2 id="epk-bios" className="label-mono" data-st>
              Bios
            </h2>
            <div className={styles.bioGrid}>
              <div className={styles.bio} data-st>
                <div className={styles.bioHead}>
                  <h3 className="label-mono">Short</h3>
                  <CopyButton text={sunntack.bios.short} label="Copy" />
                </div>
                <p className={styles.prose}>{sunntack.bios.short}</p>
              </div>
              <div className={styles.bio} data-st>
                <div className={styles.bioHead}>
                  <h3 className="label-mono">Long</h3>
                  <CopyButton text={sunntack.bios.long} label="Copy" />
                </div>
                {sunntack.bios.long.split('\n\n').map((para) => (
                  <p key={para.slice(0, 24)} className={styles.prose}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* Tech rider */}
          <section className={styles.section} aria-labelledby="epk-tech">
            <h2 id="epk-tech" className="label-mono" data-st>
              Tech
            </h2>
            <p className={`${styles.prose} measure`} data-st>
              {sunntack.rider.summary}
            </p>
            <a
              href={sunntack.rider.href}
              download
              className={`${styles.pill} label-mono`}
              data-st
            >
              Download tech rider + stage plot (PDF) ↓
            </a>
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
