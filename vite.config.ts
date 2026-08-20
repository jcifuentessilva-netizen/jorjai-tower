import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // rutas relativas: funciona en GitHub Pages (subruta) y cualquier host
  define: {
    // Guard para Hermes TUI: evita OOM/crash con escenas 3D pesadas
    __HERMES_TUI__: JSON.stringify(!!process.env.HERMES_TUI),
  },
  preview: {
    // permite acceso vía Cloudflare Tunnel (trycloudflare.com)
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 1200, // vendor-3d (three+drei+postprocessing) se carga lazy
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-3d',
              test: /node_modules\/(three|@react-three|three-stdlib|troika|maath|@use-gesture|zustand|react-reconciler|its-fine)/,
            },
            {
              name: 'vendor-motion',
              test: /node_modules\/(gsap|lenis)/,
            },
          ],
        },
      },
    },
  },
})
