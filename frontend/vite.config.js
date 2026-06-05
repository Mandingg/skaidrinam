import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  optimizeDeps: {
    include: ['react-plotly.js']
  },
build: {
    commonjsOptions: {
      include: [/react-plotly.js/, /node_modules/]
    }
  }
})
