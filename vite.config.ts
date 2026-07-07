import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Default '/' suits root hosting (Cloudflare Pages, local dev). The GitHub
  // Pages workflow sets VITE_BASE_PATH=/JiTpro-Website/ because that site is
  // served from a repo subpath.
  base: process.env.VITE_BASE_PATH || '/',

  plugins: [react()],

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
