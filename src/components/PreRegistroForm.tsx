
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, CheckIcon, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import LoteSelector from './LoteSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

const PreRegistroForm = () => {
  const [lote, setLote] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    sexo: '',
    vencimientoLicencia: undefined as Date | undefined,
    patente: '',
    marca: '',
    modelo: '',
    aseguradora: '',
    poliza: '',
    vencimientoPoliza: undefined as Date | undefined,
    registradoAnteriormente: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleLoteChange = (value: string) => {
    setLote(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear the error for this field if it exists
    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear the error for this field if it exists
    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
    }
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData({
      ...formData,
      [name]: date
    });
    
    // Clear the error for this field if it exists
    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!lote) errors.lote = 'Debe seleccionar un lote';
    if (!formData.nombre) errors.nombre = 'El nombre es requerido';
    if (!formData.apellido) errors.apellido = 'El apellido es requerido';
    if (!formData.dni) errors.dni = 'El DNI es requerido';
    else if (!/^\d+$/.test(formData.dni)) errors.dni = 'El DNI debe contener solo números';
    
    if (!formData.sexo) errors.sexo = 'Debe seleccionar el sexo';
    if (!formData.vencimientoLicencia) errors.vencimientoLicencia = 'La fecha de vencimiento es requerida';
    if (!formData.patente) errors.patente = 'La patente es requerida';
    if (!formData.marca) errors.marca = 'La marca del vehículo es requerida';
    if (!formData.modelo) errors.modelo = 'El modelo del vehículo es requerido';
    if (!formData.aseguradora) errors.aseguradora = 'La aseguradora es requerida';
    if (!formData.poliza) errors.poliza = 'El número de póliza es requerido';
    if (!formData.vencimientoPoliza) errors.vencimientoPoliza = 'La fecha de vencimiento es requerida';
    if (!formData.registradoAnteriormente) errors.registradoAnteriormente = 'Debe seleccionar una opción';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitting(true);
      
      try {
        // Formatear fechas para Supabase (YYYY-MM-DD)
        const licenciaDate = formData.vencimientoLicencia ? format(formData.vencimientoLicencia, 'yyyy-MM-dd') : '';
        const polizaDate = formData.vencimientoPoliza ? format(formData.vencimientoPoliza, 'yyyy-MM-dd') : '';
        
        // Preparar datos para enviar a Supabase
        const registroData = {
          lote,
          nombre: formData.nombre,
          apellido: formData.apellido,
          dni: formData.dni,
          sexo: formData.sexo,
          vencimiento_licencia: licenciaDate,
          patente: formData.patente.toUpperCase(),
          marca: formData.marca,
          modelo: formData.modelo,
          aseguradora: formData.aseguradora,
          poliza: formData.poliza,
          vencimiento_poliza: polizaDate,
          registrado_anteriormente: formData.registradoAnteriormente
        };
        
        console.log('Enviando datos a Supabase:', registroData);
        
        // Insertar en Supabase
        const { error } = await supabase
          .from('pre_registros')
          .insert([registroData]);
        
        if (error) {
          console.error('Error al guardar datos en Supabase:', error);
          throw new Error(error.message);
        }
        
        // Mostrar mensaje de éxito
        toast.success('Pre-registro completado con éxito', {
          description: 'Sus datos han sido registrados correctamente.'
        });
        
        // Marcar como exitoso y resetear el formulario
        setSuccess(true);
        setLote('');
        setFormData({
          nombre: '',
          apellido: '',
          dni: '',
          sexo: '',
          vencimientoLicencia: undefined,
          patente: '',
          marca: '',
          modelo: '',
          aseguradora: '',
          poliza: '',
          vencimientoPoliza: undefined,
          registradoAnteriormente: ''
        });
      } catch (error) {
        console.error('Error en el envío del formulario:', error);
        toast.error('Error al enviar el formulario', {
          description: error instanceof Error ? error.message : 'Ocurrió un error inesperado. Por favor, intente nuevamente.'
        });
      } finally {
        setSubmitting(false);
      }
    } else {
      toast.error('Error en el formulario', {
        description: 'Por favor revise los campos marcados en rojo.'
      });
    }
  };

  // Si el formulario se envió con éxito, mostrar un mensaje y un botón para volver a completar otro formulario
  if (success) {
    return (
      <Card className="form-card">
        <CardContent className="pt-6">
          <div className="text-center py-8 space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-800">
              <CheckIcon className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">¡Pre-registro completado!</h2>
            <p className="text-lg text-gray-600">Sus datos han sido registrados exitosamente.</p>
            <p className="text-md text-gray-500">Gracias por completar el pre-registro para ingresar a El Centauro.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button 
                onClick={() => setSuccess(false)} 
                className="bg-centauro-green-dark hover:bg-centauro-green text-lg py-6 px-8"
              >
                Completar otro pre-registro
              </Button>
              <Link to="/">
                <Button 
                  variant="outline"
                  className="text-lg py-6 px-8 border-centauro-green-dark text-centauro-green-dark hover:bg-centauro-green-light"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Salir
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="form-card">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lote Selector */}
          <div className="form-section" style={{ animationDelay: '0.1s' }}>
            <LoteSelector 
              value={lote} 
              onChange={handleLoteChange} 
              className="mb-6"
            />
            {formErrors.lote && (
              <p className="text-red-500 text-sm mt-1">{formErrors.lote}</p>
            )}
          </div>

          {lote && (
            <>
              {/* Datos Personales */}
              <div className="form-section" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b border-centauro-green-light pb-2">
                  Datos Personales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="nombre" className="text-base md:text-lg">
                      Nombre
                    </label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={cn(
                        "h-12 mt-1 bg-white text-base",
                        formErrors.nombre && "border-red-500"
                      )}
                    />
                    {formErrors.nombre && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.nombre}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="apellido" className="text-base md:text-lg">
                      Apellido
                    </label>
                    <Input
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className={cn(
                        "h-12 mt-1 bg-white text-base",
                        formErrors.apellido && "border-red-500"
                      )}
                    />
                    {formErrors.apellido && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.apellido}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dni" className="text-base md:text-lg">
                      DNI
                    </label>
                    <Input
                      id="dni"
                      name="dni"
                      value={formData.dni}
                      onChange={handleInputChange}
                      className={cn(
                        "h-12 mt-1 bg-white text-base",
                        formErrors.dni && "border-red-500"
                      )}
                    />
                    {formErrors.dni && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.dni}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="sexo-select" className="text-base md:text-lg">
                      Sexo
                    </label>
                    <Select
                      value={formData.sexo}
                      onValueChange={(value) => handleSelectChange('sexo', value)}
                    >
                      <SelectTrigger 
                        id="sexo-select" 
                        className={cn(
                          "w-full h-12 mt-1 bg-white text-base",
                          formErrors.sexo && "border-red-500"
                        )}
                      >
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino" className="text-base py-3">
                          Masculino
                        </SelectItem>
                        <SelectItem value="femenino" className="text-base py-3">
                          Femenino
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.sexo && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.sexo}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Licencia de Conducir */}
              <div className="form-section" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b border-centauro-green-light pb-2">
                  Licencia de Conducir
                </h2>
                <div className="mb-6">
                  <label htmlFor="vencimiento-licencia" className="text-base md:text-lg">
                    Vencimiento Lic. Conducir
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="vencimiento-licencia"
                        variant="outline"
                        className={cn(
                          "w-full h-12 mt-1 bg-white justify-start text-left font-normal text-base",
                          !formData.vencimientoLicencia && "text-muted-foreground",
                          formErrors.vencimientoLicencia && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.vencimientoLicencia ? (
                          format(formData.vencimientoLicencia, 'dd/MM/yy')
                        ) : (
                          <span>DD/MM/AA</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.vencimientoLicencia}
                        onSelect={(date) => handleDateChange('vencimientoLicencia', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {formErrors.vencimientoLicencia && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.vencimientoLicencia}</p>
                  )}
                </div>
              </div>

              {/* Datos del Vehículo */}
              <div className="form-section" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b border-centauro-green-light pb-2">
                  Datos del Vehículo
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label htmlFor="patente" className="text-base md:text-lg">
                      Patente
                    </label>
                    <Input
                      id="patente"
                      name="patente"
                      value={formData.patente}
                      onChange={handleInputChange}
                      className={cn(
                        "h-12 mt-1 bg-white text-base uppercase",
                        formErrors.patente && "border-red-500"
                      )}
                    />
                    {formErrors.patente && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.patente}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="marca" className="text-base md:text-lg">
                      Marca
                    </label>
                    <Input
                      id="marca"
                      name="marca"
                      value={formData.marca}
                      onChange={handleInputChange}
                      className={cn(
                        "h-12 mt-1 bg-white text-base",
                        formErrors.marca && "border-red-500"
                      )}
                    />
                    {formErrors.marca && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.marca}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="modelo" className="text-base md:text-lg">
                      Modelo
                    </label>
                    <Input
                      id="modelo"
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleInputChange}
                      className={cn(
                        "h-12 mt-1 bg-white text-base",
                        formErrors.modelo && "border-red-500"
                      )}
                    />
                    {formErrors.modelo && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.modelo}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Datos del Seguro */}
              <div className="form-section" style={{ animationDelay: '0.5s' }}>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b border-centauro-green-light pb-2">
                  Datos del Seguro
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="aseguradora" className="text-base md:text-lg">
                      Empresa Aseguradora
                    </label>
                    <Input
                      id="aseguradora"
                      name="aseguradora"
                      value={formData.aseguradora}
                      onChange={handleInputChange}
                      className={cn(
                        "h-12 mt-1 bg-white text-base",
                        formErrors.aseguradora && "border-red-500"
                      )}
                    />
                    {formErrors.aseguradora && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.aseguradora}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="poliza" className="text-base md:text-lg">
                      Nro. Póliza
                    </label>
                    <Input
                      id="poliza"
                      name="poliza"
                      value={formData.poliza}
                      onChange={handleInputChange}
                      className={cn(
                        "h-12 mt-1 bg-white text-base",
                        formErrors.poliza && "border-red-500"
                      )}
                    />
                    {formErrors.poliza && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.poliza}</p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="vencimiento-poliza" className="text-base md:text-lg">
                    Vencimiento de la Póliza
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="vencimiento-poliza"
                        variant="outline"
                        className={cn(
                          "w-full h-12 mt-1 bg-white justify-start text-left font-normal text-base",
                          !formData.vencimientoPoliza && "text-muted-foreground",
                          formErrors.vencimientoPoliza && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.vencimientoPoliza ? (
                          format(formData.vencimientoPoliza, 'dd/MM/yy')
                        ) : (
                          <span>DD/MM/AA</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.vencimientoPoliza}
                        onSelect={(date) => handleDateChange('vencimientoPoliza', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {formErrors.vencimientoPoliza && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.vencimientoPoliza}</p>
                  )}
                </div>
              </div>

              {/* Información Adicional */}
              <div className="form-section" style={{ animationDelay: '0.6s' }}>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b border-centauro-green-light pb-2">
                  Información Adicional
                </h2>
                
                <div className="mb-6">
                  <label htmlFor="registrado-select" className="text-base md:text-lg">
                    ¿Fuiste registrado anteriormente?
                  </label>
                  <Select
                    value={formData.registradoAnteriormente}
                    onValueChange={(value) => handleSelectChange('registradoAnteriormente', value)}
                  >
                    <SelectTrigger 
                      id="registrado-select" 
                      className={cn(
                        "w-full h-12 mt-1 bg-white text-base",
                        formErrors.registradoAnteriormente && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si" className="text-base py-3">
                        Sí
                      </SelectItem>
                      <SelectItem value="no" className="text-base py-3">
                        No
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.registradoAnteriormente && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.registradoAnteriormente}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-section" style={{ animationDelay: '0.7s' }}>
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg bg-centauro-green-dark hover:bg-centauro-green transition-all duration-300 shadow-lg hover:shadow-xl"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⏳</span> Procesando...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CheckIcon className="mr-2 h-5 w-5" /> Completar Pre-Registro
                    </span>
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PreRegistroForm;
