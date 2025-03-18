
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-centauro-blue hover:text-centauro-blue/80">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">Exportar Pre-Registros</h1>
      </div>
      <img 
        src="/lovable-uploads/efd61c76-f816-451f-972b-7f816b6041c2.png" 
        alt="El Centauro" 
        className="h-12 md:h-16" 
        loading="eager"
        onError={(e) => {
          console.error('Error cargando imagen del logo en ExportPage');
          e.currentTarget.src = '/Centauro.png';
        }}
      />
    </div>
  );
};

export default PageHeader;
