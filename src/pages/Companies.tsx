
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Search, Edit, Trash, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CompanyForm from "@/components/CompanyForm";

const Companies = () => {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "TechSolutions S.A.",
      ruc: "20123456789",
      address: "Av. Tecnología 123, Lima",
      phone: "+51 1 234-5678",
      email: "info@techsolutions.com"
    },
    {
      id: 2,
      name: "Innovación Digital EIRL",
      ruc: "10987654321",
      address: "Jr. Innovación 456, Arequipa", 
      phone: "+51 54 987-6543",
      email: "contacto@innovacion.com"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const { toast } = useToast();

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.ruc.includes(searchTerm) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setCompanies(companies.filter(company => company.id !== id));
    toast({
      title: "Empresa eliminada",
      description: "La empresa ha sido eliminada correctamente.",
    });
  };

  const handleSave = (companyData: any) => {
    if (editingCompany) {
      setCompanies(companies.map(company => 
        company.id === editingCompany.id ? { ...companyData, id: editingCompany.id } : company
      ));
      toast({
        title: "Empresa actualizada",
        description: "Los datos de la empresa han sido actualizados.",
      });
    } else {
      const newCompany = { ...companyData, id: Date.now() };
      setCompanies([...companies, newCompany]);
      toast({
        title: "Empresa creada",
        description: "La nueva empresa ha sido agregada correctamente.",
      });
    }
    setShowForm(false);
    setEditingCompany(null);
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
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Empresa
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar empresas por nombre, RUC o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Empresas ({filteredCompanies.length})</CardTitle>
            <CardDescription>
              Gestiona la información de las empresas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>RUC</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.ruc}</TableCell>
                    <TableCell>{company.address}</TableCell>
                    <TableCell>{company.phone}</TableCell>
                    <TableCell>{company.email}</TableCell>
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
                          onClick={() => handleDelete(company.id)}
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
            {filteredCompanies.length === 0 && (
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
