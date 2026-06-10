import { Link } from 'wouter'
import { profile } from '@/data/profile'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <p className={`${styles.invite} display-lg`}>
            Surfacing?{' '}
            <Link href="/contact" className={`${styles.inviteLink} display-italic`}>
              Let’s talk.
            </Link>
          </p>
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
      </div>
    </footer>
  )
}
