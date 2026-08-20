import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { metalMat, carpetMat, leatherMat } from '../../lib/materials'
import { createCarpetTexture } from '../../lib/textures'
import LiveScreen from '../ui/LiveScreen'
import type { ScreenKind } from '../../lib/screens'
import CityWindow from '../environment/CityWindow'
import { DeskProps, Laptop, DeskPhone } from '../props/OfficeProps'

const isHermesTUI = typeof __HERMES_TUI__ !== 'undefined' && __HERMES_TUI__

/* ---------- estación de trabajo: mesa + monitor + silla + objetos ---------- */
function Desk({ position, rotationY, kind, seed }: { position: [number, number, number]; rotationY: number; kind: ScreenKind; seed: number }) {
  const deskMat = useMemo(() => metalMat('#222a26', 0.5), [])
  const darkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0c0f0e', roughness: 0.7 }), [])
  const chairMat = useMemo(() => leatherMat('#141a17'), [])

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
      <LiveScreen kind={kind} seed={seed} size={[0.52, 0.32]} position={[0, 0.98, -0.31]} />
      <mesh position={[0, 0.82, -0.34]} material={darkMat}>
        <boxGeometry args={[0.08, 0.1, 0.05]} />
      </mesh>
      {/* microobjetos variados por seed */}
      <DeskProps position={[0, 0.775, 0]} seed={seed} />
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
  const carpetTex = useMemo(() => createCarpetTexture('#c9cdc9', 12), [])
  const carpet = useMemo(() => carpetMat(carpetTex), [carpetTex])
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

  /* 6 estaciones por departamento: fila 1 = WEB DEV, fila 2 = E-COMMERCE */
  const desks: { pos: [number, number, number]; rot: number; kind: ScreenKind; seed: number }[] = [
    { pos: [-1.5, 3.1, -0.5], rot: 0, kind: 'code', seed: 7 },
    { pos: [0, 3.1, -0.5], rot: 0, kind: 'code', seed: 13 },
    { pos: [1.5, 3.1, -0.5], rot: 0, kind: 'code', seed: 29 },
    { pos: [-1.5, 3.1, 0.9], rot: Math.PI, kind: 'sales', seed: 41 },
    { pos: [0, 3.1, 0.9], rot: Math.PI, kind: 'clients', seed: 53 },
    { pos: [1.5, 3.1, 0.9], rot: Math.PI, kind: 'metrics', seed: 67 },
  ]

  return (
    <group>
      {/* luces de oficina colgantes */}
      <pointLight position={[-1.6, 4.55, 0]} intensity={isHermesTUI ? 1.5 : 3} distance={5} color="#ffe6c0" />
      <pointLight position={[1.6, 4.55, 0]} intensity={isHermesTUI ? 1.5 : 3} distance={5} color="#ffe6c0" />

      {/* ---------- LOBBY ---------- */}
      <mesh position={[0, 1.11, 0]} rotation={[-Math.PI / 2, 0, 0]} material={carpet}>
        <planeGeometry args={[5.6, 4.4]} />
      </mesh>
      {/* ventanal del lobby con vista a Santiago */}
      <CityWindow position={[0, 1.75, -1.6]} width={2.6} height={1.2} />
      {/* mostrador de recepción */}
      <mesh position={[-1.3, 1.32, -1.15]} material={receptionMat}>
        <boxGeometry args={[2.2, 0.42, 0.55]} />
      </mesh>
      <mesh position={[-1.3, 1.16, -1.15]} material={receptionMat}>
        <boxGeometry args={[2.3, 0.08, 0.65]} />
      </mesh>
      {/* computador + teléfono de recepción */}
      <Laptop position={[-1.55, 1.5, -1.15]} rotation={0.3} screen="clients" seed={7} />
      <DeskPhone position={[-1.05, 1.51, -1.15]} rotation={-0.4} />
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
      <mesh position={[0, 2.37, 0]} rotation={[-Math.PI / 2, 0, 0]} material={carpet}>
        <planeGeometry args={[5.2, 4]} />
      </mesh>
      {/* ventanal de oficinas con vista a Santiago */}
      <CityWindow position={[0, 3.4, -1.6]} width={2.6} height={1.3} />
      {desks.map((d, i) => (
        <Desk key={i} position={d.pos} rotationY={d.rot} kind={d.kind} seed={d.seed} />
      ))}
      {/* wall screens por departamento: AUTOMATION (este) + IA (oeste) */}
      <LiveScreen kind="automation" seed={101} size={[1.7, 0.95]} position={[2.27, 3.45, -0.5]} rotation={[0, -Math.PI / 2, 0]} />
      <LiveScreen kind="ai" seed={202} size={[1.7, 0.95]} position={[-2.27, 3.45, 0.3]} rotation={[0, Math.PI / 2, 0]} />
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
