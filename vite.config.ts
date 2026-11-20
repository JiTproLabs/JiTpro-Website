import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Default '/' suits root hosting: production on Cloudflare Pages and local
  // dev. VITE_BASE_PATH overrides it only for a build served from a subpath.
  // (The retired GitHub Pages deployment used /JiTpro-Website/; its workflow
  // was deleted 2026-07-28, see CLAUDE.md "Deployment".)
  base: process.env.VITE_BASE_PATH || '/',

  plugins: [react()],

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
