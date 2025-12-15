import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  //this is temporary just for the forwarding the port 
  server: {
    host: true,        // 🔥 required
    port: 5173
  }
})
