import { useEffect } from 'react'

const SITE_URL = 'https://www.alexmaclean.ca'

function setNamedMeta(name: string, content: string) {
  const el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (el) el.content = content
}

function setPropMeta(property: string, content: string) {
  const el = document.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  )
  if (el) el.content = content
}

interface MetaProps {
  title: string
  description: string
  /** Path for the canonical URL, e.g. /work/blue-noise */
  path: string
  /** Absolute or root-relative og:image; defaults to the site card */
  image?: string
}

/**
 * Updates the document's existing head tags in place (index.html ships the
 * defaults; the prerender script bakes per-route copies for crawlers).
 */
export function Meta({ title, description, path, image }: MetaProps) {
  useEffect(() => {
    const url = new URL(path, SITE_URL).href
    document.title = title
    setNamedMeta('description', description)
    setPropMeta('og:title', title)
    setPropMeta('og:description', description)
    setPropMeta('og:url', url)
    setPropMeta('og:image', new URL(image ?? '/og.jpg', SITE_URL).href)
    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    )
    if (canonical) canonical.href = url
  }, [title, description, path, image])

  return null
}
