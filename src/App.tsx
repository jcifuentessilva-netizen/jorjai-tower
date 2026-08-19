import { Suspense, lazy } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import CameraRig from './components/camera/CameraRig'
import AtmosphereRig from './components/atmosphere/AtmosphereRig'
import PhaseOverlay from './components/ui/PhaseOverlay'
import ContentPanels from './components/ui/ContentPanels'
import { useScrollController } from './hooks/useScrollController'

/* Escenas pesadas → chunks separados (lazy) */
const JorjaiTower = lazy(() => import('./components/protagonist/JorjaiTower'))
const CitySkyline = lazy(() => import('./components/environment/CitySkyline'))
const ChileMap = lazy(() => import('./components/environment/ChileMap'))
const QualityParticles = lazy(() => import('./components/atmosphere/QualityParticles'))
const Clouds = lazy(() => import('./components/atmosphere/Clouds'))

export default function App() {
  useScrollController()

  const isMobile =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  const dpr: [number, number] = __HERMES_TUI__ || isMobile ? [1, 1.5] : [1, 2]
  const shadowRes = __HERMES_TUI__ || isMobile ? 1024 : 2048

  return (
    <>
      {/* accesibilidad: salto directo a la cotización */}
      <a
        className="skip-link"
        href="#quote-cta"
        onClick={(e) => {
          e.preventDefault()
          const scroller = document.getElementById('scroller')
          const top = scroller ? scroller.offsetHeight * 0.93 : 0
          window.scrollTo({ top, behavior: __HERMES_TUI__ ? 'auto' : 'smooth' })
          document.getElementById('quote-cta')?.focus()
        }}
      >
        Saltar a cotización
      </a>

      {/* recorrido scroll-driven (1200vh = 11 escenas) */}
      <div id="scroller" aria-hidden="true" />

      <div className="stage">
        <Canvas
          dpr={dpr}
          shadows="soft"
          camera={{ position: [0, 4.2, 17], fov: 42 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            // fotografía arquitectónica nocturna: ACES + exposición controlada
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.12
          }}
        >
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 20, 46]} />

          {/* luz principal con sombras suaves */}
          <directionalLight
            position={[12, 18, 10]}
            intensity={1.1}
            color="#dfe9e4"
            castShadow
            shadow-mapSize-width={shadowRes}
            shadow-mapSize-height={shadowRes}
            shadow-camera-left={-14}
            shadow-camera-right={14}
            shadow-camera-top={16}
            shadow-camera-bottom={-3}
            shadow-camera-near={1}
            shadow-camera-far={45}
            shadow-bias={-0.0004}
          />

          {/* environment procedural (reflejos PBR): frío + cálido + acento neón */}
          <Environment resolution={64} frames={1}>
            <Lightformer intensity={2} color="#ffffff" position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[14, 14, 1]} />
            <Lightformer intensity={1.6} color="#cfe6ff" position={[-8, 3, -4]} rotation={[0, Math.PI / 2, 0]} scale={[8, 4, 1]} />
            <Lightformer intensity={1.1} color="#ffd9a0" position={[8, 2, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 3, 1]} />
            <Lightformer intensity={0.9} color="#42D879" position={[0, 1, 10]} rotation={[0, Math.PI, 0]} scale={[5, 2, 1]} />
          </Environment>

          <Suspense fallback={null}>
            <AtmosphereRig />
            <CameraRig />
            <CitySkyline />
            <ChileMap />
            <QualityParticles />
            <Clouds />
            <JorjaiTower />

            {/* bloom controlado solo fuera del TUI (evita OOM) */}
            {!__HERMES_TUI__ && (
              <EffectComposer>
                <Bloom mipmapBlur intensity={0.4} luminanceThreshold={0.85} luminanceSmoothing={0.2} />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>

        <PhaseOverlay />
        <ContentPanels />

        {/* boot screen mientras llega el primer chunk */}
        <div className="boot">
          <span className="boot-logo">JORJAI</span>
          <span className="boot-tag">Dar átomos a la IA</span>
        </div>
      </div>
    </>
  )
}
