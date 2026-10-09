import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Embeddable widget build (dist/widget.js): one classic IIFE script with React and CSS inlined.
// Runs after the demo build, so it must not empty dist.
export default defineConfig({
  plugins: [react()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    copyPublicDir: false,
    lib: {
      entry: 'src/embed.tsx',
      formats: ['iife'],
      name: 'hmpFinderBundle',
      fileName: () => 'widget.js',
    },
  },
});
