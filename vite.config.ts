import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router'],
          ui: ['@radix-ui/react-select', '@radix-ui/react-label'],
        },
      },
    },
  },
  // Configuration pour le serveur de développement
  server: {
    port: 5173,
    host: true,
  },
  // Configuration pour la preview (après build)
  preview: {
    port: 4173,
    host: true,
  },
})
