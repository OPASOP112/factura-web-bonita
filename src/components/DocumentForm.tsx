
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash } from "lucide-react";

interface DocumentFormProps {
  document?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const DocumentForm = ({ document, onSave, onCancel }: DocumentFormProps) => {
  // Mock data - en una app real, estos vendrían de tu base de datos
  const [clientes] = useState([
    { id: 1, nombre: "Juan", apellido: "Pérez" },
    { id: 2, nombre: "María", apellido: "García" },
    { id: 3, nombre: "Carlos", apellido: "López" }
  ]);

  const [empresas] = useState([
    { id: 1, razonSocial: "TechSolutions S.A.", ruc: "20123456789" },
    { id: 2, razonSocial: "Innovación Digital EIRL", ruc: "20987654321" },
    { id: 3, razonSocial: "Servicios Empresariales SAC", ruc: "20456789123" }
  ]);

  const [tiposDocumento] = useState([
    { id: 1, descripcion: "Factura" },
    { id: 2, descripcion: "Cotización" },
    { id: 3, descripcion: "Nota de Crédito" },
    { id: 4, descripcion: "Nota de Débito" }
  ]);

  const [formasPago] = useState([
    { id: 1, descripcion: "Efectivo" },
    { id: 2, descripcion: "Tarjeta de Crédito" },
    { id: 3, descripcion: "Transferencia Bancaria" },
    { id: 4, descripcion: "Cheque" }
  ]);

  const [productos] = useState([
    { id: 1, descripcion: "Laptop HP" },
    { id: 2, descripcion: "Mouse Inalámbrico" },
    { id: 3, descripcion: "Teclado Mecánico" },
    { id: 4, descripcion: "Monitor 24 pulgadas" }
  ]);

  const [formData, setFormData] = useState({
    fechaEmision: document?.fechaEmision || new Date().toISOString().split('T')[0],
    idCliente: document?.idCliente || "",
    idEmpresa: document?.idEmpresa || "",
    idTipoDocumento: document?.idTipoDocumento || "",
    idFormaPago: document?.idFormaPago || ""
  });

  const [detalles, setDetalles] = useState(document?.detalles || [
    { idProducto: "", cantidad: 1, precioUnitario: 0, descuento: 0, igvDetalle: 0 }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDetalleChange = (index: number, field: string, value: any) => {
    const newDetalles = [...detalles];
    newDetalles[index][field] = value;
    
    // Calcular IGV automáticamente (18%)
    if (field === 'cantidad' || field === 'precioUnitario' || field === 'descuento') {
      const subtotal = (newDetalles[index].cantidad * newDetalles[index].precioUnitario) - newDetalles[index].descuento;
      newDetalles[index].igvDetalle = subtotal * 0.18;
    }
    
    setDetalles(newDetalles);
  };

  const addDetalle = () => {
    setDetalles([...detalles, { idProducto: "", cantidad: 1, precioUnitario: 0, descuento: 0, igvDetalle: 0 }]);
  };

  const removeDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = detalles.reduce((sum, detalle) => {
      return sum + ((detalle.cantidad * detalle.precioUnitario) - detalle.descuento);
    }, 0);
    
    const totalIGV = detalles.reduce((sum, detalle) => sum + detalle.igvDetalle, 0);
    const importeTotal = subtotal + totalIGV;
    
    return { subtotal, totalIGV, importeTotal };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { totalIGV, importeTotal } = calculateTotals();
    
    const dataToSave = {
      ...formData,
      detalles,
      importeIGV: totalIGV,
      importeTotal,
      id: document?.id || Date.now()
    };
    onSave(dataToSave);
  };

  const { subtotal, totalIGV, importeTotal } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="outline" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              {document ? "Editar Documento" : "Nuevo Documento"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Documento</CardTitle>
                <CardDescription>
                  Datos básicos del documento según tu esquema de base de datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idTipoDocumento">Tipo de Documento</Label>
                    <Select 
                      value={formData.idTipoDocumento.toString()} 
                      onValueChange={(value) => handleSelectChange('idTipoDocumento', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de documento" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposDocumento.map(tipo => (
                          <SelectItem key={tipo.id} value={tipo.id.toString()}>
                            {tipo.descripcion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaEmision">Fecha de Emisión</Label>
                    <Input
                      id="fechaEmision"
                      name="fechaEmision"
                      type="date"
                      value={formData.fechaEmision}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idCliente">Cliente</Label>
                    <Select 
                      value={formData.idCliente.toString()} 
                      onValueChange={(value) => handleSelectChange('idCliente', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map(cliente => (
                          <SelectItem key={cliente.id} value={cliente.id.toString()}>
                            {cliente.nombre} {cliente.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idEmpresa">Empresa</Label>
                    <Select 
                      value={formData.idEmpresa.toString()} 
                      onValueChange={(value) => handleSelectChange('idEmpresa', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {empresas.map(empresa => (
                          <SelectItem key={empresa.id} value={empresa.id.toString()}>
                            {empresa.razonSocial}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idFormaPago">Forma de Pago</Label>
                  <Select 
                    value={formData.idFormaPago.toString()} 
                    onValueChange={(value) => handleSelectChange('idFormaPago', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona forma de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      {formasPago.map(forma => (
                        <SelectItem key={forma.id} value={forma.id.toString()}>
                          {forma.descripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Document Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Detalle del Documento</CardTitle>
                    <CardDescription>
                      Productos/servicios incluidos en el documento
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={addDetalle} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {detalles.map((detalle, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                      <div className="col-span-3">
                        <Label>Producto</Label>
                        <Select 
                          value={detalle.idProducto.toString()} 
                          onValueChange={(value) => handleDetalleChange(index, 'idProducto', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {productos.map(producto => (
                              <SelectItem key={producto.id} value={producto.id.toString()}>
                                {producto.descripcion}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label>Cantidad</Label>
                        <Input
                          type="number"
                          value={detalle.cantidad}
                          onChange={(e) => handleDetalleChange(index, 'cantidad', parseInt(e.target.value) || 0)}
                          min="1"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Precio Unitario</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={detalle.precioUnitario}
                          onChange={(e) => handleDetalleChange(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
                          min="0"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Descuento</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={detalle.descuento}
                          onChange={(e) => handleDetalleChange(index, 'descuento', parseFloat(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>IGV</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={detalle.igvDetalle.toFixed(2)}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="col-span-1">
                        {detalles.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeDetalle(index)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-end">
                    <div className="text-right space-y-2">
                      <p className="text-sm text-gray-600">Subtotal: S/. {subtotal.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">IGV (18%): S/. {totalIGV.toFixed(2)}</p>
                      <p className="text-lg font-semibold">Total: S/. {importeTotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                <Save className="h-4 w-4 mr-2" />
                {document ? "Actualizar" : "Crear"} Documento
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentForm;
