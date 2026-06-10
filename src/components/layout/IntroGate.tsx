import { useEffect, useRef } from 'react'
import { audioEngine } from '@/audio/engine'
import { useAppStore } from '@/store/app'
import { scrollControl } from '@/lib/SmoothScroll'
import styles from './IntroGate.module.css'

/**
 * First-load overlay (per session). Its click doubles as the autoplay-policy
 * gesture for starting the soundscape. Esc = enter muted.
 */
export function IntroGate() {
  const introDismissed = useAppStore((s) => s.introDismissed)
  const dismissIntro = useAppStore((s) => s.dismissIntro)
  const setAudioOn = useAppStore((s) => s.setAudioOn)
  const soundButton = useRef<HTMLButtonElement>(null)

  const enter = (withSound: boolean) => {
    if (withSound) {
      audioEngine.start()
      setAudioOn(true)
    }
    dismissIntro()
  }

  useEffect(() => {
    if (introDismissed) return
    scrollControl.lenis?.stop()
    document.body.style.overflow = 'hidden'
    soundButton.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') enter(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      scrollControl.lenis?.start()
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introDismissed])

  if (introDismissed) return null

  return (
    <div
      className={styles.gate}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
    >
      <div className={styles.inner}>
        <p className="label-mono">Alex MacLean · Immersive Media Artist</p>
        <h2 id="intro-title" className={`${styles.title} display-xl`}>
          This site is a small{' '}
          <em className="display-italic">audiovisual piece</em>
        </h2>
        <p className={styles.note}>
          A generative ocean — best experienced with sound.
        </p>
        <div className={styles.actions}>
          <button
            ref={soundButton}
            type="button"
            className={`${styles.button} ${styles.primary}`}
            onClick={() => enter(true)}
          >
            Enter with sound
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => enter(false)}
          >
            Enter muted
          </button>
        </div>
        <p className={`${styles.esc} label-mono`}>Esc — enter muted</p>
      </div>
    </div>
  )
}
