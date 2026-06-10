import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { frameBus } from '@/lib/frameBus'
import { useAppStore } from '@/store/app'
import { qualityProfile } from '@/lib/quality'
import { Background } from './Background'
import { CameraRig } from './CameraRig'
import { MoodController } from './MoodController'
import { Effects } from './Effects'

function PointerTracker() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      frameBus.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      frameBus.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return null
}

/**
 * The persistent ocean. Mounted once behind every route; never re-created
 * on navigation. Skipped entirely under prefers-reduced-motion ('static').
 */
export function SceneRoot() {
  const quality = useAppStore((s) => s.quality)
  if (quality === 'static') return null
  const profile = qualityProfile(quality)

  return (
    <div className="scene-canvas" aria-hidden="true">
      <PointerTracker />
      <Canvas
        dpr={[1, profile.dprMax]}
        camera={{ fov: 50, near: 0.1, far: 120, position: [0, 0, 9] }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        <Background />
        <CameraRig />
        <MoodController />
        {/* Always mounted: the composer owns the final linear→sRGB encode,
            so scene colors are authored in linear space. */}
        <Effects />
      </Canvas>
    </div>
  )
}
