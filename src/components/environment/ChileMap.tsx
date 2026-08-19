import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { createGlowTexture } from '../../lib/textures'

/* Silueta de Chile: (lat, lonOeste, lonEste) interpolada → puntos brillantes */
const COAST: [number, number, number][] = [
  [-17.5, -70.5, -69.5],
  [-20.0, -70.6, -69.5],
  [-23.0, -70.7, -69.8],
  [-26.0, -70.9, -69.7],
  [-29.0, -71.4, -70.1],
  [-33.0, -71.8, -70.2],
  [-36.0, -73.2, -71.2],
  [-39.0, -73.5, -72.2],
  [-42.0, -74.0, -72.5],
  [-45.0, -74.4, -72.0],
  [-48.0, -75.0, -72.8],
  [-51.0, -75.3, -71.5],
  [-53.0, -74.6, -70.5],
  [-55.5, -72.5, -68.5],
]

const KX = 0.42
const KZ = 0.19
const CX = -6.9
const CZ = 0.4

function latLonToXY(lat: number, lon: number): [number, number] {
  return [(lon + 76) * KX + CX, -(lat + 56) * KZ + CZ]
}

/** Grid denso de puntos dentro de la silueta (borde + interior). */
function genChilePoints(): Float32Array {
  const pts: number[] = []
  const seg = 3 // subdivisión entre filas de costa
  for (let i = 0; i < COAST.length - 1; i++) {
    const [latA, lonWA, lonEA] = COAST[i]
    const [latB, lonWB, lonEB] = COAST[i + 1]
    for (let s = 0; s < seg; s++) {
      const t = s / seg
      const lat = latA + (latB - latA) * t
      const lonW = lonWA + (lonWB - lonWA) * t
      const lonE = lonEA + (lonEB - lonEA) * t
      // borde oeste, centro, este
      for (const lon of [lonW, (lonW + lonE) / 2, lonE]) {
        const [x, y] = latLonToXY(lat, lon)
        pts.push(x, 0, y)
      }
    }
  }
  // fila del extremo sur
  const [latE, lonWE, lonEE] = COAST[COAST.length - 1]
  for (const lon of [lonWE, (lonWE + lonEE) / 2, lonEE]) {
    const [x, y] = latLonToXY(latE, lon)
    pts.push(x, 0, y)
  }
  return new Float32Array(pts)
}

const isHermesTUI = typeof __HERMES_TUI__ !== 'undefined' && __HERMES_TUI__

/**
 * Mapa holográfico de Chile en el suelo: puntos neón + marcador
 * Santiago/Puente Alto con anillo pulsante.
 */
export default function ChileMap() {
  const ringRef = useRef<THREE.Mesh>(null)
  const glowTex = useMemo(() => createGlowTexture(), [])
  const positions = useMemo(() => genChilePoints(), [])

  const [sx, sz] = latLonToXY(-33.4, -70.7) // Santiago

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: glowTex,
        size: isHermesTUI ? 0.09 : 0.12,
        color: '#42D879',
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    [glowTex],
  )

  useFrame(({ clock }) => {
    const r = ringRef.current
    if (!r) return
    const t = clock.elapsedTime
    const pulse = 1 + Math.sin(t * 2) * 0.15
    r.scale.setScalar(pulse)
    ;(r.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(t * 2) * 0.25
  })

  return (
    <group position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <points material={mat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
      </points>

      {/* marcador Santiago */}
      <mesh position={[sx, 0.02, sz]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.34, 32]} />
        <meshBasicMaterial color="#F4F7F4" transparent opacity={0.7} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef} position={[sx, 0.015, sz]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.48, 32]} />
        <meshBasicMaterial color="#42D879" transparent opacity={0.6} depthWrite={false} />
      </mesh>
      <mesh position={[sx, 0.05, sz]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color="#42D879" toneMapped={false} />
      </mesh>

      {/* etiqueta */}
      <Text
        position={[sx + 0.9, 0.02, sz - 0.15]}
        rotation={[Math.PI / 2, 0, 0]}
        fontSize={0.28}
        color="#F4F7F4"
        anchorX="left"
        anchorY="middle"
      >
        SANTIAGO · PUENTE ALTO
      </Text>
    </group>
  )
}
