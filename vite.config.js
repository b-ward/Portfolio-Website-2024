import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // react-bootstrap is being removed phase-by-phase (Phases 2–7).
    // Externalising it keeps the build passing until all per-component
    // imports are replaced with Tailwind equivalents.
    rollupOptions: {
      external: ['react-bootstrap'],
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      // Proxy requests starting with /sportradar to the Sportradar API
      // Dev only; this avoids CORS errors during local development.
      '/sportradar': {
        target: 'https://api.sportradar.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/sportradar/, ''),
      },
    },
  },
})
