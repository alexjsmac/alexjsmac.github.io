import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { frameBus } from '@/lib/frameBus'
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
    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary) return
      // Touch devices get no pointermove before a tap — sync the pointer
      // from the event itself so the ping spawns under the finger.
      frameBus.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      frameBus.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
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
    const now = sharedUniforms.uTime.value
    material.uniforms.uStart!.value = now
    // Broadcast the ping — the jellyfish listen for the wavefront
    frameBus.ping.x = world.x
    frameBus.ping.y = world.y
    frameBus.ping.z = world.z
    frameBus.ping.time = now
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
