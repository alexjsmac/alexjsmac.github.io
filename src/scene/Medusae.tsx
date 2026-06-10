import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useAppStore } from '@/store/app'
import { qualityProfile } from '@/lib/quality'
import { sharedUniforms } from './uniforms'
import medusaVert from './shaders/medusa.vert.glsl'
import medusaFrag from './shaders/medusa.frag.glsl'
import tentacleVert from './shaders/tentacle.vert.glsl'
import tentacleFrag from './shaders/tentacle.frag.glsl'

const STRANDS = 7
const STRAND_POINTS = 14
const STRAND_LENGTH = 2.6

interface JellySpec {
  position: [number, number, number]
  scale: number
  pulseRate: number
  phase: number
  drift: number
  color: string
}

const JELLIES: JellySpec[] = [
  {
    position: [-6.5, -8, -7],
    scale: 1.5,
    pulseRate: 1.15,
    phase: 0.0,
    drift: 0.9,
    color: '#69b7ff',
  },
  {
    position: [7, -21, -10],
    scale: 2.1,
    pulseRate: 0.85,
    phase: 2.1,
    drift: 1.4,
    color: '#9d8cff',
  },
  {
    position: [-3.5, -33, -5],
    scale: 1.2,
    pulseRate: 1.35,
    phase: 4.0,
    drift: 0.7,
    color: '#5ef0c8',
  },
]

function buildTentacles(): THREE.BufferGeometry {
  const positions: number[] = []
  const along: number[] = []
  const strand: number[] = []
  for (let s = 0; s < STRANDS; s++) {
    const angle = (s / STRANDS) * Math.PI * 2
    const rx = Math.cos(angle) * 0.55
    const rz = Math.sin(angle) * 0.55
    for (let p = 0; p < STRAND_POINTS - 1; p++) {
      // Line segments pair-by-pair
      for (const k of [p, p + 1]) {
        const t = k / (STRAND_POINTS - 1)
        positions.push(rx * (1 - t * 0.4), -t * STRAND_LENGTH, rz * (1 - t * 0.4))
        along.push(t)
        strand.push(s)
      }
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  )
  geo.setAttribute('aAlong', new THREE.Float32BufferAttribute(along, 1))
  geo.setAttribute('aStrand', new THREE.Float32BufferAttribute(strand, 1))
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity)
  return geo
}

function Jelly({ spec }: { spec: JellySpec }) {
  const group = useRef<THREE.Group>(null)

  const bellGeometry = useMemo(
    () =>
      new THREE.SphereGeometry(1, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.52),
    [],
  )
  const tentacleGeometry = useMemo(() => buildTentacles(), [])

  const bellMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: medusaVert,
        fragmentShader: medusaFrag,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: sharedUniforms.uTime,
          uPulseRate: { value: spec.pulseRate },
          uPhase: { value: spec.phase },
          uColor: { value: new THREE.Color(spec.color) },
          uOpacity: { value: 1 },
        },
      }),
    [spec],
  )

  const tentacleMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: tentacleVert,
        fragmentShader: tentacleFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: sharedUniforms.uTime,
          uPulseRate: { value: spec.pulseRate },
          uPhase: { value: spec.phase },
          uColor: { value: new THREE.Color(spec.color) },
          uOpacity: { value: 1 },
        },
      }),
    [spec],
  )

  useEffect(
    () => () => {
      bellGeometry.dispose()
      tentacleGeometry.dispose()
      bellMaterial.dispose()
      tentacleMaterial.dispose()
    },
    [bellGeometry, tentacleGeometry, bellMaterial, tentacleMaterial],
  )

  useFrame(() => {
    const g = group.current
    if (!g) return
    const t = sharedUniforms.uTime.value
    // Slow wandering drift; rises gently with each pulse
    g.position.x =
      spec.position[0] + Math.sin(t * 0.045 * spec.drift + spec.phase) * 2.2
    g.position.z =
      spec.position[2] + Math.cos(t * 0.038 * spec.drift + spec.phase) * 1.6
    g.position.y =
      spec.position[1] + Math.sin(t * 0.06 * spec.drift + spec.phase * 2.0) * 1.1
    g.rotation.z = Math.sin(t * 0.05 + spec.phase) * 0.12
    g.rotation.x = Math.cos(t * 0.04 + spec.phase) * 0.08
  })

  return (
    <group ref={group} scale={spec.scale}>
      <mesh
        geometry={bellGeometry}
        material={bellMaterial}
        frustumCulled={false}
      />
      <lineSegments
        geometry={tentacleGeometry}
        material={tentacleMaterial}
        frustumCulled={false}
        position={[0, -0.15, 0]}
      />
    </group>
  )
}

/** A few procedural jellyfish encountered on the way down. */
export function Medusae() {
  const quality = useAppStore((s) => s.quality)
  const count = qualityProfile(quality).medusae
  if (count === 0) return null
  return (
    <>
      {JELLIES.slice(0, count).map((spec) => (
        <Jelly key={spec.phase} spec={spec} />
      ))}
    </>
  )
}
