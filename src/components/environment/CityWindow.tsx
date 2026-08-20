import { useMemo } from 'react'
import * as THREE from 'three'
import { glassMat, metalMat } from '../../lib/materials'
import { createSantiagoViewTexture } from '../../lib/textures'

const isHermesTUI = typeof __HERMES_TUI__ !== 'undefined' && __HERMES_TUI__

export interface CityWindowProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  thickness?: number
}

/**
 * Ventanal con vista a Santiago: marco metálico + vidrio con transmisión
 * + panorama nocturno (Andes + skyline con ventanas) iluminado detrás.
 */
export default function CityWindow({
  position,
  rotation = [0, 0, 0],
  width = 1.8,
  height = 1.2,
  thickness = 0.06,
}: CityWindowProps) {
  const glass = useMemo(() => glassMat({ transmission: 0.8, roughness: 0.08 }), [])
  const frame = useMemo(() => metalMat('#20262a', 0.35), [])
  const santiago = useMemo(() => createSantiagoViewTexture(5), [])

  /* panorama iluminado (emissive) para verse de noche a través del vidrio */
  const viewMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: santiago,
        emissiveMap: santiago,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: isHermesTUI ? 0.5 : 0.9,
        roughness: 1,
      }),
    [santiago],
  )

  return (
    <group position={position} rotation={rotation}>
      {/* marco */}
      <mesh material={frame}>
        <boxGeometry args={[width + thickness, height + thickness, thickness]} />
      </mesh>
      {/* panorama de Santiago (detrás del vidrio) */}
      <mesh position={[0, 0, -thickness / 2 - 0.02]} material={viewMat}>
        <planeGeometry args={[width, height]} />
      </mesh>
      {/* vidrio */}
      <mesh material={glass}>
        <planeGeometry args={[width, height]} />
      </mesh>
    </group>
  )
}
