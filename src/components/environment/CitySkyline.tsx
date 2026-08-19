import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { createFacadeTexture } from '../../lib/textures'

interface Building {
  x: number
  z: number
  h: number
  w: number
  d: number
  warm: boolean
}

/* skyline determinista: arco frontal + costados */
function genSkyline(seed: number): Building[] {
  let s = seed >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  const out: Building[] = []
  for (let i = 0; i < 30; i++) {
    const side = i % 3
    const z = side === 0 ? -(26 + rand() * 10) : -(8 + rand() * 14)
    const x = side === 0 ? (rand() - 0.5) * 50 : side === 1 ? -(27 + rand() * 9) : 27 + rand() * 9
    out.push({
      x,
      z,
      h: 2.5 + rand() * 9.5,
      w: 1.5 + rand() * 2.6,
      d: 1.5 + rand() * 2.6,
      warm: rand() > 0.5,
    })
  }
  return out
}

const isHermesTUI = typeof __HERMES_TUI__ !== 'undefined' && __HERMES_TUI__

/**
 * Skyline de Santiago: 30 edificios instanced con ventanas iluminadas.
 * Dos grupos de materiales (frío/cálido) para variación de color.
 */
export default function CitySkyline() {
  const coldRef = useRef<THREE.InstancedMesh>(null)
  const warmRef = useRef<THREE.InstancedMesh>(null)

  const { cold, warm } = useMemo(() => {
    const all = genSkyline(20260819)
    return {
      cold: all.filter((b) => !b.warm),
      warm: all.filter((b) => b.warm),
    }
  }, [])

  const texture = useMemo(() => createFacadeTexture(555, 5, 10), [])

  const coldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        emissiveMap: texture,
        emissive: new THREE.Color('#a8d8ff'),
        emissiveIntensity: isHermesTUI ? 0.35 : 0.6,
        roughness: 0.4,
        metalness: 0.3,
      }),
    [texture],
  )
  const warmMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        emissiveMap: texture,
        emissive: new THREE.Color('#ffcf9e'),
        emissiveIntensity: isHermesTUI ? 0.35 : 0.6,
        roughness: 0.4,
        metalness: 0.3,
      }),
    [texture],
  )

  const applyMatrices = (mesh: THREE.InstancedMesh | null, data: Building[]) => {
    if (!mesh) return
    const m = new THREE.Matrix4()
    data.forEach((b, i) => {
      m.compose(
        new THREE.Vector3(b.x, b.h / 2, b.z),
        new THREE.Quaternion(),
        new THREE.Vector3(b.w, b.h, b.d),
      )
      mesh.setMatrixAt(i, m)
    })
    mesh.instanceMatrix.needsUpdate = true
  }

  useEffect(() => {
    applyMatrices(coldRef.current, cold)
    applyMatrices(warmRef.current, warm)
  }, [cold, warm])

  return (
    <group>
      <instancedMesh ref={coldRef} args={[undefined, undefined, cold.length]} material={coldMat}>
        <boxGeometry />
      </instancedMesh>
      <instancedMesh ref={warmRef} args={[undefined, undefined, warm.length]} material={warmMat}>
        <boxGeometry />
      </instancedMesh>
    </group>
  )
}
