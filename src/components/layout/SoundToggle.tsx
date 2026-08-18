import { useEffect, useRef } from 'react'
import { audioEngine } from '@/audio/engine'
import { frameBus } from '@/lib/frameBus'
import { useAppStore } from '@/store/app'
import { useReducedMotion } from '@/lib/useReducedMotion'
import styles from './SoundToggle.module.css'

export function SoundToggle() {
  const audioOn = useAppStore((s) => s.audioOn)
  const setAudioOn = useAppStore((s) => s.setAudioOn)
  const reduced = useReducedMotion()
  const barsRef = useRef<HTMLSpanElement>(null)

  // Live meter: the bars are a real spectrum readout (low/mid/high bands
  // from the frameBus), not a looping animation. Under reduced motion the
  // CSS fallback shows a static "on" state instead.
  useEffect(() => {
    const bars = barsRef.current
    if (!bars) return
    const spans = Array.from(bars.querySelectorAll('span'))
    const reset = () => {
      for (const s of spans) s.style.height = ''
    }
    if (!audioOn || reduced) {
      reset()
      return
    }
    let raf = 0
    const tick = () => {
      const { low, mid, high } = frameBus.audio
      const bands = [low, mid, high]
      for (let i = 0; i < spans.length; i++) {
        spans[i]!.style.height = `${Math.round(24 + bands[i]! * 76)}%`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      reset()
    }
  }, [audioOn, reduced])

  const toggle = () => {
    if (audioOn) {
      audioEngine.stop()
      setAudioOn(false)
    } else {
      audioEngine.start()
      setAudioOn(true)
    }
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-pressed={audioOn}
      aria-label="Toggle sound"
      title={audioOn ? 'Sound on' : 'Sound off'}
    >
      <span
        ref={barsRef}
        className={`${styles.bars} ${audioOn && reduced ? styles.on : ''}`}
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </span>
      <span className={styles.label}>{audioOn ? 'Sound' : 'Muted'}</span>
    </button>
  )
}
