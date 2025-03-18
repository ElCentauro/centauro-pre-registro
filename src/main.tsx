
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use createRoot API with stricter type checking
const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');
const root = createRoot(container);

// Custom error handler to improve error reporting
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Error boundary with improved error message
try {
  root.render(<App />);
} catch (error) {
  console.error('Error rendering application:', error);
  root.render(
    <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-red-600 mb-4">Error de carga</h1>
        <p className="text-gray-700 mb-2">Hubo un problema al cargar la aplicación.</p>
        <p className="text-sm text-gray-600 mb-4">La aplicación no pudo iniciar correctamente. Esto puede deberse a problemas de conexión.</p>
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Recargar la página
          </button>
          <button 
            onClick={() => {
              // Clear any cached data that might be causing issues
              if (window.caches) {
                caches.keys().then(names => {
                  names.forEach(name => {
                    caches.delete(name);
                  });
                });
              }
              window.location.reload(true);
            }} 
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Borrar caché y recargar
          </button>
        </div>
      </div>
    </div>
  );
}
