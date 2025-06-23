
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createCompany, updateCompany, Company } from "@/services/companyService";

interface CompanyFormProps {
  company?: Company | null;
  onSave: () => void;
  onCancel: () => void;
}

const CompanyForm = ({ company, onSave, onCancel }: CompanyFormProps) => {
  const [formData, setFormData] = useState({
    razonSocial: company?.razonSocial || "",
    ruc: company?.ruc || "",
    direccion: company?.direccion || ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (company?.id) {
        await updateCompany(company.id, formData);
        toast({
          title: "Empresa actualizada",
          description: "Los datos de la empresa han sido actualizados.",
        });
      } else {
        await createCompany(formData);
        toast({
          title: "Empresa creada",
          description: "La nueva empresa ha sido agregada correctamente.",
        });
      }
      
      onSave();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Error al guardar empresa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              {company ? "Editar Empresa" : "Nueva Empresa"}
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{company ? "Actualizar Empresa" : "Crear Empresa"}</CardTitle>
              <CardDescription>
                {company ? "Modifica la información de la empresa" : "Ingresa los datos de la nueva empresa"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="razonSocial">Razón Social</Label>
                  <Input
                    id="razonSocial"
                    name="razonSocial"
                    value={formData.razonSocial}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ruc">RUC</Label>
                    <Input
                      id="ruc"
                      name="ruc"
                      value={formData.ruc}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Guardando..." : (company ? "Actualizar" : "Crear")} Empresa
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
