import { Meta } from '@/components/ui/Meta'
import { profile } from '@/data/profile'
import seo from '@/data/seo.json'
import styles from './Contact.module.css'

export default function Contact() {
  return (
    <>
      <Meta path="/contact" {...seo['/contact']} />
      <section className={styles.page}>
        <div className="container">
          <p className="label-mono">Contact · 4000m</p>
          <h1 className={`${styles.title} display-hero`}>
            Let’s make something{' '}
            <em className="display-italic">resonant</em>
          </h1>
          <p className={`${styles.note} body-lg measure`}>
            {profile.contactNote}
          </p>
          <p className={`${styles.availability} measure`}>
            Available for installations, live A/V performance, and creative
            technology development — as a technical artist or software
            developer.
          </p>

          <ul className={styles.links} aria-label="Contact links">
            {profile.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  <span className={styles.linkLabel}>{social.label}</span>
                  <span className={`${styles.linkArrow} label-mono`}>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
