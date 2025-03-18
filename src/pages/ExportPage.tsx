
import React, { useState } from 'react';
import LoteSelector from '@/components/LoteSelector';
import PageHeader from '@/components/exportPage/PageHeader';
import ExportToExcel from '@/components/exportPage/ExportToExcel';
import PreRegistrosTable from '@/components/exportPage/PreRegistrosTable';
import { usePreRegistros } from '@/hooks/usePreRegistros';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const ExportPage = () => {
  const [selectedLote, setSelectedLote] = useState("");
  const { toast } = useToast();
  
  const { 
    data: preRegistros, 
    isLoading, 
    error,
    isError
  } = usePreRegistros(selectedLote);

  // Show error toast once if there's an error
  React.useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error de conexión",
        description: "No se pudieron cargar los datos. Por favor intente nuevamente más tarde.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  return (
    <div className="container py-8 mx-auto max-w-6xl">
      <div className="flex flex-col gap-8">
        <PageHeader />

        {isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error de conexión</AlertTitle>
            <AlertDescription>
              Hubo un problema al cargar los datos. Por favor intente nuevamente.
            </AlertDescription>
          </Alert>
        )}

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
