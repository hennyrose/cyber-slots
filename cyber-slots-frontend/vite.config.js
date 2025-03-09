import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://2s3xdpykew.eu-central-1.awsapprunner.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
