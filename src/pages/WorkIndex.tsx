import { Link } from 'wouter'
import { Meta } from '@/components/ui/Meta'
import { Picture } from '@/components/ui/Picture'
import { projects } from '@/data/projects'
import seo from '@/data/seo.json'
import styles from './WorkIndex.module.css'

export default function WorkIndex() {
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

          <ol className={styles.list}>
            {projects.map((project, i) => (
              <li key={project.slug} className={styles.row}>
                <Link
                  href={`/work/${project.slug}`}
                  className={styles.rowLink}
                  data-cursor="view"
                  data-thumb={project.thumb.src}
                >
                  <span className={`${styles.rowIndex} label-mono`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.rowTitle}>{project.title}</span>
                  <span className={`${styles.rowMeta} label-mono`}>
                    {project.medium}
                  </span>
                  <span className={`${styles.rowYear} label-mono`}>
                    {project.year}
                  </span>
                  <span className={styles.rowThumb} aria-hidden="true">
                    <Picture image={project.thumb} sizes="200px" />
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
