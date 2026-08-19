import { useEffect, useState } from 'react'
import { PHASES, type Phase } from '../../lib/xMachine'

/**
 * Overlay narrativo: muestra título/subtítulo de la fase activa.
 * Event-driven (sin polling) — escucha 'jorjai-phase-change'.
 */
export default function PhaseOverlay() {
  const [phase, setPhase] = useState<Phase>('apertura')

  useEffect(() => {
    const onPhase = (e: Event) => setPhase((e as CustomEvent<{ phase: Phase }>).detail.phase)
    window.addEventListener('jorjai-phase-change', onPhase)
    return () => window.removeEventListener('jorjai-phase-change', onPhase)
  }, [])

  const data = PHASES.find((p) => p.name === phase) ?? PHASES[0]
  const isHero = phase === 'apertura' || phase === 'cierre'

  return (
    <div className={`phase-overlay ${isHero ? 'hero' : ''}`} aria-live="polite">
      <div key={phase} className="phase-block">
        <p className="phase-kicker">{phase.replace(/-/g, ' ')}</p>
        <h1 className="phase-title">{data.title}</h1>
        {data.subtitle && <p className="phase-subtitle">{data.subtitle}</p>}
      </div>
    </div>
  )
}
