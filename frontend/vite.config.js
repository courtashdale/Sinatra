// frontend root/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  envDir: '..',
  plugins: [
    react(),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
    }),
  ],
  publicDir: 'public',
  base: '/',
  server: {
    proxy: {
      '/callback': 'http://localhost:8000',
      '/login': 'http://localhost:8000',
      '/me': 'http://localhost:8000',
      '/genres': 'http://localhost:8000',
      '/impersonate': 'http://localhost:8000',
      '/now-playing': 'http://localhost:8000',
      '/update-playing': 'http://localhost:8000',
      '/public-genres': 'http://localhost:8000',
      '/check-recent': 'http://localhost:8000',
      '/playlists': 'http://localhost:8000',
      '/recently-played': 'http://localhost:8000',
      '/synced-playlists': 'http://localhost:8000',
      '/dashboard': 'http://localhost:8000',
      '/public-track': 'http://localhost:8000',
      '/user-playlists': 'http://localhost:8000',
      '/complete-onboarding': 'http://localhost:8000',
      '/playback': 'http://localhost:8000',
      '/delete-user': 'http://localhost:8000',
      '/refresh-session': 'http://localhost:8000',
      '/public-update-playing': 'http://localhost:8000',
      '/public-played': 'http://localhost:8000',
      '/ai-genres': 'http://localhost:8000',
      '/public-playlist': 'http://localhost:8000',
      '/playlist-info': 'http://localhost:8000',
      '/admin/sync_playlists': 'http://localhost:8000',
      '/spotify-playlists': 'http://localhost:8000',
      '/all-playlists': 'http://localhost:8000',
      '/docs': 'http://localhost:8000',
      '/openapi.json': 'http://localhost:8000',
      '/redoc': 'http://localhost:8000',
      '/static': 'http://localhost:8000',
      '/status': 'http://localhost:8000',
      '/add-playlists': 'http://localhost:8000',
      '/delete-playlists': 'http://localhost:8000',
      '/update-featured': 'http://localhost:8000',
      '/refresh_token': 'http://localhost:8000',
      '/top-tracks': 'http://localhost:8000',
      '/top-subgenre': 'http://localhost:8000',
      '/analyze-genres': 'http://localhost:8000',
      '/genre-map': 'http://localhost:8000',
      '/users': 'http://localhost:8000',
      '/user-genres': 'http://localhost:8000',
      '/public-profile': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
      '/refresh_genres': 'http://localhost:8000',
      '/spotify-me': 'http://localhost:8000',
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          d3: ['d3'],
          lucide: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
