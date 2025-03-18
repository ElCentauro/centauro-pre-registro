
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
          'ui': ['@radix-ui/react-alert-dialog', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 
                '@radix-ui/react-select', '@radix-ui/react-toast', '@radix-ui/react-tooltip', 
                '@radix-ui/react-switch', '@radix-ui/react-navigation-menu', '@radix-ui/react-separator'],
          'data': ['@tanstack/react-query', '@supabase/supabase-js'],
        },
        // Optimizar carga
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
      // Resolver los módulos de Radix explícitamente
      external: [],
      preserveEntrySignatures: 'strict',
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
    // Manejar mejor los módulos de node
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
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
    // Mejorar la resolución de módulos
    dedupe: ['react', 'react-dom', 'react-router-dom'],
    // Asegurar que Vite puede encontrar todos los módulos
    preserveSymlinks: true,
  },
  // Optimizar caché
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      '@tanstack/react-query',
      // Incluir explícitamente los módulos de Radix UI
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-separator'
    ],
    esbuildOptions: {
      target: 'esnext',
      // Asegurar que ESBuild maneje correctamente los módulos de Node
      platform: 'browser',
      define: {
        global: 'globalThis',
      },
    }
  },
  // Configuración para manejar browser polyfills
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
}));
