import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { createGlowTexture } from '../../lib/textures'

const isHermesTUI = typeof __HERMES_TUI__ !== 'undefined' && __HERMES_TUI__
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
const COUNT = isHermesTUI ? 900 : isMobile ? 700 : 2200

/* datos deterministas: posición + color (neón/ice/gris) */
const DATA = (() => {
  let s = 20260819 >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  const positions = new Float32Array(COUNT * 3)
  const colors = new Float32Array(COUNT * 3)
  const phase = new Float32Array(COUNT)
  const palette = [
    new THREE.Color('#42D879'),
    new THREE.Color('#F4F7F4'),
    new THREE.Color('#A7B0AA'),
  ]
  for (let i = 0; i < COUNT; i++) {
    const r = 7 + rand() * 16
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1) * 0.55 + 0.35 // banda ecuatorial
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.cos(phi) * 4 + 2
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    const c = palette[Math.floor(rand() * palette.length)]
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
    phase[i] = rand() * Math.PI * 2
  }
  return { positions, colors, phase }
})()

/** Partículas flotantes de alta calidad: glow aditivo + deriva orbital. */
export default function QualityParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const glowTex = useMemo(() => createGlowTexture(), [])

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: glowTex,
        size: isHermesTUI ? 0.14 : 0.18,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    [glowTex],
  )

  useFrame(({ clock }) => {
    const pts = pointsRef.current
    if (!pts) return
    const t = clock.elapsedTime
    pts.rotation.y = t * 0.02
    pts.position.y = Math.sin(t * 0.25) * 0.4
  })

  return (
    <points ref={pointsRef} material={mat}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[DATA.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[DATA.colors, 3]} />
      </bufferGeometry>
    </points>
  )
}
