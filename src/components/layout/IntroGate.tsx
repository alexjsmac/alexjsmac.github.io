import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { audioEngine } from '@/audio/engine'
import { useAppStore } from '@/store/app'
import { scrollControl } from '@/lib/SmoothScroll'
import { useReducedMotion } from '@/lib/useReducedMotion'
import styles from './IntroGate.module.css'

gsap.registerPlugin(SplitText)

/**
 * First-visit overlay — the site's title card. Its click doubles as the
 * autoplay-policy gesture for starting the soundscape. Esc = enter muted.
 * The choice is remembered across visits; dismissal is choreographed:
 * the card sinks, the ocean surfaces, and the page h1 re-reveals.
 */
export function IntroGate() {
  const introDismissed = useAppStore((s) => s.introDismissed)
  const dismissIntro = useAppStore((s) => s.dismissIntro)
  const setAudioOn = useAppStore((s) => s.setAudioOn)
  const reduced = useReducedMotion()
  const gate = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const soundButton = useRef<HTMLButtonElement>(null)
  const exiting = useRef(false)

  const enter = (withSound: boolean) => {
    if (exiting.current) return
    if (withSound) {
      audioEngine.start()
      setAudioOn(true)
    }
    if (reduced || !gate.current || !inner.current) {
      dismissIntro()
      return
    }
    exiting.current = true

    // Sink the card, lift the veil, then chain the page h1 reveal so the
    // first scene of the site flows out of the visitor's own gesture.
    const tl = gsap.timeline({ onComplete: dismissIntro })
    tl.to(inner.current, {
      autoAlpha: 0,
      y: 34,
      duration: 0.45,
      ease: 'power2.in',
    })
    tl.to(
      gate.current,
      { autoAlpha: 0, duration: 0.65, ease: 'power1.inOut' },
      '-=0.2',
    )
    tl.add(() => {
      // An audible answer to the gesture once the mix is fading in
      if (withSound) audioEngine.ping()
      const h1 = document.querySelector('#main h1')
      if (!h1) return
      void document.fonts.ready.then(() => {
        const split = SplitText.create(h1, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'reveal-line',
        })
        gsap.from(split.lines, {
          yPercent: 115,
          duration: 0.8,
          stagger: 0.09,
          ease: 'power3.out',
          onComplete: () => split.revert(),
        })
      })
    }, '-=0.35')
  }

  useEffect(() => {
    if (introDismissed) return
    scrollControl.lenis?.stop()
    document.body.style.overflow = 'hidden'
    soundButton.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        enter(false)
        return
      }
      // Trap Tab within the modal so focus can't reach the (aria-hidden)
      // page behind it.
      if (e.key !== 'Tab' || !gate.current) return
      const focusables = gate.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (!first || !last) return
      const active = document.activeElement
      if (e.shiftKey && (active === first || !gate.current.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !gate.current.contains(active))) {
        e.preventDefault()
        first.focus()
      }
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
      ref={gate}
      className={styles.gate}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
    >
      <div ref={inner} className={styles.inner}>
        <p className="label-mono">Alex MacLean · Immersive Media Artist</p>
        <h2 id="intro-title" className={`${styles.title} display-xl`}>
          This site is a small{' '}
          <em className="display-italic">audiovisual piece</em>
        </h2>
        <p className={styles.note}>Best experienced with sound.</p>
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
            className={styles.mutedLink}
            onClick={() => enter(false)}
          >
            or enter muted
          </button>
        </div>
        <p className={`${styles.esc} label-mono`}>Esc — enter muted</p>
      </div>
    </div>
  )
}
