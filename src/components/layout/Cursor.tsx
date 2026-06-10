import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/lib/useReducedMotion'
import styles from './Cursor.module.css'

function finePointer(): boolean {
  return window.matchMedia('(pointer: fine)').matches
}

/**
 * Custom cursor: a dot that sticks to the pointer and a trailing ring that
 * swells over interactive elements ("view" over work links). Fine-pointer
 * devices only; the native cursor is hidden via CSS when mounted.
 */
export function Cursor() {
  const reduced = useReducedMotion()
  const [enabled] = useState(finePointer)
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || reduced) return
    document.documentElement.classList.add('custom-cursor')

    const dotX = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power2.out' })
    const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.35, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.35, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element
      const interactive = t.closest?.(
        'a, button, [role="button"], input, [data-cursor]',
      )
      const view = t.closest?.('[data-cursor="view"]')
      ring.current?.classList.toggle(styles.hover!, !!interactive)
      ring.current?.classList.toggle(styles.view!, !!view)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.documentElement.classList.remove('custom-cursor')
    }
  }, [enabled, reduced])

  if (!enabled || reduced) return null

  return (
    <div aria-hidden="true">
      <div ref={ring} className={styles.ring}>
        <span className={styles.viewLabel}>View</span>
      </div>
      <div ref={dot} className={styles.dot} />
    </div>
  )
}
