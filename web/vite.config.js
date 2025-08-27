import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname,'../core'),
    },
  },
  assetsInclude: ['**/*.glb'],
  publicDir: 'public',
  server: {
    port: 5173,
    open: true,
  },
  base: './',
  build: {
    outDir: '../dist'
  }

});
