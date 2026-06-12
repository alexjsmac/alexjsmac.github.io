import type { ProjectImage } from '@/data/projects'

interface PictureProps {
  image: ProjectImage
  loading?: 'lazy' | 'eager'
  className?: string
}

/** <img> with intrinsic dimensions from the build manifest — no layout shift. */
export function Picture({ image, loading = 'lazy', className }: PictureProps) {
  return (
    <img
      src={image.src}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={loading}
      decoding="async"
      className={className}
    />
  )
}
