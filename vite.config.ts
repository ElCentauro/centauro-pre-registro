
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
      timeout: 5000,
    },
  },
  build: {
    // Optimize for production
    chunkSizeWarningLimit: 2000,
    assetsInlineLimit: 2048, // 2kb
    minify: 'esbuild',
    reportCompressedSize: false,
    target: 'es2019',
    sourcemap: false, // Disable sourcemaps in production for smaller bundles
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
