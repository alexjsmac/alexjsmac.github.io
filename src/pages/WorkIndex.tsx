import { useEffect, useRef } from 'react'
import { Link } from 'wouter'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { Meta } from '@/components/ui/Meta'
import { Picture } from '@/components/ui/Picture'
import { projects } from '@/data/projects'
import { useReducedMotion } from '@/lib/useReducedMotion'
import seo from '@/data/seo.json'
import styles from './WorkIndex.module.css'

gsap.registerPlugin(SplitText)

export default function WorkIndex() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()

  // Hover ripple: each row title runs a quick per-character wave, like a
  // line of type disturbed by a passing wake. Fine pointers only.
  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return
    const list = listRef.current
    if (!list) return

    const splits: SplitText[] = []
    const bound: Array<[Element, () => void]> = []
    let cancelled = false

    void document.fonts.ready.then(() => {
      if (cancelled) return
      for (const link of list.querySelectorAll('a[data-thumb]')) {
        const title = link.querySelector('[data-split]')
        if (!title) continue
        const split = SplitText.create(title, { type: 'chars' })
        splits.push(split)
        const onEnter = () => {
          gsap.killTweensOf(split.chars)
          gsap.fromTo(
            split.chars,
            { yPercent: 0 },
            {
              yPercent: -16,
              duration: 0.16,
              ease: 'power2.out',
              stagger: { each: 0.011 },
              yoyo: true,
              repeat: 1,
            },
          )
        }
        link.addEventListener('pointerenter', onEnter)
        bound.push([link, onEnter])
      }
    })

    return () => {
      cancelled = true
      for (const [link, fn] of bound) {
        link.removeEventListener('pointerenter', fn)
      }
      for (const split of splits) split.revert()
    }
  }, [reduced])

  return (
    <>
      <Meta path="/work" {...seo['/work']} />
      <section className={styles.page}>
        <div className="container">
          <header className={styles.header}>
            <p className="label-mono">Index</p>
            <h1 className="display-hero">Work</h1>
            <p className={`${styles.count} label-mono`}>
              {projects.length} pieces · 2019 — {projects[0]?.year}
            </p>
          </header>

          <ol ref={listRef} className={styles.list}>
            {projects.map((project, i) => (
              <li key={project.slug} className={styles.row} data-st>
                <Link
                  href={`/work/${project.slug}`}
                  className={styles.rowLink}
                  data-cursor="view"
                  data-thumb={project.thumb.src}
                  data-preview={`${project.medium} · ${project.year}`}
                >
                  <span className={`${styles.rowIndex} label-mono`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.rowTitle} data-split>
                    {project.title}
                  </span>
                  <span className={`${styles.rowMeta} label-mono`}>
                    {project.medium}
                  </span>
                  <span className={`${styles.rowYear} label-mono`}>
                    {project.year}
                  </span>
                  <span className={styles.rowThumb} aria-hidden="true">
                    <Picture image={project.thumb} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
