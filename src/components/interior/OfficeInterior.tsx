import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { createCodeTexture } from '../../lib/textures'
import { metalMat, floorMat, leatherMat } from '../../lib/materials'

const isHermesTUI = typeof __HERMES_TUI__ !== 'undefined' && __HERMES_TUI__

/* ---------- estación de trabajo: mesa + monitor + silla ---------- */
function Desk({ position, rotationY, screen }: { position: [number, number, number]; rotationY: number; screen: THREE.Texture }) {
  const deskMat = useMemo(() => metalMat('#222a26', 0.5), [])
  const darkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0c0f0e', roughness: 0.7 }), [])
  const chairMat = useMemo(() => leatherMat('#141a17'), [])
  const screenMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: screen, toneMapped: false }),
    [screen],
  )

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* mesa */}
      <mesh position={[0, 0.74, 0]} material={deskMat}>
        <boxGeometry args={[1.5, 0.07, 0.75]} />
      </mesh>
      <mesh position={[-0.68, 0.37, -0.3]} material={darkMat}>
        <boxGeometry args={[0.06, 0.74, 0.06]} />
      </mesh>
      <mesh position={[0.68, 0.37, -0.3]} material={darkMat}>
        <boxGeometry args={[0.06, 0.74, 0.06]} />
      </mesh>
      {/* monitor */}
      <mesh position={[0, 0.98, -0.34]} material={darkMat}>
        <boxGeometry args={[0.56, 0.03, 0.03]} />
      </mesh>
      <mesh position={[0, 0.98, -0.31]} material={screenMat}>
        <planeGeometry args={[0.52, 0.32]} />
      </mesh>
      <mesh position={[0, 0.82, -0.34]} material={darkMat}>
        <boxGeometry args={[0.08, 0.1, 0.05]} />
      </mesh>
      {/* silla */}
      <group position={[0, 0, 0.42]}>
        <mesh position={[0, 0.05, 0]} material={darkMat}>
          <cylinderGeometry args={[0.2, 0.2, 0.03, 16]} />
        </mesh>
        <mesh position={[0, 0.18, 0]} material={chairMat}>
          <cylinderGeometry args={[0.03, 0.05, 0.28, 8]} />
        </mesh>
        <mesh position={[0, 0.32, 0]} material={chairMat}>
          <cylinderGeometry args={[0.19, 0.19, 0.05, 16]} />
        </mesh>
        <mesh position={[0, 0.48, -0.17]} rotation={[0.18, 0, 0]} material={chairMat}>
          <boxGeometry args={[0.4, 0.3, 0.04]} />
        </mesh>
      </group>
    </group>
  )
}

/* ---------- planta decorativa ---------- */
function Plant({ position }: { position: [number, number, number] }) {
  const potMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2a332d', roughness: 0.8 }), [])
  const leafMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1c4a2e', roughness: 0.9 }), [])
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} material={potMat}>
        <cylinderGeometry args={[0.14, 0.1, 0.3, 12]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} material={leafMat}>
        <sphereGeometry args={[0.22, 10, 10]} />
      </mesh>
      <mesh position={[0.14, 0.42, 0.05]} material={leafMat}>
        <sphereGeometry args={[0.12, 8, 8]} />
      </mesh>
      <mesh position={[-0.13, 0.45, -0.04]} material={leafMat}>
        <sphereGeometry args={[0.1, 8, 8]} />
      </mesh>
    </group>
  )
}

/* ================================================================== */
/* Interior: lobby (recepción) + oficinas (pisos 2-3)                  */
/* ================================================================== */
export default function OfficeInterior() {
  const codeGreen = useMemo(() => createCodeTexture(7, '#42D879', '#1f5c3a'), [])
  const codeBlue = useMemo(() => createCodeTexture(13, '#6fd0ff', '#234f6b'), [])
  const codeWhite = useMemo(() => createCodeTexture(29, '#e8f2ec', '#5a6b62'), [])

  const floorMat_ = useMemo(() => floorMat('#101613', 0.45), [])
  const receptionMat = useMemo(() => metalMat('#1a211d', 0.5), [])
  const neonMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#42D879',
        emissive: new THREE.Color('#42D879'),
        emissiveIntensity: isHermesTUI ? 1.4 : 2.5,
      }),
    [],
  )

  /* 6 estaciones: 2 filas × 3 (piso oficinas, y=2.36..4.85) */
  const desks: { pos: [number, number, number]; rot: number; tex: THREE.Texture }[] = [
    { pos: [-1.5, 3.1, -0.5], rot: 0, tex: codeGreen },
    { pos: [0, 3.1, -0.5], rot: 0, tex: codeBlue },
    { pos: [1.5, 3.1, -0.5], rot: 0, tex: codeWhite },
    { pos: [-1.5, 3.1, 0.9], rot: Math.PI, tex: codeBlue },
    { pos: [0, 3.1, 0.9], rot: Math.PI, tex: codeWhite },
    { pos: [1.5, 3.1, 0.9], rot: Math.PI, tex: codeGreen },
  ]

  return (
    <group>
      {/* luces de oficina colgantes */}
      <pointLight position={[-1.6, 4.55, 0]} intensity={isHermesTUI ? 1.5 : 3} distance={5} color="#ffe6c0" />
      <pointLight position={[1.6, 4.55, 0]} intensity={isHermesTUI ? 1.5 : 3} distance={5} color="#ffe6c0" />

      {/* ---------- LOBBY ---------- */}
      <mesh position={[0, 1.11, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMat_}>
        <planeGeometry args={[5.6, 4.4]} />
      </mesh>
      {/* mostrador de recepción */}
      <mesh position={[-1.3, 1.32, -1.15]} material={receptionMat}>
        <boxGeometry args={[2.2, 0.42, 0.55]} />
      </mesh>
      <mesh position={[-1.3, 1.16, -1.15]} material={receptionMat}>
        <boxGeometry args={[2.3, 0.08, 0.65]} />
      </mesh>
      {/* logo en la pared interior (mirando hacia dentro) */}
      <Text
        position={[0, 1.95, -1.62]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.3}
        letterSpacing={0.2}
        color="#42D879"
        anchorX="center"
        anchorY="middle"
        material={neonMat}
      >
        JORJAI
      </Text>
      <Plant position={[1.9, 1.11, -1.1]} />
      <Plant position={[-2.1, 1.11, 1.3]} />

      {/* ---------- OFICINAS (pisos 2-3) ---------- */}
      <mesh position={[0, 2.37, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMat_}>
        <planeGeometry args={[5.2, 4]} />
      </mesh>
      {desks.map((d, i) => (
        <Desk key={i} position={d.pos} rotationY={d.rot} screen={d.tex} />
      ))}
      {/* tabique de cristal entre filas */}
      <mesh position={[0, 3.4, 0.2]} rotation={[0, 0, 0]} material={receptionMat}>
        <boxGeometry args={[4.8, 0.9, 0.04]} />
      </mesh>
      {/* luces de techo (losa y=4.85) */}
      <mesh position={[-1.6, 4.8, -0.5]} material={neonMat}>
        <planeGeometry args={[0.9, 0.16]} />
      </mesh>
      <mesh position={[0, 4.8, -0.5]} material={neonMat}>
        <planeGeometry args={[0.9, 0.16]} />
      </mesh>
      <mesh position={[1.6, 4.8, -0.5]} material={neonMat}>
        <planeGeometry args={[0.9, 0.16]} />
      </mesh>
    </group>
  )
}
