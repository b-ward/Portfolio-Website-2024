import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Stub plugin: resolves react-bootstrap imports during phased migration (Phases 2–7).
// Serves a virtual module exporting pass-through components so both the dev server
// and the production build work while per-component replacement is in progress.
function reactBootstrapStub() {
  const VIRTUAL = '\0react-bootstrap-stub'
  return {
    name: 'react-bootstrap-stub',
    enforce: 'pre',
    resolveId(id) { if (id === 'react-bootstrap') return VIRTUAL },
    load(id) {
      if (id !== VIRTUAL) return
      return `import{createElement,Fragment}from'react'
const C=({children})=>createElement(Fragment,null,children)
export{C as Button,C as Card,C as CardGroup,C as Carousel,C as Col,C as Container,C as Modal,C as Nav,C as NavDropdown,C as Navbar,C as Row,C as Table}
export default{}`
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), reactBootstrapStub()],
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
