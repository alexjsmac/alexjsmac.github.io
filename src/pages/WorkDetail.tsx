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
  const prev = projects[index - 1]
  const next = projects[index + 1]
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
            <p className="label-mono">
              {project.medium} · {project.year}
            </p>
            <h1 className={`${styles.title} display-hero`}>{project.title}</h1>
            <p className={`${styles.excerpt} body-lg measure`}>
              {project.excerpt}
            </p>
          </header>

          <div className={styles.video}>
            {project.video ? (
              <VideoEmbed
                video={project.video}
                poster={project.hero}
                title={project.title}
              />
            ) : (
              <Picture image={project.hero} loading="eager" />
            )}
          </div>

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

          <nav className={styles.pager} aria-label="More work">
            {prev ? (
              <Link
                href={`/work/${prev.slug}`}
                className={styles.pagerLink}
                rel="prev"
              >
                <span className="label-mono">← Previous</span>
                <span className={styles.pagerTitle}>{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/work/${next.slug}`}
                className={`${styles.pagerLink} ${styles.pagerNext}`}
                rel="next"
              >
                <span className="label-mono">Next →</span>
                <span className={styles.pagerTitle}>{next.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </article>
    </>
  )
}
