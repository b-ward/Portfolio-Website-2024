import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
