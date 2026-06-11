import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { frameBus } from './frameBus'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/** Live Lenis instance, for programmatic scrolls (page transitions). */
export const scrollControl: { lenis: Lenis | null } = { lenis: null }

export function scrollToTop(immediate: boolean) {
  if (scrollControl.lenis) {
    scrollControl.lenis.scrollTo(0, { immediate })
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }
}

/**
 * Mounts Lenis on the document, drives it from gsap's ticker, and mirrors
 * scroll progress into the frameBus. Falls back to native scroll (while
 * still feeding the bus) under prefers-reduced-motion.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    const writeNative = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight
      frameBus.scroll.progress =
        max > 0 ? Math.min(1, window.scrollY / max) : 0
      frameBus.scroll.velocity = 0
    }

    if (reduced) {
      writeNative()
      window.addEventListener('scroll', writeNative, { passive: true })
      return () => window.removeEventListener('scroll', writeNative)
    }

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    })
    scrollControl.lenis = lenis

    lenis.on('scroll', (l: Lenis) => {
      frameBus.scroll.progress = l.progress
      frameBus.scroll.velocity = l.velocity
      ScrollTrigger.update()
    })

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      scrollControl.lenis = null
    }
  }, [reduced])

  return null
}
