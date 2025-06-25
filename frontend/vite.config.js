import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '$stores': path.resolve('./src/stores'),
      '$components': path.resolve('./src/components')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://shop50.onrender.com',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
}); 