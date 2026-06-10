import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  base: '/',
  plugins: [react(), glsl({ minify: true })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return
          if (
            id.includes('three') ||
            id.includes('postprocessing') ||
            id.includes('maath')
          ) {
            return 'vendor-three'
          }
          if (id.includes('react') || id.includes('scheduler')) {
            return 'vendor-react'
          }
        },
      },
    },
  },
})
