import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ChevecCalc · Precio por mililitro',
        short_name: 'ChevecCalc',
        description:
          'Calcula y compara el precio por mililitro de tus cervezas: latas, botellas, caguamas y más.',
        lang: 'es',
        start_url: '/',
        display: 'standalone',
        background_color: '#12100d',
        theme_color: '#12100d',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
