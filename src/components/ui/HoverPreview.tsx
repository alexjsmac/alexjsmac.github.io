import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/lib/useReducedMotion'
import styles from './HoverPreview.module.css'

/**
 * Cursor-following thumbnail for work-index rows. Any link with a
 * [data-thumb] attribute gets a floating preview on fine-pointer devices.
 */
export function HoverPreview() {
  const reduced = useReducedMotion()
  const box = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return
    const el = box.current
    if (!el) return

    const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })
    let visible = false

    const onMove = (e: PointerEvent) => {
      x(e.clientX + 24)
      y(e.clientY - 90)
    }

    const onOver = (e: PointerEvent) => {
      const link = (e.target as Element).closest?.('[data-thumb]')
      const src = link?.getAttribute('data-thumb')
      if (src && img.current) {
        if (img.current.src !== src) img.current.src = src
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
    }
  }, [reduced])

  return (
    <div ref={box} className={styles.preview} aria-hidden="true">
      <img ref={img} alt="" className={styles.image} />
    </div>
  )
}
