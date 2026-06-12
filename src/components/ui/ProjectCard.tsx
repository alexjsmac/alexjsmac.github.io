import { Link } from 'wouter'
import type { Project } from '@/data/projects'
import { Picture } from './Picture'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  project: Project
  index: number
}

/** Editorial work card for the home page's Selected Works. */
export function ProjectCard({ project, index }: ProjectCardProps) {
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
            image={project.thumb}
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
