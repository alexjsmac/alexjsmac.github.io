import { useEffect, useRef } from 'react'
import { useLocation } from 'wouter'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useReducedMotion } from '@/lib/useReducedMotion'

gsap.registerPlugin(SplitText)

/**
 * Route choreography:
 * - intercepts internal link clicks for a short exit (fade + sink),
 * - on every location change, raises the new page with a SplitText
 *   line-mask reveal on its h1 — lines rise like bubbles,
 * - moves focus to the new page's h1 for assistive tech.
 */
export function PageTransition() {
  const [location, navigate] = useLocation()
  const reduced = useReducedMotion()
  const transitioning = useRef(false)
  const prevLocation = useRef<string | null>(null)

  // Exit: intercept internal navigation clicks
  useEffect(() => {
    if (reduced) return
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return
      const anchor = (e.target as Element).closest?.(
        'a[href^="/"]:not([target]):not([download])',
      )
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('/cv.pdf')) return
      const current = window.location.pathname
      if (href === current) return
      e.preventDefault()
      if (transitioning.current) return
      transitioning.current = true
      gsap.to('#main', {
        autoAlpha: 0,
        y: -16,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          navigate(href)
          transitioning.current = false
        },
      })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate, reduced])

  // Enter: reveal the new page
  useEffect(() => {
    const main = document.getElementById('main')
    const h1 = main?.querySelector('h1')

    // Focus for screen readers / keyboard users — only on real route
    // changes (location-compare survives StrictMode effect replays).
    // Deferred: the enter animation starts the page at visibility:hidden,
    // and focus is a no-op inside a hidden subtree.
    const isNavigation =
      prevLocation.current !== null && prevLocation.current !== location
    prevLocation.current = location
    if (isNavigation && h1) {
      h1.setAttribute('tabindex', '-1')
      setTimeout(() => h1.focus({ preventScroll: true }), 120)
    }

    if (reduced) return
    if (!main) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        main,
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' },
      )

      if (h1) {
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
            delay: 0.08,
            onComplete: () => split.revert(),
          })
        })
      }

      const reveals = main.querySelectorAll('[data-reveal]')
      if (reveals.length > 0) {
        gsap.fromTo(
          reveals,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.07,
            delay: 0.15,
            ease: 'power2.out',
          },
        )
      }
    })

    return () => ctx.revert()
  }, [location, reduced])

  return null
}
