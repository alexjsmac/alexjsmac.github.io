import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { ScreenQuad } from '@react-three/drei'
import { sharedUniforms } from './uniforms'
import vertexShader from './shaders/fullscreen.vert.glsl'
import fragmentShader from './shaders/background.frag.glsl'

/**
 * One fullscreen pass painting the whole water column: depth color ramp,
 * caustic filaments near the surface, and slanted light shafts — all of
 * which die out as uDepth approaches the abyss.
 */
export function Background() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: sharedUniforms.uTime,
          uDepth: sharedUniforms.uDepth,
          uCaustics: sharedUniforms.uCaustics,
          uAudioWarp: sharedUniforms.uAudioWarp,
          uRamp: sharedUniforms.uRamp,
          uAspect: { value: 1 },
        },
        depthWrite: false,
        depthTest: false,
      }),
    [],
  )

  const size = useThree((s) => s.size)
  useEffect(() => {
    material.uniforms.uAspect!.value = size.width / size.height
  }, [size, material])

  useEffect(() => () => material.dispose(), [material])

  return (
    <ScreenQuad material={material} renderOrder={-1} frustumCulled={false} />
  )
}
