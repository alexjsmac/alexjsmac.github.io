import type { ProjectImage } from '@/data/projects'

interface PictureProps {
  image: ProjectImage
  sizes?: string
  loading?: 'lazy' | 'eager'
  className?: string
}

/** <img> with intrinsic dimensions from the build manifest — no layout shift. */
export function Picture({
  image,
  sizes,
  loading = 'lazy',
  className,
}: PictureProps) {
  return (
    <img
      src={image.src}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={loading}
      decoding="async"
      sizes={sizes}
      className={className}
    />
  )
}
