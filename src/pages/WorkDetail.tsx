import { Link } from 'wouter'
import { Meta } from '@/components/ui/Meta'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { Picture } from '@/components/ui/Picture'
import { Gallery } from '@/components/ui/Gallery'
import { projects, bySlug } from '@/data/projects'
import NotFound from './NotFound'
import styles from './WorkDetail.module.css'

export default function WorkDetail({ slug }: { slug: string }) {
  const project = bySlug[slug]
  if (!project) return <NotFound />

  const index = projects.indexOf(project)
  const number = String(index + 1).padStart(2, '0')
  const prev = projects[index - 1]
  // Always offer a next piece — the index wraps so the tour never dead-ends
  const nextIndex = (index + 1) % projects.length
  const next = projects[nextIndex]!
  const Body = project.Body

  return (
    <>
      <Meta
        path={`/work/${project.slug}`}
        title={`${project.title} — Alex MacLean`}
        description={project.excerpt}
        image={`/og/${project.slug}.jpg`}
      />
      <article className={styles.page}>
        <div className="container">
          <header className={styles.header}>
            <span className={styles.ghostIndex} aria-hidden="true">
              {number}
            </span>
            <p className="label-mono">
              {project.medium} · {project.year}
            </p>
            <h1 className={`${styles.title} display-hero`}>{project.title}</h1>
            <p className={`${styles.excerpt} body-lg measure`}>
              {project.excerpt}
            </p>
          </header>
        </div>

        {/* Hero media escapes the text column — the work at full width */}
        <div className={styles.heroBleed}>
          {project.video ? (
            <div className={styles.heroVideo}>
              <VideoEmbed
                video={project.video}
                poster={project.hero}
                title={project.title}
              />
            </div>
          ) : (
            <div className={styles.heroStill}>
              <span className={styles.heroParallax} data-parallax>
                <Picture
                  image={project.hero}
                  loading="eager"
                  className={styles.heroImage}
                />
              </span>
              <span className={styles.heroGrain} aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="container">
          <div className={styles.layout}>
            <aside className={styles.aside}>
              <section className={styles.asideBlock}>
                <h2 className="label-mono">Materials</h2>
                <ul className={styles.materials}>
                  {project.materials.map((m) => (
                    <li key={m} className={styles.material}>
                      {m}
                    </li>
                  ))}
                </ul>
              </section>
              {project.venues && (
                <section className={styles.asideBlock}>
                  <h2 className="label-mono">Shown at</h2>
                  <ul className={styles.asideList}>
                    {project.venues.map((v) => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                </section>
              )}
              {project.funders && (
                <section className={styles.asideBlock}>
                  <h2 className="label-mono">Supported by</h2>
                  <ul className={styles.asideList}>
                    {project.funders.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </section>
              )}
              {project.links && (
                <section className={styles.asideBlock}>
                  <h2 className="label-mono">Links</h2>
                  <ul className={styles.asideList}>
                    {project.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.externalLink}
                        >
                          {link.label} ↗
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </aside>

            <div className={styles.prose}>
              <Body />
            </div>
          </div>

          {project.gallery && (
            <div className={styles.gallery}>
              <Gallery
                images={project.gallery}
                caption={project.galleryCaption}
              />
            </div>
          )}
        </div>

        <nav className={styles.more} aria-label="More work">
          {prev && (
            <div className="container">
              <Link
                href={`/work/${prev.slug}`}
                className={`${styles.prevLink} label-mono`}
                rel="prev"
              >
                ← Previous · {prev.title}
              </Link>
            </div>
          )}
          <Link
            href={`/work/${next.slug}`}
            className={styles.nextTeaser}
            data-cursor="view"
          >
            <span className={`container ${styles.nextInner}`}>
              <span className={styles.nextContent}>
                <span className={`${styles.nextLabel} label-mono`}>
                  Next — {String(nextIndex + 1).padStart(2, '0')} /{' '}
                  {String(projects.length).padStart(2, '0')}
                </span>
                <span className={styles.nextTitle}>{next.title}</span>
                <span className={`${styles.nextMeta} label-mono`}>
                  {next.medium} · {next.year}
                </span>
              </span>
              <span className={styles.nextMedia} aria-hidden="true">
                <span className={styles.nextParallax} data-parallax>
                  <Picture image={next.thumb} className={styles.nextImage} />
                </span>
              </span>
            </span>
          </Link>
        </nav>
      </article>
    </>
  )
}
