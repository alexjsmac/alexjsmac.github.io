import type { ReactNode } from 'react'
import styles from './PullQuote.module.css'

/** Editorial display-italic pull quote for project prose. */
export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className={styles.quote} data-st>
      <p className={styles.text}>{children}</p>
    </blockquote>
  )
}
