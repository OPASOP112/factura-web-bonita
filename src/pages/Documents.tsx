import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAllDocuments } from "@/services/documentService";
import { getAllClients } from "@/services/clientService";
import { getAllCompanies } from "@/services/companyService";
import DocumentForm from "@/components/DocumentForm";
import DocumentsHeader from "@/components/DocumentsHeader";
import DocumentsSearch from "@/components/DocumentsSearch";
import DocumentsTable from "@/components/DocumentsTable";

const tipoDocumentoMap = {
  1: "Factura",
  2: "Boleta"
};

const estadoMap = {
  1: "Pagado",
  2: "Pendiente",
  3: "Vencido"
};

const Documents = () => {
  const { toast } = useToast();

  const [documents, setDocuments] = useState<any[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsData, clientesData, empresasData] = await Promise.all([
          getAllDocuments(),
          getAllClients(),
          getAllCompanies()
        ]);

        const joinedDocs = docsData.map((doc: any) => {
          const cliente = clientesData.find((c) => c.id === doc.idCliente);
          const empresa = empresasData.find((e) => e.id === doc.idEmpresa);

          return {
            id: doc.id,
            type: tipoDocumentoMap[doc.idTipoDocumento] || "Desconocido",
            number: doc.numero || `DOC-${doc.id}`,
            client: cliente ? `${cliente.nombre} ${cliente.apellido}` : "Desconocido",
            company: empresa ? empresa.razonSocial : "Desconocido",
            date: doc.fechaEmision,
            total: doc.importeTotal,
            status: estadoMap[doc.estado] || "Pagado"
          };
        });

        setDocuments(joinedDocs);
        setFilteredDocuments(joinedDocs);
      } catch (err: any) {
        toast({
          title: "Error al cargar documentos",
          description: err.message,
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = documents.filter(doc =>
      doc.number.toLowerCase().includes(term) ||
      doc.client.toLowerCase().includes(term) ||
      doc.company.toLowerCase().includes(term)
    );
    setFilteredDocuments(filtered);
  }, [searchTerm, documents]);

  const handleDelete = (id: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({ title: "Documento eliminado", description: "Se eliminó correctamente." });
  };

  const handleSave = (documentData: any) => {
    toast({ title: "Documento guardado", description: "Se guardó correctamente." });
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
      description: `Descargando ${doc.type} ${doc.number}`,
    });
    console.log("Descargando PDF:", doc);
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
