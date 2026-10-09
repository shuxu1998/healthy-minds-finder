import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Demo page build (dist/index.html). Relative base so it works under any GitHub Pages path.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: { outDir: 'dist', emptyOutDir: true },
});
