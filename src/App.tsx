import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
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
          camera={{ position: [0, 4.2, 17], fov: 42 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 20, 46]} />
          <directionalLight position={[12, 18, 10]} intensity={1.4} color="#dfe9e4" />
          <Suspense fallback={null}>
            <AtmosphereRig />
            <CameraRig />
            <CitySkyline />
            <ChileMap />
            <QualityParticles />
            <Clouds />
            <JorjaiTower />
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
