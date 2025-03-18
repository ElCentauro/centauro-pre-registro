
import React, { useState, useEffect } from 'react';
import LoteSelector from '@/components/LoteSelector';
import PageHeader from '@/components/exportPage/PageHeader';
import ExportToExcel from '@/components/exportPage/ExportToExcel';
import PreRegistrosTable from '@/components/exportPage/PreRegistrosTable';
import { usePreRegistros } from '@/hooks/usePreRegistros';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ExportPage = () => {
  const [selectedLote, setSelectedLote] = useState("");
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  
  const { 
    data: preRegistros, 
    isLoading, 
    error,
    isError,
    refetch
  } = usePreRegistros(selectedLote);

  // Show error toast once if there's an error
  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error de conexión",
        description: "No se pudieron cargar los datos. Por favor intente nuevamente más tarde.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
    toast({
      title: "Reintentando conexión",
      description: "Intentando cargar los datos nuevamente...",
    });
  };

  return (
    <div className="container py-8 mx-auto max-w-6xl">
      <div className="flex flex-col gap-8">
        <PageHeader />

        {isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error de conexión</AlertTitle>
            <AlertDescription className="flex flex-col gap-4">
              <p>Hubo un problema al cargar los datos. El servidor puede estar ocupado o la conexión es inestable.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-fit flex gap-2 items-center" 
                onClick={handleRetry}
              >
                <RefreshCcw className="h-4 w-4" />
                Reintentar conexión
              </Button>
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
