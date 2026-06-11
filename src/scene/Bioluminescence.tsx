import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { frameBus } from '@/lib/frameBus'
import { sharedUniforms } from './uniforms'
import { pointerToWorld } from './pointerWorld'
import vertexShader from './shaders/biolum.vert.glsl'
import fragmentShader from './shaders/biolum.frag.glsl'

const POOL = 256
const TRAIL_PLANE_Z = 2.5
const SPAWN_INTERVAL = 0.07

/**
 * Pointer wake: a pooled ring buffer of sharp specks stamped along the
 * cursor's path, animated entirely in the shader from (spawn, birth)
 * pairs. Clicks are handled by SonarRings.
 */
export function Bioluminescence() {
  const slot = useRef(0)
  const lastSpawn = useRef({ t: -1, x: 0, y: 0 })

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(POOL * 3), 3),
    )
    geo.setAttribute(
      'aSpawn',
      new THREE.BufferAttribute(new Float32Array(POOL * 3), 3),
    )
    const births = new Float32Array(POOL).fill(-1000)
    geo.setAttribute('aBirth', new THREE.BufferAttribute(births, 1))
    const seeds = new Float32Array(POOL)
    for (let i = 0; i < POOL; i++) seeds[i] = i * 1.618 + 0.21
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity)
    return geo
  }, [])

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
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          uColorA: { value: new THREE.Color('#5ef0c8').multiplyScalar(1.35) },
          uColorB: { value: new THREE.Color('#d8fff2').multiplyScalar(1.25) },
        },
      }),
    [],
  )

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  const world = useMemo(() => new THREE.Vector3(), [])

  function stamp(x: number, y: number, z: number, birth: number) {
    const spawn = geometry.getAttribute('aSpawn') as THREE.BufferAttribute
    const births = geometry.getAttribute('aBirth') as THREE.BufferAttribute
    const i = slot.current
    spawn.setXYZ(i, x, y, z)
    births.setX(i, birth)
    spawn.needsUpdate = true
    births.needsUpdate = true
    slot.current = (i + 1) % POOL
  }

  useFrame(({ camera }) => {
    const now = sharedUniforms.uTime.value
    const { x, y } = frameBus.pointer
    const last = lastSpawn.current

    const moved =
      Math.abs(x - last.x) > 0.004 || Math.abs(y - last.y) > 0.004

    if (moved && now - last.t > SPAWN_INTERVAL) {
      pointerToWorld(camera, TRAIL_PLANE_Z, world)
      stamp(
        world.x + (Math.random() - 0.5) * 0.15,
        world.y + (Math.random() - 0.5) * 0.15,
        world.z,
        now,
      )
      last.t = now
      last.x = x
      last.y = y
    }
  })

  return (
    <points geometry={geometry} material={material} frustumCulled={false} />
  )
}
