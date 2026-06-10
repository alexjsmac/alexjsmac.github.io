import { useEffect } from 'react'
import { SkipLink } from '@/components/layout/SkipLink'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/lib/SmoothScroll'
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
      <div className="site">
        <Header />
        <main id="main">
          {/* Placeholder until routes land */}
          <section style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
            <div className="container">
              <p className="label-mono">Immersive Media Artist</p>
              <h1 className="display-hero">
                Alex <em className="display-italic">MacLean</em>
              </h1>
            </div>
          </section>
          <section style={{ minHeight: '120vh' }} />
        </main>
        <Footer />
      </div>
    </>
  )
}
