import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Magnetic pull: the element leans toward the pointer while hovered
 * (max ~12px) and springs back on leave. Fine pointers only.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35, max = 12) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      xTo(gsap.utils.clamp(-max, max, dx * strength))
      yTo(gsap.utils.clamp(-max, max, dy * strength))
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave, { passive: true })
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength, max])

  return ref
}
