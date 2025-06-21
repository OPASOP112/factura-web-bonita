
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Search, Edit, Trash, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/ProductForm";

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Laptop HP Pavilion",
      code: "LAP-001",
      price: 1299.99,
      stock: 15,
      category: "Electrónicos",
      description: "Laptop HP Pavilion 15.6 pulgadas, Intel Core i5"
    },
    {
      id: 2,
      name: "Mouse Logitech MX",
      code: "MOU-002", 
      price: 89.99,
      stock: 45,
      category: "Accesorios",
      description: "Mouse inalámbrico Logitech MX Master 3"
    },
    {
      id: 3,
      name: "Teclado Mecánico",
      code: "KEY-003",
      price: 159.99,
      stock: 23,
      category: "Accesorios",
      description: "Teclado mecánico RGB con switches Cherry MX"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { toast } = useToast();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado correctamente.",
    });
  };

  const handleSave = (productData: any) => {
    if (editingProduct) {
      setProducts(products.map(product => 
        product.id === editingProduct.id ? { ...productData, id: editingProduct.id } : product
      ));
      toast({
        title: "Producto actualizado",
        description: "Los datos del producto han sido actualizados.",
      });
    } else {
      const newProduct = { ...productData, id: Date.now() };
      setProducts([...products, newProduct]);
      toast({
        title: "Producto insertado",
        description: "El nuevo producto ha sido agregado correctamente.",
      });
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
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
                <FileText className="h-8 w-8 mr-3 text-purple-600" />
                Gestión de Productos
              </h1>
              <p className="text-gray-600">Administra tu inventario de productos</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Insertar Producto
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos por nombre, código o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Productos ({filteredProducts.length})</CardTitle>
            <CardDescription>
              Gestiona tu inventario de productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.code}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.stock > 20 
                          ? 'bg-green-100 text-green-800' 
                          : product.stock > 10 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} unid.
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingProduct(product);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
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
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron productos
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Products;
