import { Link, useLocation } from 'wouter'
import styles from './Header.module.css'

const NAV = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [location] = useLocation()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.wordmark} aria-label="Alex MacLean — home">
          Alex MacLean
        </Link>
        <nav aria-label="Main" className={styles.nav}>
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navLink}
              aria-current={
                location.startsWith(item.href) ? 'page' : undefined
              }
            >
              <span className={styles.navIndex}>0{i + 1}</span>
              {item.label}
            </Link>
          ))}
          <div id="sound-toggle-slot" className={styles.soundSlot} />
        </nav>
      </div>
    </header>
  )
}
