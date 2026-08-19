import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { derivePhase } from '../lib/xMachine'

gsap.registerPlugin(ScrollTrigger)

/**
 * Motor narrativo: Lenis (scroll suave) + GSAP ScrollTrigger.
 * Publica el progreso global (0..1) en window.__JORJAI_PROGRESS__ y
 * emite 'jorjai-phase-change' al cruzar cada fase (event-driven, sin polling).
 * En Hermes TUI el Lenis se desactiva (scroll nativo) para evitar crashes.
 */
export function useScrollController() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ smoothWheel: !reduced && !__HERMES_TUI__, lerp: 0.09 })

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    lenis.on('scroll', ScrollTrigger.update)

    let lastPhase = derivePhase(0)
    const st = ScrollTrigger.create({
      trigger: '#scroller',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        window.__JORJAI_PROGRESS__ = self.progress
        const phase = derivePhase(self.progress)
        if (phase !== lastPhase) {
          lastPhase = phase
          window.dispatchEvent(new CustomEvent('jorjai-phase-change', { detail: { phase } }))
        }
      },
    })

    return () => {
      cancelAnimationFrame(raf)
      st.kill()
      lenis.destroy()
    }
  }, [])
}
