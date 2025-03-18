
import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface PreRegistrosTableProps {
  preRegistros: any[] | null;
  isLoading: boolean;
  error: Error | null;
  lote: string;
}

const PreRegistrosTable = ({ preRegistros, isLoading, error, lote }: PreRegistrosTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-centauro-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error al cargar los datos. Por favor, intente nuevamente.</p>
      </div>
    );
  }

  if (!preRegistros || preRegistros.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No se encontraron registros para el Lote {lote}.</p>
      </div>
    );
  }

  return (
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
  );
};

export default PreRegistrosTable;
