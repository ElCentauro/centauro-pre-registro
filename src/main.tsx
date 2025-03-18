
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use createRoot API with stricter type checking
const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');
const root = createRoot(container);

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
        <p className="text-sm text-gray-600 mb-4">Si el problema persiste, contacte al administrador.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Intentar nuevamente
        </button>
      </div>
    </div>
  );
}
