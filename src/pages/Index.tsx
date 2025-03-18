
import React from 'react';
import PreRegistroForm from '@/components/PreRegistroForm';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <img 
            className="mx-auto h-24 sm:h-32 centauro-logo" 
            src="/Centauro.png" 
            alt="Centauro Logo" 
          />
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
