
import React from 'react';
import { Link } from 'react-router-dom';
import PreRegistroForm from '@/components/PreRegistroForm';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-between items-center">
            <div className="flex-1"></div>
            <img 
              className="mx-auto h-24 sm:h-32 centauro-logo" 
              src="/Centauro.png" 
              alt="Centauro Logo" 
            />
            <div className="flex-1 flex justify-end">
              <Link to="/export">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Exportar datos</span>
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
            Pre-Registro Entrada el Centauro
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Complete el siguiente formulario para registrar su ingreso
          </p>
        </div>
        
        <PreRegistroForm />
        
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} El Centauro. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
