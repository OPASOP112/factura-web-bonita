
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, FileText, LogOut, Plus, Edit, Trash, Search } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const userName = localStorage.getItem("userName") || "Usuario";

  const menuItems = [
    {
      title: "Gestión de Clientes",
      description: "Administra tu base de clientes",
      icon: Users,
      path: "/clients",
      color: "from-blue-500 to-blue-600",
      actions: ["Crear", "Ver", "Actualizar", "Eliminar"]
    },
    {
      title: "Gestión de Empresas", 
      description: "Controla múltiples empresas",
      icon: Building2,
      path: "/companies",
      color: "from-green-500 to-green-600",
      actions: ["Crear", "Ver", "Actualizar", "Eliminar"]
    },
    {
      title: "Gestión de Productos",
      description: "Administra tu inventario",
      icon: FileText,
      path: "/products", 
      color: "from-purple-500 to-purple-600",
      actions: ["Insertar", "Ver", "Actualizar", "Eliminar"]
    },
    {
      title: "Documentos y Facturas",
      description: "Genera PDFs profesionales",
      icon: FileText,
      path: "/documents",
      color: "from-orange-500 to-orange-600",
      actions: ["Crear", "Imprimir PDF"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
            <p className="text-gray-600">Bienvenido, {userName}</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Sistema de Facturación Profesional
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Gestiona todos los aspectos de tu negocio desde un solo lugar. 
            Administra clientes, empresas, productos y genera documentos profesionales.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">{item.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.actions.map((action, actionIndex) => (
                    <span 
                      key={actionIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {action}
                    </span>
                  ))}
                </div>
                <Link to={item.path}>
                  <Button className={`w-full bg-gradient-to-r ${item.color} hover:opacity-90`}>
                    Acceder
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Clientes</h3>
              <p className="text-2xl font-bold text-blue-600">156</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Building2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Empresas</h3>
              <p className="text-2xl font-bold text-green-600">12</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Productos</h3>
              <p className="text-2xl font-bold text-purple-600">89</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Facturas</h3>
              <p className="text-2xl font-bold text-orange-600">234</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
