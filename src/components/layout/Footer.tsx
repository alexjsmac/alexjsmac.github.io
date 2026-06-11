import { Link } from 'wouter'
import { profile } from '@/data/profile'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <Link href="/" className={`${styles.wordmark} display-xl`}>
            Alex <em className="display-italic">MacLean</em>
          </Link>
          <ul className={styles.socials} aria-label="Social links">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.bottom}>
          <p className="label-mono">
            © {new Date().getFullYear()} {profile.name} · {profile.location}
          </p>
          <p className="label-mono">
            {profile.bluheron.role} of{' '}
            <a
              href={profile.bluheron.url}
              target="_blank"
              rel="noreferrer"
              className={styles.bluheron}
            >
              {profile.bluheron.name}
            </a>
          </p>
        </div>
        <p className={`${styles.colophon} label-mono`}>
          This site is itself a small instrument — a generative WebGL ocean
          with a live synthesized soundscape. No templates, no stock.
        </p>
      </div>
    </footer>
  )
}
