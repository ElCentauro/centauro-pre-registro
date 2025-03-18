
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoteSelector from '@/components/LoteSelector';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, FileSpreadsheet, Loader2 } from 'lucide-react';

const ExportPage = () => {
  const [selectedLote, setSelectedLote] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  
  const { data: preRegistros, isLoading, error, refetch } = useQuery({
    queryKey: ['preRegistros', selectedLote],
    queryFn: async () => {
      if (!selectedLote) return [];
      
      const { data, error } = await supabase
        .from('pre_registros')
        .select('*')
        .eq('lote', selectedLote)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedLote,
  });

  const handleExportToExcel = async () => {
    if (!preRegistros || preRegistros.length === 0) {
      toast({
        title: "No hay datos para exportar",
        description: "No se encontraron registros para el lote seleccionado.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExporting(true);
      
      // Format dates for Excel
      const formattedData = preRegistros.map(registro => ({
        'Nombre': registro.nombre,
        'Apellido': registro.apellido,
        'DNI': registro.dni,
        'Sexo': registro.sexo,
        'Vencimiento Licencia': format(new Date(registro.vencimiento_licencia), 'dd/MM/yyyy'),
        'Patente': registro.patente,
        'Marca': registro.marca,
        'Modelo': registro.modelo,
        'Aseguradora': registro.aseguradora,
        'Póliza': registro.poliza,
        'Vencimiento Póliza': format(new Date(registro.vencimiento_poliza), 'dd/MM/yyyy'),
        'Registrado Anteriormente': registro.registrado_anteriormente,
        'Fecha de Registro': format(new Date(registro.created_at), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es }),
      }));
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(formattedData, { header: Object.keys(formattedData[0]) });
      
      // Set column widths
      const colWidths = [
        { wch: 15 }, // Nombre
        { wch: 15 }, // Apellido
        { wch: 12 }, // DNI
        { wch: 10 }, // Sexo
        { wch: 20 }, // Vencimiento Licencia
        { wch: 12 }, // Patente
        { wch: 15 }, // Marca
        { wch: 15 }, // Modelo
        { wch: 20 }, // Aseguradora
        { wch: 20 }, // Póliza
        { wch: 20 }, // Vencimiento Póliza
        { wch: 15 }, // Registrado Anteriormente
        { wch: 30 }, // Fecha de Registro
      ];
      
      ws['!cols'] = colWidths;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, `Lote ${selectedLote}`);
      
      // Generate Excel file
      const currentDate = format(new Date(), 'dd-MM-yyyy');
      XLSX.writeFile(wb, `Pre-Registros_Lote${selectedLote}_${currentDate}.xlsx`);
      
      toast({
        title: "Exportación exitosa",
        description: `Se han exportado ${preRegistros.length} registros a Excel.`,
      });
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      toast({
        title: "Error al exportar",
        description: "Ocurrió un error al exportar los datos a Excel.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container py-8 mx-auto max-w-6xl">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-centauro-blue hover:text-centauro-blue/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Exportar Pre-Registros</h1>
          </div>
          <img src="/lovable-uploads/674ad7a4-bf8f-465e-9e95-f4e7de251422.png" alt="El Centauro" className="h-12 md:h-16" />
        </div>

        <div className="grid gap-6 p-6 rounded-lg border bg-card shadow-sm">
          <h2 className="text-xl font-semibold">Seleccionar y descargar datos</h2>
          
          <div className="grid gap-6 md:grid-cols-[1fr_auto]">
            <LoteSelector 
              value={selectedLote} 
              onChange={setSelectedLote}
              className="w-full"
            />
            
            <Button 
              onClick={handleExportToExcel} 
              disabled={!selectedLote || isExporting || isLoading || preRegistros?.length === 0}
              className="h-12 px-6 gap-2 bg-green-600 hover:bg-green-700"
            >
              {isExporting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-5 w-5" />
              )}
              Descargar a Excel
            </Button>
          </div>
          
          {selectedLote && (
            <div className="mt-4">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-centauro-blue" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  <p>Error al cargar los datos. Por favor, intente nuevamente.</p>
                </div>
              ) : preRegistros?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No se encontraron registros para el Lote {selectedLote}.</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Apellido</TableHead>
                          <TableHead>DNI</TableHead>
                          <TableHead>Patente</TableHead>
                          <TableHead>Fecha de Registro</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {preRegistros.map((registro) => (
                          <TableRow key={registro.id}>
                            <TableCell className="font-medium">{registro.nombre}</TableCell>
                            <TableCell>{registro.apellido}</TableCell>
                            <TableCell>{registro.dni}</TableCell>
                            <TableCell>{registro.patente}</TableCell>
                            <TableCell>
                              {format(new Date(registro.created_at), "dd/MM/yyyy, HH:mm")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="bg-slate-50 p-2 text-sm text-muted-foreground border-t">
                    Total: {preRegistros.length} registros encontrados
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
