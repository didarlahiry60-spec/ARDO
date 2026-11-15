import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ardoApiPlugin } from './server/apiMiddleware.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ardoApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
})
