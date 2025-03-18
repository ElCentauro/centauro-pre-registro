
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Loader2 } from 'lucide-react';

interface ExportToExcelProps {
  data: any[];
  lote: string;
  isLoading: boolean;
}

const ExportToExcel = ({ data, lote, isLoading }: ExportToExcelProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportToExcel = async () => {
    if (!data || data.length === 0) {
      toast({
        title: "No hay datos para exportar",
        description: "No se encontraron registros para el lote seleccionado.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExporting(true);
      
      // Format data for export
      const formattedData = data.map(registro => ({
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
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 10 },
        { wch: 20 },
        { wch: 12 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 30 },
      ];
      
      ws['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(wb, ws, `Lote ${lote}`);
      
      // Generate and download file
      const currentDate = format(new Date(), 'dd-MM-yyyy');
      XLSX.writeFile(wb, `Pre-Registros_Lote${lote}_${currentDate}.xlsx`);
      
      toast({
        title: "Exportación exitosa",
        description: `Se han exportado ${data.length} registros a Excel.`,
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
    <Button 
      onClick={handleExportToExcel} 
      disabled={!lote || isExporting || isLoading || data?.length === 0}
      className="h-12 px-6 gap-2 bg-green-600 hover:bg-green-700"
    >
      {isExporting ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <FileSpreadsheet className="h-5 w-5" />
      )}
      Descargar a Excel
    </Button>
  );
};

export default ExportToExcel;
