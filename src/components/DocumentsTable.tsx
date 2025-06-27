
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Edit, Trash, Eye } from "lucide-react";

interface Document {
  id: number;
  type: string;
  number: string;
  client: string;
  company: string;
  date: string;
  total: number;
  status: string;
}

interface DocumentsTableProps {
  documents: Document[];
  onDelete: (id: number) => void;
  onEdit: (document: Document) => void;
  onDownloadPDF: (document: Document) => void;
}

const DocumentsTable = ({ documents, onDelete, onEdit, onDownloadPDF }: DocumentsTableProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Documentos ({documents.length})</CardTitle>
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
            {documents.map((doc) => (
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
                    <Link to={`/documents/${doc.id}/detalles`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:bg-green-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDownloadPDF(doc)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(doc)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(doc.id)}
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
        {documents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron documentos
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsTable;
