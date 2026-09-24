import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` → offline PWA (dist/), `npm run build:single` → one self-contained HTML (dist-single/)
export default defineConfig(({ mode }) => {
  const single = mode === 'single'
  return {
    base: './',
    plugins: [
      react(),
      single
        ? viteSingleFile()
        : VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icon.svg'],
            workbox: { globPatterns: ['**/*.{js,css,html,svg,woff,woff2}'] },
            manifest: {
              name: 'Strážci Říma',
              short_name: 'Strážci Říma',
              description: 'Tajemství ztracených denárů – rodinná hra do Říma',
              lang: 'cs',
              theme_color: '#2A1D14',
              background_color: '#1E140D',
              display: 'standalone',
              orientation: 'portrait',
              icons: [
                { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
                { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
              ],
            },
          }),
    ],
    build: { outDir: single ? 'dist-single' : 'dist' },
  }
})
