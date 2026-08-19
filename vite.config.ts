import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Guard para Hermes TUI: evita OOM/crash con escenas 3D pesadas
    __HERMES_TUI__: JSON.stringify(!!process.env.HERMES_TUI),
  },
  build: {
    chunkSizeWarningLimit: 1100, // vendor-3d (three+drei) se carga lazy
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
