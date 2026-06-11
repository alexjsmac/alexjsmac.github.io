import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useAppStore } from '@/store/app'
import { qualityProfile } from '@/lib/quality'
import { sharedUniforms } from './uniforms'
import vertexShader from './shaders/plankton.vert.glsl'
import fragmentShader from './shaders/plankton.frag.glsl'

/**
 * The drifting field of plankton / marine snow. One Points draw call;
 * motion is computed statelessly on the GPU from per-particle seeds, so
 * particle count only affects vertex load — no CPU work per frame.
 */
export function Plankton() {
  const quality = useAppStore((s) => s.quality)
  const count = qualityProfile(quality).planktonCount
  const dpr = useThree((s) => s.viewport.dpr)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const seeds = new Float32Array(count)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      seeds[i] = i + 0.137
      // Mostly dust, a few larger motes
      sizes[i] = 0.5 + Math.pow(Math.random(), 3.5) * 2.4
      phases[i] = Math.random() * Math.PI * 2
    }
    // Positions live in the vertex shader; attribute satisfies three
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(count * 3), 3),
    )
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity)
    return geo
  }, [count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: sharedUniforms.uTime,
          uDepth: sharedUniforms.uDepth,
          uParticleEnergy: sharedUniforms.uParticleEnergy,
          uAudioWarp: sharedUniforms.uAudioWarp,
          uAudioHigh: sharedUniforms.uAudioHigh,
          uPixelRatio: { value: 1 },
          uCameraY: { value: 0 },
          uColorA: { value: new THREE.Color('#9bd8e8') },
          uColorB: { value: new THREE.Color('#5ef0c8') },
        },
      }),
    [],
  )

  useEffect(() => {
    material.uniforms.uPixelRatio!.value = dpr
  }, [dpr, material])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useFrame(({ camera }) => {
    material.uniforms.uCameraY!.value = camera.position.y
  })

  return (
    <points geometry={geometry} material={material} frustumCulled={false} />
  )
}
