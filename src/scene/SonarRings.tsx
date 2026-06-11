import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { sharedUniforms } from './uniforms'
import { pointerToWorld } from './pointerWorld'
import vertexShader from './shaders/sonar.vert.glsl'
import fragmentShader from './shaders/sonar.frag.glsl'

const POOL = 3
const PLANE_Z = 2.5
const SIZE = 5.5

/**
 * Click feedback: a thin sonar ping that expands from the pointer and
 * fades — pooled across three quads.
 */
export function SonarRings() {
  const next = useRef(0)
  const queued = useRef(false)
  const meshes = useRef<Array<THREE.Mesh | null>>([])
  const world = useMemo(() => new THREE.Vector3(), [])

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), [])
  const materials = useMemo(
    () =>
      Array.from(
        { length: POOL },
        () =>
          new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
              uTime: sharedUniforms.uTime,
              uStart: { value: -100 },
              uColor: { value: new THREE.Color('#5ef0c8') },
            },
          }),
      ),
    [],
  )

  useEffect(() => {
    const onDown = () => {
      queued.current = true
    }
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      geometry.dispose()
      for (const m of materials) m.dispose()
    }
  }, [geometry, materials])

  useFrame(({ camera }) => {
    if (!queued.current) return
    queued.current = false
    const i = next.current
    next.current = (i + 1) % POOL
    const mesh = meshes.current[i]
    const material = materials[i]
    if (!mesh || !material) return
    pointerToWorld(camera, PLANE_Z, world)
    mesh.position.copy(world)
    material.uniforms.uStart!.value = sharedUniforms.uTime.value
  })

  return (
    <>
      {materials.map((material, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el
          }}
          geometry={geometry}
          material={material}
          scale={SIZE}
          frustumCulled={false}
        />
      ))}
    </>
  )
}
