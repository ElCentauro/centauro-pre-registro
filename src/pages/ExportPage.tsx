
import React, { useState } from 'react';
import LoteSelector from '@/components/LoteSelector';
import PageHeader from '@/components/exportPage/PageHeader';
import ExportToExcel from '@/components/exportPage/ExportToExcel';
import PreRegistrosTable from '@/components/exportPage/PreRegistrosTable';
import { usePreRegistros } from '@/hooks/usePreRegistros';

const ExportPage = () => {
  const [selectedLote, setSelectedLote] = useState("");
  
  const { 
    data: preRegistros, 
    isLoading, 
    error 
  } = usePreRegistros(selectedLote);

  return (
    <div className="container py-8 mx-auto max-w-6xl">
      <div className="flex flex-col gap-8">
        <PageHeader />

        <div className="grid gap-6 p-6 rounded-lg border bg-card shadow-sm">
          <h2 className="text-xl font-semibold">Seleccionar y descargar datos</h2>
          
          <div className="grid gap-6 md:grid-cols-[1fr_auto]">
            <LoteSelector 
              value={selectedLote} 
              onChange={setSelectedLote}
              className="w-full"
            />
            
            <ExportToExcel 
              data={preRegistros || []} 
              lote={selectedLote} 
              isLoading={isLoading}
            />
          </div>
          
          {selectedLote && (
            <div className="mt-4">
              <PreRegistrosTable 
                preRegistros={preRegistros} 
                isLoading={isLoading} 
                error={error as Error | null}
                lote={selectedLote}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
