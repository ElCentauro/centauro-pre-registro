
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    // Reduce chunks and optimize bundle
    chunkSizeWarningLimit: 1500,
    // Mejorar carga de assets y reducir tamaño del paquete
    assetsInlineLimit: 4096,
    // Use esbuild for minification instead of terser
    minify: 'esbuild',
    // Disable compressed size reporting to improve build speed
    reportCompressedSize: false,
    // Improve build performance
    target: 'es2019',
    rollupOptions: {
      output: {
        // Limit chunks to improve loading time
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@radix-ui/react-toast', '@radix-ui/react-tooltip']
        }
      }
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      '@tanstack/react-query',
      'xlsx'
    ],
    esbuildOptions: {
      target: 'es2019',
    }
  },
}));
