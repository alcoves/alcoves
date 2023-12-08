import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'http://localhost:4000', // API Server
      },
      '/stream': {
        changeOrigin: true,
        target: 'http://localhost:4000', // API Server
      },
    },
  },
})
