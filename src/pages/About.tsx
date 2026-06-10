import { Meta } from '@/components/ui/Meta'
import { profile } from '@/data/profile'
import seo from '@/data/seo.json'
import manifest from '@/data/image-manifest.json'
import headshotSrc from '@/assets/about/headshot.webp'
import styles from './About.module.css'

export default function About() {
  return (
    <>
      <Meta path="/about" {...seo['/about']} />
      <section className={styles.page}>
        <div className="container">
          <header className={styles.header}>
            <p className="label-mono">About</p>
            <h1 className="display-hero">
              Art <em className="display-italic">×</em> Technology
            </h1>
          </header>

          <div className={styles.layout}>
            <div className={styles.portrait}>
              <img
                src={headshotSrc}
                width={manifest.about.headshot.width}
                height={manifest.about.headshot.height}
                alt="Portrait of Alex MacLean"
                loading="eager"
                decoding="async"
              />
              <p className={`${styles.portraitCaption} label-mono`}>
                {profile.name} · “{profile.alias}” · {profile.location}
              </p>
            </div>

            <div className={styles.bio}>
              {profile.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className={styles.bioPara}>
                  {paragraph}
                </p>
              ))}

              <div className={styles.blocks}>
                <section className={styles.block}>
                  <h2 className="label-mono">Recognition</h2>
                  <ul className={styles.blockList}>
                    {profile.recognition.map((r) => (
                      <li key={r.title}>
                        <span className={styles.blockTitle}>{r.title}</span>
                        <span className={`${styles.blockDetail} label-mono`}>
                          {r.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className={styles.block}>
                  <h2 className="label-mono">Supported by</h2>
                  <ul className={styles.blockList}>
                    {profile.funders.map((f) => (
                      <li key={f} className={styles.blockTitle}>
                        {f}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className={styles.block}>
                  <h2 className="label-mono">Studio</h2>
                  <p className={styles.blockTitle}>
                    {profile.bluheron.role} of{' '}
                    <a
                      href={profile.bluheron.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.inlineLink}
                    >
                      {profile.bluheron.name}
                    </a>
                  </p>
                </section>
              </div>

              <a href={profile.cvUrl} className={`${styles.cv} label-mono`}>
                Download C.V. (PDF) ↓
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
