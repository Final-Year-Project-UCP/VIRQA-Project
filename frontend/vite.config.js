import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173
  },
  optimizeDeps: {
    exclude: ['@ironsoftware/ironpdf']
  },
  build: {
    rollupOptions: {
      external: ['@ironsoftware/ironpdf']
    },
    chunkSizeWarningLimit: 2500
  }
})

