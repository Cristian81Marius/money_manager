import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    // Forward all /api requests to the Java Spring Boot backend during development.
    // Requires the backend to be running on port 8080 (Spring Boot default).
    // Override the backend port by setting VITE_API_BASE_URL in .env.local instead.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
