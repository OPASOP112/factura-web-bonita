import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Search, Edit, Trash, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CompanyForm from "@/components/CompanyForm";
import { getAllCompanies, deleteCompany } from "@/services/companyService";
import { Empresa } from "@/types";

const Companies = () => {
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Empresa | null>(null);
  const { toast } = useToast();

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCompanies();
      setCompanies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar empresas');
      toast({
        title: "Error",
        description: "No se pudieron cargar las empresas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.ruc.includes(searchTerm)
  );

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
      return;
    }

    try {
      await deleteCompany(id);
      setCompanies(companies.filter(company => company.id !== id));
      toast({
        title: "Empresa eliminada",
        description: "La empresa ha sido eliminada correctamente.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la empresa",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingCompany(null);
    loadCompanies();
  };

  if (showForm) {
    return (
      <CompanyForm
        company={editingCompany}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingCompany(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Building2 className="h-8 w-8 mr-3 text-green-600" />
                Gestión de Empresas
              </h1>
              <p className="text-gray-600">Administra las empresas del sistema</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Empresa
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar empresas por razón social o RUC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Lista de Empresas {!loading && `(${filteredCompanies.length})`}
            </CardTitle>
            <CardDescription>
              Gestiona la información de las empresas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Cargando empresas...
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Razón Social</TableHead>
                    <TableHead>RUC</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.razonSocial}</TableCell>
                      <TableCell>{company.ruc}</TableCell>
                      <TableCell>{company.direccion}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCompany(company);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => company.id && handleDelete(company.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && filteredCompanies.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron empresas
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Companies;
