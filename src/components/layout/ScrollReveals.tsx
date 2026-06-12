import { useEffect } from 'react'
import { useLocation } from 'wouter'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/lib/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll choreography, re-bound on every route:
 * - [data-st] elements rise into view once as they enter the viewport
 * - [data-parallax] wrappers (oversized image shells) drift slowly against
 *   the scroll for depth on work cards
 * Skipped wholesale under prefers-reduced-motion.
 */
export function ScrollReveals() {
  const [location] = useLocation()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const main = document.getElementById('main')
    if (!main) return

    const ctx = gsap.context(() => {
      for (const el of gsap.utils.toArray<HTMLElement>('[data-st]')) {
        // opacity (not autoAlpha): visibility:hidden would remove the
        // content from the accessibility tree until scrolled into view
        gsap.from(el, {
          opacity: 0,
          y: 26,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      }

      for (const el of gsap.utils.toArray<HTMLElement>('[data-parallax]')) {
        gsap.fromTo(
          el,
          { yPercent: -2.8 },
          {
            yPercent: 2.8,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      }
    }, main)

    // Re-measure once fonts/media have settled
    const timer = setTimeout(() => ScrollTrigger.refresh(), 450)
    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [location, reduced])

  return null
}
