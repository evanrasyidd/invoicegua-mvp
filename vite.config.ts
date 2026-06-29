import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/*'],
      manifest: {
        name: 'InvoiceGua',
        short_name: 'InvoiceGua',
        description: 'Invoice & penawaran profesional, tanpa ribet',
        theme_color: '#0F0F0F',
        background_color: '#F9FAFB',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        icons: [
          { src: 'icons/192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,svg}'],
      },
    }),
  ],
  // @react-pdf/renderer needs these Node globals polyfilled in browser
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@react-pdf/renderer'],
  },
  build: {
    rollupOptions: {
      output: {
        // Split react-pdf into separate chunk — it's large (~1.5MB)
        manualChunks: {
          'react-pdf': ['@react-pdf/renderer'],
          'chart': ['chart.js', 'react-chartjs-2'],
          'framer': ['framer-motion'],
        },
      },
    },
  },
})
