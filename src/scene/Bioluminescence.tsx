import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { frameBus } from '@/lib/frameBus'
import { sharedUniforms } from './uniforms'
import vertexShader from './shaders/biolum.vert.glsl'
import fragmentShader from './shaders/biolum.frag.glsl'

const POOL = 256
const TRAIL_PLANE_Z = 2.5
const SPAWN_INTERVAL = 0.045
const BURST = 14

/**
 * Pointer wake: a pooled ring buffer of glowing motes stamped along the
 * cursor's path (and bursts on click), animated entirely in the shader
 * from (spawn, birth) pairs.
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
          uColorA: { value: new THREE.Color('#5ef0c8').multiplyScalar(1.6) },
          uColorB: { value: new THREE.Color('#9d8cff').multiplyScalar(1.6) },
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

  const ray = useMemo(() => new THREE.Vector3(), [])

  function pointerToWorld(
    camera: THREE.Camera,
    out: THREE.Vector3,
  ): THREE.Vector3 {
    ray.set(frameBus.pointer.x, frameBus.pointer.y, 0.5).unproject(camera)
    ray.sub(camera.position).normalize()
    const t = (TRAIL_PLANE_Z - camera.position.z) / ray.z
    return out.copy(camera.position).addScaledVector(ray, t)
  }

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

  useEffect(() => {
    const onDown = () => {
      lastSpawn.current.t = -10 // let the next frame stamp the burst
      burstQueued.current = true
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [])

  const burstQueued = useRef(false)

  useFrame(({ camera }) => {
    const now = sharedUniforms.uTime.value
    const { x, y } = frameBus.pointer
    const last = lastSpawn.current

    const moved =
      Math.abs(x - last.x) > 0.004 || Math.abs(y - last.y) > 0.004

    if (burstQueued.current) {
      burstQueued.current = false
      pointerToWorld(camera, world)
      for (let i = 0; i < BURST; i++) {
        stamp(
          world.x + (Math.random() - 0.5) * 0.7,
          world.y + (Math.random() - 0.5) * 0.7,
          world.z + (Math.random() - 0.5) * 0.7,
          now + Math.random() * 0.12,
        )
      }
      last.t = now
      last.x = x
      last.y = y
      return
    }

    if (moved && now - last.t > SPAWN_INTERVAL) {
      pointerToWorld(camera, world)
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
