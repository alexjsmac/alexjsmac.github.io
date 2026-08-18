import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/lib/useReducedMotion'
import styles from './HoverPreview.module.css'

/**
 * Cursor-following preview for work-index rows. Any link with a
 * [data-thumb] attribute gets a floating image on fine-pointer devices;
 * [data-preview] fills the caption chip. Rows crossfade between two
 * stacked images, and pointer velocity tilts the frame like a print
 * being carried through water.
 */
export function HoverPreview() {
  const reduced = useReducedMotion()
  const box = useRef<HTMLDivElement>(null)
  const imgA = useRef<HTMLImageElement>(null)
  const imgB = useRef<HTMLImageElement>(null)
  const chip = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return
    const el = box.current
    const a = imgA.current
    const b = imgB.current
    if (!el || !a || !b) return

    const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })
    const rot = gsap.quickTo(el, 'rotation', {
      duration: 0.55,
      ease: 'power2.out',
    })

    let visible = false
    let front = a
    let currentSrc = ''
    let lastX = 0
    let lastT = 0
    let settle: ReturnType<typeof setTimeout> | null = null

    const onMove = (e: PointerEvent) => {
      x(e.clientX + 28)
      y(e.clientY - 110)
      const now = performance.now()
      const dt = Math.max(now - lastT, 1)
      const vx = (e.clientX - lastX) / dt
      lastX = e.clientX
      lastT = now
      rot(gsap.utils.clamp(-9, 9, vx * 9))
      if (settle) clearTimeout(settle)
      settle = setTimeout(() => rot(0), 90)
    }

    const onOver = (e: PointerEvent) => {
      const link = (e.target as Element).closest?.('[data-thumb]')
      const src = link?.getAttribute('data-thumb')
      if (src) {
        if (src !== currentSrc) {
          currentSrc = src
          const back = front === a ? b : a
          back.src = src
          gsap.set(back, { zIndex: 2, opacity: 0 })
          gsap.set(front, { zIndex: 1 })
          gsap.to(back, { opacity: 1, duration: 0.28, ease: 'power1.out' })
          front = back
        }
        if (chip.current) {
          chip.current.textContent = link?.getAttribute('data-preview') ?? ''
        }
        if (!visible) {
          visible = true
          gsap.to(el, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          })
        }
      } else if (visible) {
        visible = false
        gsap.to(el, {
          autoAlpha: 0,
          scale: 0.92,
          duration: 0.25,
          ease: 'power2.in',
        })
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      if (settle) clearTimeout(settle)
    }
  }, [reduced])

  return (
    <div ref={box} className={styles.preview} aria-hidden="true">
      <img ref={imgA} alt="" className={styles.image} />
      <img ref={imgB} alt="" className={styles.image} />
      <span ref={chip} className={`${styles.chip} label-mono`} />
    </div>
  )
}
