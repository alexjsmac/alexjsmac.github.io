import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { frameBus } from '@/lib/frameBus'
import { useAppStore } from '@/store/app'
import { sampleAudio } from '@/audio/analysis'
import { audioEngine } from '@/audio/engine'
import { sharedUniforms } from './uniforms'
import { moodOf, rampColor } from './moods'

/** Damped live mood values — Effects reads bloom from here each frame. */
export const moodState = {
  bloom: 0.9,
  fogDensity: 0.042,
}

const { damp } = THREE.MathUtils

/**
 * Lerps every scene parameter toward the active route's mood each frame, so
 * navigation sinks or rises through the column instead of cutting.
 */
export function MoodController() {
  const scene = useThree((s) => s.scene)
  const fogColor = useMemo(() => new THREE.Color(), [])

  useEffect(() => {
    const fog = new THREE.FogExp2(0x020610, moodState.fogDensity)
    scene.fog = fog
    return () => {
      scene.fog = null
    }
  }, [scene])

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1)
    sharedUniforms.uTime.value += d

    const mood = moodOf(useAppStore.getState().moodKey)
    const [from, to] = mood.depthRange
    frameBus.depth = from + (to - from) * frameBus.scroll.progress

    const u = sharedUniforms
    u.uDepth.value = damp(u.uDepth.value, frameBus.depth, 2.4, d)
    u.uCaustics.value = damp(u.uCaustics.value, mood.caustics, 1.8, d)
    u.uParticleEnergy.value = damp(
      u.uParticleEnergy.value,
      mood.particleEnergy,
      1.8,
      d,
    )

    // Pull FFT bands onto the bus, then into the shared uniforms; the
    // soundscape itself darkens with the descent.
    sampleAudio()
    audioEngine.setDepth(u.uDepth.value)
    u.uAudioLow.value = frameBus.audio.low
    u.uAudioMid.value = frameBus.audio.mid
    u.uAudioHigh.value = frameBus.audio.high
    u.uAudioLevel.value = frameBus.audio.level
    u.uAudioWarp.value = frameBus.audio.warp

    moodState.bloom = damp(moodState.bloom, mood.bloom, 1.8, d)
    moodState.fogDensity = damp(
      moodState.fogDensity,
      mood.fogDensity,
      1.8,
      d,
    )

    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.density = moodState.fogDensity
      scene.fog.color.copy(rampColor(u.uDepth.value, fogColor))
    }
  })

  return null
}
