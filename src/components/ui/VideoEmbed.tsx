import { useState } from 'react'
import type { ProjectImage, ProjectVideo } from '@/data/projects'
import { Picture } from './Picture'
import styles from './VideoEmbed.module.css'

const EMBED_ORIGINS: Record<ProjectVideo['provider'], string[]> = {
  vimeo: ['https://player.vimeo.com', 'https://i.vimeocdn.com'],
  youtube: ['https://www.youtube-nocookie.com', 'https://i.ytimg.com'],
}

function embedSrc(video: ProjectVideo): string {
  return video.provider === 'vimeo'
    ? `https://player.vimeo.com/video/${video.id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`
    : `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`
}

const preconnected = new Set<string>()
function preconnect(provider: ProjectVideo['provider']) {
  for (const origin of EMBED_ORIGINS[provider]) {
    if (preconnected.has(origin)) continue
    preconnected.add(origin)
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = origin
    document.head.append(link)
  }
}

interface VideoEmbedProps {
  video: ProjectVideo
  poster: ProjectImage
  title: string
}

/**
 * Click-to-load facade: zero video-provider bytes until the visitor asks for
 * them. The poster is the project's optimized hero image.
 */
export function VideoEmbed({ video, poster, title }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className={styles.frame}>
        <iframe
          className={styles.iframe}
          src={embedSrc(video)}
          title={`${title} — video`}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className={styles.frame}>
      <button
        type="button"
        className={styles.facade}
        onClick={() => setPlaying(true)}
        onPointerEnter={() => preconnect(video.provider)}
        onFocus={() => preconnect(video.provider)}
        aria-label={`Play video: ${title}`}
      >
        <Picture image={poster} className={styles.poster} loading="eager" />
        <span className={styles.scrim} aria-hidden="true" />
        <span className={styles.play} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </span>
        <span className={`${styles.hint} label-mono`} aria-hidden="true">
          Play
        </span>
      </button>
    </div>
  )
}
