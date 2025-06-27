
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DetalleDocumento, Producto } from "@/types";
import { getDetallesByDocumento, createDetalle, deleteDetalle } from "@/services/documentoDetalleService";
import { getAllProducts } from "@/services/productService";

interface DocumentoDetalleFormProps {
  idDocumento: number;
  onCancel: () => void;
}

const DocumentoDetalleForm = ({ idDocumento, onCancel }: DocumentoDetalleFormProps) => {
  const [detalles, setDetalles] = useState<DetalleDocumento[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    idProducto: "",
    cantidad: 1,
    precioUnitario: 0,
    descuento: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [idDocumento]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [detallesData, productosData] = await Promise.all([
        getDetallesByDocumento(idDocumento),
        getAllProducts()
      ]);
      setDetalles(detallesData);
      setProductos(productosData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularIGV = (cantidad: number, precioUnitario: number, descuento: number) => {
    const subtotal = (cantidad * precioUnitario) - descuento;
    return subtotal * 0.18;
  };

  const handleDetalleChange = (field: string, value: any) => {
    setNuevoDetalle(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalcular IGV automáticamente
      if (field === 'cantidad' || field === 'precioUnitario' || field === 'descuento') {
        const igv = calcularIGV(
          field === 'cantidad' ? value : updated.cantidad,
          field === 'precioUnitario' ? value : updated.precioUnitario,
          field === 'descuento' ? value : updated.descuento
        );
        return { ...updated, igvDetalle: igv };
      }
      
      return updated;
    });
  };

  const handleAgregarDetalle = async () => {
    try {
      if (!nuevoDetalle.idProducto) {
        toast({
          title: "Error",
          description: "Debe seleccionar un producto",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      const igvDetalle = calcularIGV(nuevoDetalle.cantidad, nuevoDetalle.precioUnitario, nuevoDetalle.descuento);
      
      const detalleToCreate = {
        idDocumento,
        idProducto: parseInt(nuevoDetalle.idProducto),
        cantidad: nuevoDetalle.cantidad,
        precioUnitario: nuevoDetalle.precioUnitario,
        descuento: nuevoDetalle.descuento,
        igvDetalle
      };

      await createDetalle(detalleToCreate);
      
      // Resetear formulario
      setNuevoDetalle({
        idProducto: "",
        cantidad: 1,
        precioUnitario: 0,
        descuento: 0
      });

      // Recargar detalles
      await loadData();

      toast({
        title: "Detalle agregado",
        description: "El detalle ha sido agregado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al agregar el detalle",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarDetalle = async (id: number) => {
    try {
      setLoading(true);
      await deleteDetalle(id);
      await loadData();
      toast({
        title: "Detalle eliminado",
        description: "El detalle ha sido eliminado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar el detalle",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularTotales = () => {
    const subtotal = detalles.reduce((sum, detalle) => {
      return sum + ((detalle.cantidad * detalle.precioUnitario) - detalle.descuento);
    }, 0);
    
    const totalIGV = detalles.reduce((sum, detalle) => sum + detalle.igvDetalle, 0);
    const importeTotal = subtotal + totalIGV;
    
    return { subtotal, totalIGV, importeTotal };
  };

  const { subtotal, totalIGV, importeTotal } = calcularTotales();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              Detalles del Documento #{idDocumento}
            </h1>
          </div>

          {/* Agregar nuevo detalle */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Agregar Nuevo Detalle</CardTitle>
              <CardDescription>
                Selecciona un producto y especifica los detalles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-3">
                  <Label>Producto</Label>
                  <Select 
                    value={nuevoDetalle.idProducto} 
                    onValueChange={(value) => handleDetalleChange('idProducto', value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map(producto => (
                        <SelectItem key={producto.id} value={producto.id!.toString()}>
                          {producto.nombre} - {producto.codigo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    value={nuevoDetalle.cantidad}
                    onChange={(e) => handleDetalleChange('cantidad', parseInt(e.target.value) || 0)}
                    min="1"
                    disabled={loading}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Precio Unitario</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={nuevoDetalle.precioUnitario}
                    onChange={(e) => handleDetalleChange('precioUnitario', parseFloat(e.target.value) || 0)}
                    min="0"
                    disabled={loading}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Descuento</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={nuevoDetalle.descuento}
                    onChange={(e) => handleDetalleChange('descuento', parseFloat(e.target.value) || 0)}
                    min="0"
                    disabled={loading}
                  />
                </div>
                <div className="col-span-2">
                  <Label>IGV Calculado</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={calcularIGV(nuevoDetalle.cantidad, nuevoDetalle.precioUnitario, nuevoDetalle.descuento).toFixed(2)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="col-span-1">
                  <Button onClick={handleAgregarDetalle} disabled={loading} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de detalles existentes */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Documento ({detalles.length})</CardTitle>
              <CardDescription>
                Lista de productos incluidos en este documento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {detalles.map((detalle) => {
                  const producto = productos.find(p => p.id === detalle.idProducto);
                  return (
                    <div key={detalle.id} className="grid grid-cols-12 gap-4 items-center p-4 border rounded-lg">
                      <div className="col-span-3">
                        <span className="font-medium">{producto?.nombre || 'Producto no encontrado'}</span>
                        <div className="text-sm text-gray-500">{producto?.codigo}</div>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="font-medium">{detalle.cantidad}</span>
                        <div className="text-sm text-gray-500">Cantidad</div>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="font-medium">S/. {detalle.precioUnitario.toFixed(2)}</span>
                        <div className="text-sm text-gray-500">P. Unitario</div>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="font-medium">S/. {detalle.descuento.toFixed(2)}</span>
                        <div className="text-sm text-gray-500">Descuento</div>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="font-medium">S/. {detalle.igvDetalle.toFixed(2)}</span>
                        <div className="text-sm text-gray-500">IGV</div>
                      </div>
                      <div className="col-span-1 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEliminarDetalle(detalle.id!)}
                          disabled={loading}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                {detalles.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay detalles agregados a este documento
                  </div>
                )}
              </div>
              
              {detalles.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-end">
                    <div className="text-right space-y-2">
                      <p className="text-sm text-gray-600">Subtotal: S/. {subtotal.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">IGV (18%): S/. {totalIGV.toFixed(2)}</p>
                      <p className="text-lg font-semibold">Total: S/. {importeTotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentoDetalleForm;
