import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing'
import type { Bloom as BloomImpl } from '@react-three/postprocessing'
import { useAppStore } from '@/store/app'
import { qualityProfile } from '@/lib/quality'
import { moodState } from './MoodController'

export function Effects() {
  const quality = useAppStore((s) => s.quality)
  const profile = qualityProfile(quality)
  const bloomRef = useRef<typeof BloomImpl | null>(null)

  useFrame(() => {
    const bloom = bloomRef.current as { intensity?: number } | null
    if (bloom && typeof bloom.intensity === 'number') {
      bloom.intensity =
        quality === 'low' ? moodState.bloom * 0.5 : moodState.bloom
    }
  })

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        ref={bloomRef as never}
        mipmapBlur
        intensity={0.9}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.25}
      />
      <Noise opacity={0.055} />
      <Vignette darkness={0.55} offset={0.3} />
      {profile.chromaticAberration ? (
        <ChromaticAberration offset={[0.0005, 0.0005]} />
      ) : (
        <></>
      )}
    </EffectComposer>
  )
}
