
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Users, Building2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
              <FileText className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Sistema de Facturación
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Gestiona tus clientes, productos y documentos de facturación de manera profesional y eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white hover:bg-white/20 transition-all duration-300">
            <Users className="h-12 w-12 mx-auto mb-4 text-blue-200" />
            <h3 className="text-xl font-semibold mb-2">Gestión de Clientes</h3>
            <p className="text-blue-100">Administra tu base de clientes de forma completa</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white hover:bg-white/20 transition-all duration-300">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-blue-200" />
            <h3 className="text-xl font-semibold mb-2">Control Empresarial</h3>
            <p className="text-blue-100">Gestiona múltiples empresas y sucursales</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white hover:bg-white/20 transition-all duration-300">
            <FileText className="h-12 w-12 mx-auto mb-4 text-blue-200" />
            <h3 className="text-xl font-semibold mb-2">Facturación Digital</h3>
            <p className="text-blue-100">Genera facturas y documentos profesionales</p>
          </div>
        </div>

        <div className="text-center">
          <div className="space-x-4">
            <Link to="/login">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 font-semibold px-8">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
