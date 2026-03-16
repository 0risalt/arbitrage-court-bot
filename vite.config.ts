import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'd095eefaf3da1bf3-178-178-215-128.serveousercontent.com',
      '.serveousercontent.com',
      'localhost'
    ],
    host: true,
    port: 5173
  },
  // Добавьте эту секцию для правильных путей
  base: './',  // Важно! Использует относительные пути вместо абсолютных
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})