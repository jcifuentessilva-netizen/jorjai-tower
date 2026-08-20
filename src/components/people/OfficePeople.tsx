import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { createFaceTexture } from '../../lib/textures'

/* ------------------------------------------------------------------ */
/* Personas procedurales semirealistas (entourage arquitectónico).     */
/* Proporciones humanas estándar, materiales PBR (piel/tela),          */
/* animaciones sutiles de trabajo (orchestrator: un solo useFrame).    */
/* ------------------------------------------------------------------ */

const isHermesTUI = typeof __HERMES_TUI__ !== 'undefined' && __HERMES_TUI__
const isMobile =
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

type Mode = 'typing' | 'looking' | 'meeting' | 'standing'

interface Rig {
  body: THREE.Group
  head: THREE.Group
  lFore: THREE.Group
  rFore: THREE.Group
  lArm: THREE.Group
  rArm: THREE.Group
  mode: Mode
  phase: number
  speed: number
  height: number
}

/* geometrías compartidas (módulo, sin alloc por frame) */
const GEO = {
  torso: new THREE.CapsuleGeometry(0.24, 0.46, 4, 14),
  head: new THREE.SphereGeometry(0.155, 22, 22),
  hair: new THREE.SphereGeometry(0.165, 18, 18),
  upperArm: new THREE.CapsuleGeometry(0.055, 0.22, 4, 8),
  foreArm: new THREE.CapsuleGeometry(0.045, 0.2, 4, 8),
  hand: new THREE.SphereGeometry(0.05, 10, 10),
  thigh: new THREE.CapsuleGeometry(0.09, 0.34, 4, 8),
  shin: new THREE.CapsuleGeometry(0.07, 0.32, 4, 8),
  shoe: new THREE.BoxGeometry(0.1, 0.06, 0.22),
}

const SHIRTS = ['#e8ece9', '#a7b0aa', '#0B3D25', '#2a2e2c', '#d9d4cc']
const PANTS = ['#1c2126', '#2c3138', '#3a352e']
const HAIR = ['#1a1410', '#2b2118', '#0d0d0d', '#4a3a28', '#6b5a44']

/* rigs vivos (registro para el orchestrator) */
const rigs: Rig[] = []

function animateRig(r: Rig, t: number): void {
  const { mode, phase, speed, body, head, lArm, rArm, lFore, rFore } = r
  const tt = t * speed + phase

  // respiración sutil
  body.position.y = Math.sin(tt * 1.4) * 0.008

  if (mode === 'typing') {
    // brazos al frente tecleando (fase opuesta)
    lArm.rotation.x = -1.25
    rArm.rotation.x = -1.25
    lFore.rotation.x = -0.55 + Math.sin(tt * 11) * 0.16
    rFore.rotation.x = -0.55 + Math.sin(tt * 11 + Math.PI) * 0.16
    head.rotation.y = Math.sin(tt * 0.5) * 0.06
    head.rotation.x = 0.08
  } else if (mode === 'looking') {
    // reposo en mesa, cabeza escanea pantalla
    lArm.rotation.x = -1.15
    rArm.rotation.x = -1.15
    lFore.rotation.x = -0.3
    rFore.rotation.x = -0.3
    head.rotation.y = Math.sin(tt * 0.8) * 0.22
    head.rotation.x = -0.04
  } else if (mode === 'meeting') {
    // brazos en la mesa, atención fija
    lArm.rotation.x = -1.05
    rArm.rotation.x = -1.05
    lFore.rotation.x = -0.2
    rFore.rotation.x = -0.2
    head.rotation.y = Math.sin(tt * 0.35) * 0.1
  } else {
    // de pie: brazos al costado, sway
    lArm.rotation.x = 0.08 + Math.sin(tt * 0.9) * 0.05
    rArm.rotation.x = 0.08 - Math.sin(tt * 0.9) * 0.05
    lFore.rotation.x = 0.1
    rFore.rotation.x = 0.1
    body.rotation.z = Math.sin(tt * 0.7) * 0.015
  }
}

function Person({
  position,
  rotationY,
  mode,
  seed,
  height = 1,
}: {
  position: [number, number, number]
  rotationY: number
  mode: Mode
  seed: number
  height?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const lArmRef = useRef<THREE.Group>(null)
  const rArmRef = useRef<THREE.Group>(null)
  const lForeRef = useRef<THREE.Group>(null)
  const rForeRef = useRef<THREE.Group>(null)

  const shirt = useMemo(() => SHIRTS[(seed >> 1) % SHIRTS.length], [seed])
  const pants = useMemo(() => PANTS[(seed >> 2) % PANTS.length], [seed])
  const hair = useMemo(() => HAIR[(seed >> 3) % HAIR.length], [seed])
  const faceTex = useMemo(() => createFaceTexture(seed), [seed])

  const mats = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.6 }),
      shirt: new THREE.MeshStandardMaterial({ color: shirt, roughness: 0.85 }),
      pants: new THREE.MeshStandardMaterial({ color: pants, roughness: 0.9 }),
      hair: new THREE.MeshStandardMaterial({ color: hair, roughness: 0.92 }),
    }),
    [faceTex, shirt, pants, hair],
  )

  /* registro del rig en el orchestrator */
  useEffect(() => {
    const rig: Rig = {
      body: bodyRef.current!,
      head: headRef.current!,
      lFore: lForeRef.current!,
      rFore: rForeRef.current!,
      lArm: lArmRef.current!,
      rArm: rArmRef.current!,
      mode,
      phase: seed * 1.7,
      speed: 0.9 + (seed % 5) * 0.12,
      height,
    }
    rigs.push(rig)
    return () => {
      const i = rigs.indexOf(rig)
      if (i >= 0) rigs.splice(i, 1)
    }
  }, [mode, seed, height])

  const sit = mode !== 'standing'
  const hipY = sit ? 0.46 : 0.95

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]} scale={[height, height, height]}>
      {/* piernas */}
      <mesh position={[-0.11, hipY - 0.2, 0]} material={mats.pants} geometry={GEO.thigh} />
      <mesh position={[0.11, hipY - 0.2, 0]} material={mats.pants} geometry={GEO.thigh} />
      <mesh position={[-0.11, hipY - 0.62, 0.01]} material={mats.pants} geometry={GEO.shin} />
      <mesh position={[0.11, hipY - 0.62, 0.01]} material={mats.pants} geometry={GEO.shin} />
      <mesh position={[-0.11, hipY - 0.82, 0.07]} material={mats.pants} geometry={GEO.shoe} />
      <mesh position={[0.11, hipY - 0.82, 0.07]} material={mats.pants} geometry={GEO.shoe} />

      {/* torso + cabeza */}
      <group ref={bodyRef} position={[0, hipY + 0.32, 0]} rotation={[sit ? 0.07 : 0, 0, 0]}>
        <mesh position={[0, 0.3, 0]} material={mats.shirt} geometry={GEO.torso} />
        {/* hombros */}
        <mesh position={[-0.27, 0.58, 0]} material={mats.shirt} geometry={GEO.upperArm} rotation={[0, 0, Math.PI / 2]} />
        <mesh position={[0.27, 0.58, 0]} material={mats.shirt} geometry={GEO.upperArm} rotation={[0, 0, Math.PI / 2]} />

        {/* cabeza con cabello */}
        <group ref={headRef} position={[0, 0.86, 0]}>
          <mesh material={mats.skin} geometry={GEO.head} />
          <mesh material={mats.hair} geometry={GEO.hair} scale={[1.02, 0.88, 1.02]} position={[0, 0.06, -0.01]} />
        </group>

        {/* brazos articulados (pivote hombro → codo → mano) */}
        <group ref={lArmRef} position={[-0.27, 0.58, 0]}>
          <mesh position={[0, -0.13, 0]} material={mats.shirt} geometry={GEO.upperArm} />
          <group ref={lForeRef} position={[0, -0.27, 0]}>
            <mesh position={[0, -0.12, 0]} material={mats.skin} geometry={GEO.foreArm} />
            <mesh position={[0, -0.26, 0]} material={mats.skin} geometry={GEO.hand} />
          </group>
        </group>
        <group ref={rArmRef} position={[0.27, 0.58, 0]}>
          <mesh position={[0, -0.13, 0]} material={mats.shirt} geometry={GEO.upperArm} />
          <group ref={rForeRef} position={[0, -0.27, 0]}>
            <mesh position={[0, -0.12, 0]} material={mats.skin} geometry={GEO.foreArm} />
            <mesh position={[0, -0.26, 0]} material={mats.skin} geometry={GEO.hand} />
          </group>
        </group>
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Distribución: 6 estaciones + recepción + estudio creativo           */
/* ------------------------------------------------------------------ */
export default function OfficePeople() {
  const count = isHermesTUI ? 2 : isMobile ? 4 : 12

  const placements = useMemo(() => {
    const all: { pos: [number, number, number]; rot: number; mode: Mode; seed: number; height?: number }[] = [
      // oficinas (piso 2-3, suelo y=2.37) — en las sillas de cada estación
      { pos: [-1.5, 2.37, -0.92], rot: 0, mode: 'typing', seed: 1 },
      { pos: [0, 2.37, -0.92], rot: 0, mode: 'typing', seed: 5 },
      { pos: [1.5, 2.37, -0.92], rot: 0, mode: 'looking', seed: 9 },
      { pos: [-1.5, 2.37, 1.32], rot: Math.PI, mode: 'typing', seed: 13 },
      { pos: [0, 2.37, 1.32], rot: Math.PI, mode: 'meeting', seed: 17 },
      { pos: [1.5, 2.37, 1.32], rot: Math.PI, mode: 'typing', seed: 21 },
      // lobby: recepcionista de pie tras el mostrador
      { pos: [-1.3, 1.11, -1.5], rot: 0, mode: 'standing', seed: 25, height: 0.95 },
      // estudio creativo: 2 conversando junto a la mesa
      { pos: [-0.8, 4.87, 1.35], rot: -0.5, mode: 'standing', seed: 29 },
      { pos: [0.85, 4.87, 1.4], rot: 2.7, mode: 'standing', seed: 33 },
      // sala de reuniones (piso 4): ejecutivos en la mesa
      { pos: [-0.9, 3.62, 0.78], rot: Math.PI, mode: 'meeting', seed: 37 },
      { pos: [0.9, 3.62, 0.78], rot: Math.PI, mode: 'meeting', seed: 41 },
      { pos: [1.62, 3.62, 0], rot: -Math.PI / 2, mode: 'meeting', seed: 45 },
    ]
    return all.slice(0, count)
  }, [count])

  useFrame(({ clock }) => {
    for (const r of rigs) animateRig(r, clock.elapsedTime)
  })

  return (
    <group>
      {placements.map((p, i) => (
        <Person key={i} position={p.pos} rotationY={p.rot} mode={p.mode} seed={p.seed} height={p.height} />
      ))}
    </group>
  )
}
