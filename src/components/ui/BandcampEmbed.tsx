import { useState } from 'react'
import styles from './BandcampEmbed.module.css'

interface BandcampEmbedProps {
  /** Numeric Bandcamp item id (from the release's share/embed code) */
  id: string
  /** Release type — albums and tracks use different embed URLs */
  kind: 'track' | 'album'
  title: string
  /** Optional line under the title on the facade, e.g. "Single · 2024" */
  meta?: string
}

function embedSrc(kind: 'track' | 'album', id: string): string {
  // Classic themeable player; transparent so the site's dark bg shows through
  return `https://bandcamp.com/EmbeddedPlayer/${kind}=${id}/size=large/bgcol=0a121c/linkcol=5ef0c8/tracklist=false/artwork=small/transparent=true/`
}

let preconnected = false
function preconnect() {
  if (preconnected) return
  preconnected = true
  for (const origin of ['https://bandcamp.com', 'https://f4.bcbits.com']) {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = origin
    document.head.append(link)
  }
}

/**
 * Click-to-load Bandcamp player: zero third-party bytes until the visitor
 * presses play, mirroring VideoEmbed's facade.
 */
export function BandcampEmbed({ id, kind, title, meta }: BandcampEmbedProps) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        className={styles.player}
        src={embedSrc(kind, id)}
        title={`${title} — Bandcamp player`}
        seamless
      />
    )
  }

  return (
    <button
      type="button"
      className={styles.facade}
      onClick={() => setPlaying(true)}
      onPointerEnter={preconnect}
      onFocus={preconnect}
      aria-label={`Load the Bandcamp player for ${title}`}
    >
      <span className={styles.play} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      </span>
      <span className={styles.facadeText}>
        <span className={styles.facadeTitle}>{title}</span>
        <span className={`${styles.facadeHint} label-mono`}>
          {meta ? `${meta} · ` : ''}Listen on Bandcamp
        </span>
      </span>
    </button>
  )
}
