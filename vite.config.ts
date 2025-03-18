
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
    // Optimizaciones para producción
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@radix-ui/*'],
          'data': ['@tanstack/react-query', '@supabase/supabase-js'],
        },
        // Optimizar carga
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // Mejorar carga de assets y reducir tamaño del paquete
    assetsInlineLimit: 4096,
    // Comprimir el output
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Mantener console.logs para diagnóstico
        drop_debugger: true,
      },
    },
    // Reporte de tamaño de bundle
    reportCompressedSize: true,
    // Mejorar rendimiento de compilación
    target: 'esnext',
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimizar caché
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    esbuildOptions: {
      target: 'esnext',
    }
  },
}));
