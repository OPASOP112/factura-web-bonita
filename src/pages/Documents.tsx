
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Search, FileText, Download, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DocumentForm from "@/components/DocumentForm";

const Documents = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: "Factura",
      number: "F001-0001",
      client: "Juan Pérez",
      company: "TechSolutions S.A.",
      date: "2024-01-15",
      total: 1250.00,
      status: "Pagado"
    },
    {
      id: 2,
      type: "Cotización",
      number: "C001-0001",
      client: "María García",
      company: "Innovación Digital EIRL",
      date: "2024-01-14",
      total: 890.50,
      status: "Pendiente"
    },
    {
      id: 3,
      type: "Factura",
      number: "F001-0002",
      client: "Carlos López",
      company: "TechSolutions S.A.",
      date: "2024-01-13",
      total: 2100.00,
      status: "Vencido"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const { toast } = useToast();

  const filteredDocuments = documents.filter(doc =>
    doc.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Documento eliminado",
      description: "El documento ha sido eliminado correctamente.",
    });
  };

  const handleSave = (documentData: any) => {
    if (editingDocument) {
      setDocuments(documents.map(doc => 
        doc.id === editingDocument.id ? { ...documentData, id: editingDocument.id } : doc
      ));
      toast({
        title: "Documento actualizado",
        description: "El documento ha sido actualizado correctamente.",
      });
    } else {
      const newDocument = { ...documentData, id: Date.now() };
      setDocuments([...documents, newDocument]);
      toast({
        title: "Documento creado",
        description: "El nuevo documento ha sido creado correctamente.",
      });
    }
    setShowForm(false);
    setEditingDocument(null);
  };

  const handleDownloadPDF = (doc: any) => {
    toast({
      title: "Generando PDF",
      description: `Descargando ${doc.type} ${doc.number}...`,
    });
    // Aquí iría la lógica para generar y descargar el PDF
    console.log("Generando PDF para:", doc);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pagado":
        return "bg-green-100 text-green-800";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Vencido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (showForm) {
    return (
      <DocumentForm
        document={editingDocument}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingDocument(null);
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
                <FileText className="h-8 w-8 mr-3 text-orange-600" />
                Documentos y Facturas
              </h1>
              <p className="text-gray-600">Gestiona tus documentos y genera PDFs</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Documento
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar documentos por número, cliente o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Documentos ({filteredDocuments.length})</CardTitle>
            <CardDescription>
              Gestiona tus facturas, cotizaciones y otros documentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.type}</TableCell>
                    <TableCell>{doc.number}</TableCell>
                    <TableCell>{doc.client}</TableCell>
                    <TableCell>{doc.company}</TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell>${doc.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadPDF(doc)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingDocument(doc);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(doc.id)}
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
            {filteredDocuments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron documentos
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;
