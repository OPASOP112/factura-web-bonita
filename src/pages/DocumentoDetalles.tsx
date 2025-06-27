
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import DocumentoDetalleForm from "@/components/DocumentoDetalleForm";

const DocumentoDetalles = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(true);

  const handleBack = () => {
    navigate("/documents");
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">ID de documento no válido</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DocumentoDetalleForm 
      idDocumento={parseInt(id)} 
      onCancel={handleBack}
    />
  );
};

export default DocumentoDetalles;
