
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Search, Edit, Trash, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ClientForm from "@/components/ClientForm";

const Clients = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan@ejemplo.com",
      phone: "+1234567890",
      company: "Empresa ABC",
      address: "Calle Principal 123"
    },
    {
      id: 2,
      name: "María García",
      email: "maria@ejemplo.com", 
      phone: "+0987654321",
      company: "Corporación XYZ",
      address: "Avenida Central 456"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const { toast } = useToast();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setClients(clients.filter(client => client.id !== id));
    toast({
      title: "Cliente eliminado",
      description: "El cliente ha sido eliminado correctamente.",
    });
  };

  const handleSave = (clientData: any) => {
    if (editingClient) {
      setClients(clients.map(client => 
        client.id === editingClient.id ? { ...clientData, id: editingClient.id } : client
      ));
      toast({
        title: "Cliente actualizado",
        description: "Los datos del cliente han sido actualizados.",
      });
    } else {
      const newClient = { ...clientData, id: Date.now() };
      setClients([...clients, newClient]);
      toast({
        title: "Cliente creado",
        description: "El nuevo cliente ha sido agregado correctamente.",
      });
    }
    setShowForm(false);
    setEditingClient(null);
  };

  if (showForm) {
    return (
      <ClientForm
        client={editingClient}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingClient(null);
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
                <Users className="h-8 w-8 mr-3 text-blue-600" />
                Gestión de Clientes
              </h1>
              <p className="text-gray-600">Administra tu base de clientes</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar clientes por nombre, email o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes ({filteredClients.length})</CardTitle>
            <CardDescription>
              Gestiona la información de tus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.company}</TableCell>
                    <TableCell>{client.address}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingClient(client);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(client.id)}
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
            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron clientes
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Clients;
