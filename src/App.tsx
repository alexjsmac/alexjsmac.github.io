import { useEffect } from 'react'
import { SkipLink } from '@/components/layout/SkipLink'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/lib/SmoothScroll'
import { SceneRoot } from '@/scene/SceneRoot'
import { Routes } from '@/routes'
import { useAppStore } from '@/store/app'

export default function App() {
  const quality = useAppStore((s) => s.quality)

  // Static-gradient fallback when the WebGL scene never mounts
  useEffect(() => {
    document.body.classList.toggle('no-scene', quality === 'static')
  }, [quality])

  return (
    <>
      <SkipLink />
      <SmoothScroll />
      <SceneRoot />
      <div className="site">
        <Header />
        <main id="main">
          <Routes />
        </main>
        <Footer />
      </div>
    </>
  )
}
