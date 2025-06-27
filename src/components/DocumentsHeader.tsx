
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, FileText } from "lucide-react";

interface DocumentsHeaderProps {
  onNewDocument: () => void;
}

const DocumentsHeader = ({ onNewDocument }: DocumentsHeaderProps) => {
  return (
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
        onClick={onNewDocument}
        className="bg-orange-600 hover:bg-orange-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Documento
      </Button>
    </div>
  );
};

export default DocumentsHeader;
