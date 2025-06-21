
import { useState } from "react";
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
  const [formData, setFormData] = useState({
    type: document?.type || "Factura",
    number: document?.number || "",
    client: document?.client || "",
    company: document?.company || "",
    date: document?.date || new Date().toISOString().split('T')[0],
    status: document?.status || "Pendiente"
  });

  const [items, setItems] = useState(document?.items || [
    { product: "", quantity: 1, price: 0, total: 0 }
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

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'price') {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { product: "", quantity: 1, price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      items,
      total: calculateTotal()
    };
    onSave(dataToSave);
  };

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
                  Datos básicos del documento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Documento</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Factura">Factura</SelectItem>
                        <SelectItem value="Cotización">Cotización</SelectItem>
                        <SelectItem value="Nota de Crédito">Nota de Crédito</SelectItem>
                        <SelectItem value="Nota de Débito">Nota de Débito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      placeholder="F001-0001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Cliente</Label>
                    <Input
                      id="client"
                      name="client"
                      value={formData.client}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Pagado">Pagado</SelectItem>
                        <SelectItem value="Vencido">Vencido</SelectItem>
                        <SelectItem value="Anulado">Anulado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Productos/Servicios</CardTitle>
                    <CardDescription>
                      Agrega los productos o servicios del documento
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={addItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-4">
                        <Label>Producto/Servicio</Label>
                        <Input
                          value={item.product}
                          onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                          placeholder="Nombre del producto"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Cantidad</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          min="1"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Precio</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                          min="0"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Total</Label>
                        <Input
                          value={`$${item.total.toFixed(2)}`}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="col-span-2">
                        {items.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
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
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        Total: ${calculateTotal().toFixed(2)}
                      </p>
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
