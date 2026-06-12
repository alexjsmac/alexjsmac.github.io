import type { ProjectImage } from '@/data/projects'
import { Picture } from './Picture'
import styles from './Gallery.module.css'

interface GalleryProps {
  images: ProjectImage[]
  caption?: string
}

export function Gallery({ images, caption }: GalleryProps) {
  return (
    <figure className={styles.gallery}>
      <div className={styles.grid}>
        {images.map((image) => (
          <Picture
            key={image.src}
            image={image}
            className={styles.item}
          />
        ))}
      </div>
      {caption && (
        <figcaption className={`${styles.caption} label-mono`}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
