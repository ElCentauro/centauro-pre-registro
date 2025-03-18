
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      // Improved HMR configuration
      timeout: 5000,
    },
  },
  build: {
    // Further optimized build options
    chunkSizeWarningLimit: 1600,
    assetsInlineLimit: 4096,
    minify: 'esbuild',
    reportCompressedSize: false,
    target: 'es2019',
    sourcemap: mode === 'development',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@radix-ui/react-toast', '@radix-ui/react-tooltip'],
          'data': ['@tanstack/react-query', 'xlsx'],
        }
      }
    },
  },
  plugins: [
    react({
      // Add SWC optimization options
      jsxImportSource: 'react',
      tsDecorators: false,
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      '@tanstack/react-query',
      'xlsx',
      'date-fns',
      'lucide-react',
    ],
    esbuildOptions: {
      target: 'es2019',
    }
  },
}));
