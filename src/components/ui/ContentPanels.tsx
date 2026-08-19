import { useEffect, useState } from 'react'
import { PHASES, type Phase } from '../../lib/xMachine'

/* ---------------- Contador animado ---------------- */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const DUR = 1400
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / DUR)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return (
    <span className="stat-value">
      {n.toLocaleString('es-CL')}
      {suffix}
    </span>
  )
}

/* ---------------- Servicios (fase labs) ---------------- */
const SERVICES = [
  { k: 'Web', d: 'Landing y sitios que convierten' },
  { k: 'E-commerce', d: 'Tiendas integradas con pagos' },
  { k: 'Automatización', d: 'Procesos que trabajan solos' },
  { k: 'IA', d: 'Inteligencia aplicada a tu negocio' },
]

function ServicesPanel() {
  return (
    <aside className="glass-panel services-panel">
      <h3 className="panel-title">Qué construimos</h3>
      <ul className="service-list">
        {SERVICES.map((s) => (
          <li key={s.k} className="service-item">
            <span className="service-key">{s.k}</span>
            <span className="service-desc">{s.d}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

/* ---------------- Datos (fase datos) ---------------- */
const STATS = [
  { to: 47, suffix: '+', label: 'Proyectos entregados' },
  { to: 32, suffix: '+', label: 'Clientes digitalizados' },
  { to: 99, suffix: '.9%', label: 'Uptime de sistemas' },
  { to: 100, suffix: '%', label: 'Código propio' },
]

function StatsPanel() {
  return (
    <aside className="glass-panel stats-panel">
      <h3 className="panel-title">JORJAI en números</h3>
      <ul className="stats-grid">
        {STATS.map((s) => (
          <li key={s.label} className="stat-item">
            <Counter to={s.to} suffix={s.suffix} />
            <span className="stat-label">{s.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

/* ---------------- Conversión (fase conversion) ---------------- */
function QuotePanel() {
  const [name, setName] = useState('')
  const [service, setService] = useState('')
  const waLink = `https://wa.me/56966101914?text=${encodeURIComponent(
    `Hola JORJAI 👋 Soy ${name || 'un cliente'} y quiero cotizar: ${service || 'un proyecto digital'}`,
  )}`

  return (
    <aside className="glass-panel quote-panel">
      <h3 className="panel-title">Cotiza tu proyecto</h3>
      <p className="quote-hint">Cuéntanos qué necesitas y te respondemos por WhatsApp.</p>
      <input
        className="glass-input"
        placeholder="Tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="Tu nombre"
      />
      <input
        className="glass-input"
        placeholder="¿Qué necesitas? (web, tienda, automatización…)"
        value={service}
        onChange={(e) => setService(e.target.value)}
        aria-label="Qué necesitas"
      />
      <a className="cta-button" id="quote-cta" href={waLink} target="_blank" rel="noreferrer">
        Cotizar por WhatsApp →
      </a>
    </aside>
  )
}

/* ---------------- Contenedor por fase ---------------- */
export default function ContentPanels() {
  const [phase, setPhase] = useState<Phase>('apertura')

  useEffect(() => {
    const onPhase = (e: Event) => setPhase((e as CustomEvent<{ phase: Phase }>).detail.phase)
    window.addEventListener('jorjai-phase-change', onPhase)
    return () => window.removeEventListener('jorjai-phase-change', onPhase)
  }, [])

  const data = PHASES.find((p) => p.name === phase) ?? PHASES[0]

  return (
    <div className="content-panels" key={phase} aria-live="polite">
      {phase === 'labs' && <ServicesPanel />}
      {phase === 'datos' && <StatsPanel />}
      {phase === 'conversion' && <QuotePanel />}
      {/* hint sutil de scroll en todas las fases */}
      <p className="phase-hint">{data.subtitle}</p>
    </div>
  )
}
