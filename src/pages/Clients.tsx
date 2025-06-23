
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Search, Edit, Trash, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ClientForm from "@/components/ClientForm";
import { getAllClients, deleteClient, Client } from "@/services/clientService";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllClients();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes');
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter(client =>
    `${client.nombre} ${client.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      return;
    }

    try {
      await deleteClient(id);
      setClients(clients.filter(client => client.id !== id));
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado correctamente.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingClient(null);
    loadClients(); // Recargar la lista después de guardar
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
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
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
                placeholder="Buscar clientes por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Lista de Clientes {!loading && `(${filteredClients.length})`}
            </CardTitle>
            <CardDescription>
              Gestiona la información de tus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Cargando clientes...
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Fecha de Nacimiento</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.nombre}</TableCell>
                      <TableCell>{client.apellido}</TableCell>
                      <TableCell>{client.fechaNacimiento}</TableCell>
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
                            onClick={() => client.id && handleDelete(client.id)}
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
            {!loading && filteredClients.length === 0 && (
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
