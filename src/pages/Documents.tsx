
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DocumentForm from "@/components/DocumentForm";
import DocumentsHeader from "@/components/DocumentsHeader";
import DocumentsSearch from "@/components/DocumentsSearch";
import DocumentsTable from "@/components/DocumentsTable";

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

  const handleEdit = (document: any) => {
    setEditingDocument(document);
    setShowForm(true);
  };

  const handleDownloadPDF = (doc: any) => {
    toast({
      title: "Generando PDF",
      description: `Descargando ${doc.type} ${doc.number}...`,
    });
    console.log("Generando PDF para:", doc);
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
        <DocumentsHeader onNewDocument={() => setShowForm(true)} />
        <DocumentsSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <DocumentsTable 
          documents={filteredDocuments}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDownloadPDF={handleDownloadPDF}
        />
      </div>
    </div>
  );
};

export default Documents;
