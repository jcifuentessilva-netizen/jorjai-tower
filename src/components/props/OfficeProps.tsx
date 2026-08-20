import { useMemo } from 'react'
import * as THREE from 'three'
import { metalMat, leatherMat } from '../../lib/materials'
import { createPaperTexture, createWhiteboardTexture } from '../../lib/textures'
import LiveScreen from '../ui/LiveScreen'

/* ------------------------------------------------------------------ */
/* Microobjetos reutilizables (artefactos reales de estudio UX):       */
/* briefs, wireframes, post-its, pizarra, botellas, audífonos...       */
/* ------------------------------------------------------------------ */

const porcelain = () => new THREE.MeshPhysicalMaterial({ color: '#f4f1ea', roughness: 0.2, clearcoat: 0.9 })
const glass = () => new THREE.MeshPhysicalMaterial({ color: '#cfe8dd', transmission: 0.7, roughness: 0.1, clearcoat: 0.8 })
const plastic = () => new THREE.MeshStandardMaterial({ color: '#2c3238', roughness: 0.35, metalness: 0.1 })
const paper = () => new THREE.MeshStandardMaterial({ color: '#f7f5ef', roughness: 0.9 })

export function Mug({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const m = useMemo(() => porcelain(), [])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.045, 0]} material={m}>
        <cylinderGeometry args={[0.05, 0.042, 0.09, 14]} />
      </mesh>
      <mesh position={[0.055, 0.045, 0]} rotation={[0, 0, Math.PI / 2]} material={m}>
        <torusGeometry args={[0.028, 0.01, 8, 12]} />
      </mesh>
    </group>
  )
}

export function WaterBottle({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const body = useMemo(() => glass(), [])
  const cap = useMemo(() => plastic(), [])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.07, 0]} material={body}>
        <cylinderGeometry args={[0.032, 0.032, 0.14, 12]} />
      </mesh>
      <mesh position={[0, 0.15, 0]} material={cap}>
        <cylinderGeometry args={[0.022, 0.022, 0.025, 10]} />
      </mesh>
    </group>
  )
}

export function PenHolder({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const cup = useMemo(() => metalMat('#3a4246', 0.35), [])
  const pen = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c0392b', roughness: 0.6 }), [])
  const pen2 = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2c3e50', roughness: 0.6 }), [])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.04, 0]} material={cup}>
        <cylinderGeometry args={[0.045, 0.04, 0.08, 12, 1, true]} />
      </mesh>
      <mesh position={[-0.015, 0.11, 0.01]} rotation={[0.25, 0, 0.4]} material={pen}>
        <cylinderGeometry args={[0.007, 0.007, 0.16, 6]} />
      </mesh>
      <mesh position={[0.012, 0.115, -0.008]} rotation={[-0.2, 0.3, -0.3]} material={pen2}>
        <cylinderGeometry args={[0.007, 0.007, 0.17, 6]} />
      </mesh>
      <mesh position={[-0.002, 0.11, -0.015]} rotation={[0.1, -0.4, 0.2]} material={leatherMat('#e67e22')}>
        <cylinderGeometry args={[0.007, 0.007, 0.15, 6]} />
      </mesh>
    </group>
  )
}

export function Papers({ position, rotation = 0, seed = 8 }: { position: [number, number, number]; rotation?: number; seed?: number }) {
  const tex = useMemo(() => createPaperTexture(seed), [seed])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 }), [tex])
  const plain = useMemo(() => paper(), [])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.004, 0]} material={plain}>
        <boxGeometry args={[0.2, 0.008, 0.14]} />
      </mesh>
      <mesh position={[0.012, 0.012, 0.006]} rotation={[0, 0.15, 0.02]} material={mat}>
        <boxGeometry args={[0.19, 0.006, 0.13]} />
      </mesh>
      <mesh position={[-0.008, 0.019, -0.004]} rotation={[0, -0.12, -0.02]} material={plain}>
        <boxGeometry args={[0.18, 0.005, 0.12]} />
      </mesh>
    </group>
  )
}

const POSTIT_COLORS = ['#f2e394', '#f2b56b', '#a8d8a0', '#f2a0a0']

export function PostIts({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const mats = useMemo(() => POSTIT_COLORS.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 })), [])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {POSTIT_COLORS.map((_, i) => (
        <mesh
          key={i}
          position={[(i % 2) * 0.06 - 0.015, 0.004 + i * 0.003, Math.floor(i / 2) * 0.05]}
          rotation={[0, (i - 1.5) * 0.12, (i % 2 ? 0.06 : -0.05)]}
          material={mats[i]}
        >
          <boxGeometry args={[0.055, 0.006, 0.055]} />
        </mesh>
      ))}
    </group>
  )
}

export function Headphones({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const mat = useMemo(() => plastic(), [])
  const pad = useMemo(() => leatherMat('#1a1d1b'), [])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.045, 0]} rotation={[0, 0, Math.PI / 2]} material={mat}>
        <torusGeometry args={[0.05, 0.012, 8, 18]} />
      </mesh>
      <mesh position={[-0.05, 0.02, 0]} material={pad}>
        <boxGeometry args={[0.02, 0.05, 0.035]} />
      </mesh>
      <mesh position={[0.05, 0.02, 0]} material={pad}>
        <boxGeometry args={[0.02, 0.05, 0.035]} />
      </mesh>
    </group>
  )
}

export function DeskPhone({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const m = useMemo(() => plastic(), [])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.018, 0]} material={m}>
        <boxGeometry args={[0.11, 0.036, 0.15]} />
      </mesh>
      <mesh position={[0, 0.04, 0.075]} rotation={[0.5, 0, 0]} material={m}>
        <boxGeometry args={[0.035, 0.03, 0.14]} />
      </mesh>
    </group>
  )
}

export function Laptop({ position, rotation = 0, screen = 'code', seed = 3 }: { position: [number, number, number]; rotation?: number; screen?: 'code' | 'clients'; seed?: number }) {
  const body = useMemo(() => metalMat('#23282c', 0.4), [])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.02, 0]} material={body}>
        <boxGeometry args={[0.32, 0.02, 0.22]} />
      </mesh>
      <group position={[0, 0.03, -0.105]} rotation={[-0.35, 0, 0]}>
        <mesh position={[0, 0.09, 0]} material={body}>
          <boxGeometry args={[0.32, 0.18, 0.012]} />
        </mesh>
        <LiveScreen kind={screen} seed={seed} size={[0.29, 0.165]} position={[0, 0.1, 0.006]} rotation={[-0.35, 0, 0]} />
      </group>
    </group>
  )
}

export function Whiteboard({ position, rotation, size = [1.3, 0.75] }: { position: [number, number, number]; rotation: [number, number, number]; size?: [number, number] }) {
  const tex = useMemo(() => createWhiteboardTexture(31), [])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, emissive: new THREE.Color('#ffffff'), emissiveMap: tex, emissiveIntensity: 0.15 }), [tex])
  const frame = useMemo(() => metalMat('#2a2f2c', 0.4), [])
  return (
    <group position={position} rotation={rotation}>
      <mesh material={frame}>
        <boxGeometry args={[size[0] + 0.06, size[1] + 0.06, 0.04]} />
      </mesh>
      <mesh position={[0, 0, 0.025]} material={mat}>
        <planeGeometry args={size} />
      </mesh>
      {/* marcadores */}
      <mesh position={[-size[0] / 2 + 0.06, -size[1] / 2 + 0.05, 0.035]} rotation={[Math.PI / 2, 0, 0]} material={leatherMat('#c0392b')}>
        <cylinderGeometry args={[0.008, 0.008, 0.09, 6]} />
      </mesh>
      <mesh position={[-size[0] / 2 + 0.13, -size[1] / 2 + 0.05, 0.035]} rotation={[Math.PI / 2, 0, 0]} material={leatherMat('#2c3e50')}>
        <cylinderGeometry args={[0.008, 0.008, 0.09, 6]} />
      </mesh>
    </group>
  )
}

/* ---------- combo por escritorio (variación por seed) ---------- */
/* position = superficie de la mesa; objetos a altura relativa       */
export function DeskProps({ position, seed = 0 }: { position: [number, number, number]; seed?: number }) {
  const variant = seed % 4
  return (
    <group position={position}>
      <Mug position={[0.5, 0.045, 0.2]} rotation={0.2} />
      {variant === 0 && <PenHolder position={[-0.5, 0.04, 0.1]} />}
      {variant === 1 && <Papers position={[-0.5, 0.02, 0.18]} rotation={0.25} seed={seed} />}
      {variant === 2 && <WaterBottle position={[-0.5, 0.04, 0.22]} />}
      {variant === 3 && <Headphones position={[0.52, 0.045, -0.1]} rotation={0.4} />}
      {seed % 2 === 0 && <PostIts position={[-0.45, 0.01, -0.12]} />}
      {seed % 3 === 0 && <DeskPhone position={[-0.52, 0.045, -0.22]} rotation={0.5} />}
    </group>
  )
}

/* ---------- mesa de reuniones: vasos, botellas, documentos ---------- */
export function MeetingProps({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-0.8, 0, 0.8].map((x, i) => (
        <Mug key={i} position={[x, 0.04, 0.35]} rotation={i * 0.5} />
      ))}
      <WaterBottle position={[1.0, 0.04, 0.1]} />
      <Papers position={[-0.4, 0.015, -0.3]} rotation={0.1} seed={5} />
      <Papers position={[0.5, 0.015, -0.35]} rotation={-0.15} seed={11} />
      <PostIts position={[0.15, 0.008, 0.25]} />
    </group>
  )
}

/* ---------- estudio creativo: lápices, tablet, storyboards, cámara ---------- */
export function StudioProps({ position }: { position: [number, number, number] }) {
  const body = useMemo(() => plastic(), [])
  const lens = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1a1e22', roughness: 0.3, metalness: 0.6 }),
    [],
  )
  return (
    <group position={position}>
      <PenHolder position={[-1.05, 0.04, -0.2]} rotation={0.3} />
      <PostIts position={[0.6, 0.008, 0.35]} rotation={0.2} />
      <Papers position={[0.95, 0.015, 0.1]} rotation={-0.1} seed={17} />
      <Papers position={[-0.55, 0.015, 0.3]} rotation={0.35} seed={23} />
      {/* tablet */}
      <mesh position={[0.2, 0.02, -0.3]} rotation={[0, -0.2, 0.03]} material={body}>
        <boxGeometry args={[0.2, 0.008, 0.3]} />
      </mesh>
      <LiveScreen kind="clients" seed={9} size={[0.18, 0.27]} position={[0.2, 0.025, -0.3]} rotation={[0, -0.2, 0.03]} />
      {/* cámara */}
      <group position={[-1.05, 0.04, 0.32]} rotation={[0, 0.5, 0]}>
        <mesh material={body}>
          <boxGeometry args={[0.09, 0.06, 0.11]} />
        </mesh>
        <mesh position={[0, 0, 0.06]} material={lens}>
          <cylinderGeometry args={[0.024, 0.03, 0.03, 10]} />
        </mesh>
        <mesh position={[0, 0.025, 0.03]} material={lens}>
          <boxGeometry args={[0.02, 0.02, 0.05]} />
        </mesh>
      </group>
    </group>
  )
}
