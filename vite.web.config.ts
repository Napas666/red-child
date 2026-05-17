import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standalone web build (GitHub Pages)
export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'src/renderer'),
  base: '/red-child/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer/src')
    }
  },
  build: {
    outDir: resolve(__dirname, 'dist-web'),
    emptyOutDir: true
  }
})
