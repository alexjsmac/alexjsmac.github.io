import { Link } from 'wouter'
import type { Project, ProjectImage } from '@/data/projects'
import { Picture } from './Picture'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  project: Project
  index: number
  /** Override the card image (so no image repeats within a page) */
  image?: ProjectImage
}

/** Editorial work card for the home page's Selected Works. */
export function ProjectCard({ project, index, image }: ProjectCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={styles.card}
      data-cursor="view"
      data-st
    >
      <span className={styles.media}>
        <span className={styles.parallax} data-parallax>
          <Picture
            image={image ?? project.thumb}
            className={styles.image}
          />
        </span>
      </span>
      <span className={styles.meta}>
        <span className={`${styles.index} label-mono`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className={styles.title}>{project.title}</span>
        <span className={`${styles.medium} label-mono`}>
          {project.medium} · {project.year}
        </span>
      </span>
    </Link>
  )
}
