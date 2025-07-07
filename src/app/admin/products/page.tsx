'use client';

import { useAdmin } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Package,
  Search,
  Shield,
  ArrowLeft,
  Filter,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Tag,
  Star,
  X,
  ChevronUp,
  ChevronDown,
  Copy,
  EyeOff,
  TrendingUp,
  Grid,
  List,
  Download,
  Upload,
  MoreHorizontal,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAdminProducts } from '@/hooks/use-products';

// Datos de ejemplo de productos (en producción esto vendría de una API)
const mockProducts = [
  {
    id: '1',
    name: 'Arrocera Eléctrica',
    description: 'Arrocera eléctrica de alta calidad con capacidad de 6 tazas',
    price: 89.99,
    originalPrice: 119.99,
    category: 'Electródomesticos',
    image: '/img/arrocera.webp',
    stock: 15,
    rating: 4.5,
    reviews: 128,
    status: 'active',
    featured: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
  },
  {
    id: '2',
    name: 'Licuadora Profesional',
    description: 'Licuadora profesional con motor de 1000W y 6 velocidades',
    price: 129.99,
    originalPrice: 159.99,
    category: 'Electródomesticos',
    image: '/img/licuadora.webp',
    stock: 8,
    rating: 4.8,
    reviews: 95,
    status: 'active',
    featured: true,
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  {
    id: '3',
    name: 'Cafetera Eléctrica',
    description: 'Cafetera eléctrica automática con programador',
    price: 149.99,
    originalPrice: 199.99,
    category: 'Electródomesticos',
    image: '/img/cafetera-electrica.webp',
    stock: 12,
    rating: 4.3,
    reviews: 67,
    status: 'active',
    featured: false,
    createdAt: '2024-01-12T11:20:00Z',
    updatedAt: '2024-01-19T12:30:00Z',
  },
  {
    id: '4',
    name: 'Refrigerador',
    description: 'Refrigerador de 18 pies cúbicos con congelador',
    price: 599.99,
    originalPrice: 699.99,
    category: 'Electródomesticos',
    image: '/img/refrigerador.webp',
    stock: 5,
    rating: 4.7,
    reviews: 42,
    status: 'active',
    featured: true,
    createdAt: '2024-01-08T08:45:00Z',
    updatedAt: '2024-01-17T10:15:00Z',
  },
  {
    id: '5',
    name: 'Lavadora',
    description: 'Lavadora automática de 15kg con múltiples programas',
    price: 399.99,
    originalPrice: 449.99,
    category: 'Electródomesticos',
    image: '/img/lavadora-2.webp',
    stock: 3,
    rating: 4.6,
    reviews: 38,
    status: 'active',
    featured: false,
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-16T09:30:00Z',
  },
  {
    id: '6',
    name: 'Freidora de Aire',
    description: 'Freidora de aire con capacidad de 5.5L y control digital',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Electródomesticos',
    image: '/img/freidora de aire.webp',
    stock: 20,
    rating: 4.4,
    reviews: 156,
    status: 'active',
    featured: false,
    createdAt: '2024-01-20T13:10:00Z',
    updatedAt: '2024-01-20T13:10:00Z',
  },
  {
    id: '7',
    name: 'Paquete de Pollo',
    description: 'Paquete de pollo fresco, ideal para tus comidas diarias',
    price: 20.99,
    originalPrice: 24.99,
    category: 'Comida',
    image: '/img/paquete_pollo.webp',
    stock: 25,
    rating: 4.2,
    reviews: 89,
    status: 'active',
    featured: false,
    createdAt: '2024-01-18T09:30:00Z',
    updatedAt: '2024-01-20T11:15:00Z',
  },
  {
    id: '8',
    name: 'Combo Comida Familiar',
    description: 'Combo completo de comida para toda la familia',
    price: 45.99,
    originalPrice: 55.99,
    category: 'Comida',
    image: '/img/combo-comida.webp',
    stock: 12,
    rating: 4.6,
    reviews: 67,
    status: 'active',
    featured: true,
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
  },
  {
    id: '9',
    name: 'Producto de Aseo Multiusos',
    description: 'Producto de limpieza multiusos para el hogar',
    price: 8.99,
    originalPrice: 11.99,
    category: 'Aseos',
    image: '/img/aseo.webp',
    stock: 30,
    rating: 4.1,
    reviews: 45,
    status: 'active',
    featured: false,
    createdAt: '2024-01-14T10:15:00Z',
    updatedAt: '2024-01-18T12:30:00Z',
  },
  {
    id: '10',
    name: 'Kit de Limpieza Completo',
    description: 'Kit completo con todos los productos de limpieza necesarios',
    price: 35.99,
    originalPrice: 42.99,
    category: 'Aseos',
    image: '/img/aseo.webp',
    stock: 8,
    rating: 4.7,
    reviews: 23,
    status: 'active',
    featured: false,
    createdAt: '2024-01-12T08:45:00Z',
    updatedAt: '2024-01-17T14:20:00Z',
  },
];

export default function AdminProductsPage() {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof mockProducts)[0] | null
  >(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Use global products store
  const { products, setProducts, addProduct, updateProduct, deleteProduct } =
    useAdminProducts();

  // Estado para el formulario de agregar producto
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    featured: false,
    active: true,
  });

  // Estado para el formulario de editar producto
  const [editProduct, setEditProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    featured: false,
    active: true,
  });

  // Initialize products with mock data if empty
  useEffect(() => {
    if (products.length === 0) {
      setProducts(mockProducts);
    }
  }, [products.length, setProducts]);

  // Redirigir si no es admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);

  // Función para limpiar el formulario
  const clearForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image: '',
      featured: false,
      active: true,
    });
  };

  // Función para manejar cambios en el formulario
  const handleFormChange = (
    field: string,
    value: string | number | boolean,
  ) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Función para manejar cambios en el formulario de edición
  const handleEditFormChange = (
    field: string,
    value: string | number | boolean,
  ) => {
    setEditProduct(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Función para abrir modal de edición
  const handleEditProduct = (product: (typeof mockProducts)[0]) => {
    setSelectedProduct(product);
    setEditProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      image: product.image,
      featured: product.featured,
      active: product.status === 'active',
    });
    setShowEditModal(true);
  };

  // Función para guardar cambios de edición
  const handleSaveEdit = () => {
    // Validación básica
    if (
      !editProduct.name ||
      !editProduct.description ||
      !editProduct.price ||
      !editProduct.category
    ) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar precio
    if (parseFloat(editProduct.price) <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }

    // Validar stock
    if (parseInt(editProduct.stock) < 0) {
      toast.error('El stock no puede ser negativo');
      return;
    }

    if (selectedProduct) {
      // Actualizar producto usando el store global
      const updatedProduct = {
        ...selectedProduct,
        name: editProduct.name,
        description: editProduct.description,
        price: parseFloat(editProduct.price),
        originalPrice: parseFloat(editProduct.price) * 1.2,
        category: editProduct.category,
        image: editProduct.image,
        stock: parseInt(editProduct.stock) || 0,
        status: editProduct.active ? 'active' : 'inactive',
        featured: editProduct.featured,
        updatedAt: new Date().toISOString(),
      };

      updateProduct(selectedProduct.id, updatedProduct);

      // Mostrar notificación
      toast.success(`Producto "${editProduct.name}" actualizado correctamente`);

      // Cerrar modal
      setShowEditModal(false);
      setSelectedProduct(null);
    }
  };

  // Función para agregar producto
  const handleAddProduct = () => {
    // Validación básica
    if (
      !newProduct.name ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.category
    ) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar precio
    if (parseFloat(newProduct.price) <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }

    // Validar stock
    if (parseInt(newProduct.stock) < 0) {
      toast.error('El stock no puede ser negativo');
      return;
    }

    // Seleccionar imagen por defecto según categoría
    let defaultImage = '/img/arrocera.webp';
    if (newProduct.category === 'Comida') {
      defaultImage = '/img/combo-comida.webp';
    } else if (newProduct.category === 'Aseos') {
      defaultImage = '/img/aseo.webp';
    }

    // Crear nuevo producto con el formato correcto para el store
    const productToAdd = {
      id: Date.now().toString(), // ID temporal
      slug: newProduct.name.toLowerCase().replace(/\s+/g, '-'),
      productName: newProduct.name,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      originalPrice: parseFloat(newProduct.price) * 1.2, // 20% más como precio original
      category: newProduct.category,
      images: [newProduct.image || defaultImage],
      image: newProduct.image || defaultImage,
      stock: parseInt(newProduct.stock) || 0,
      rating: 4.0, // Rating por defecto
      reviews: 0, // Reviews por defecto
      status: (newProduct.active ? 'active' : 'inactive') as
        | 'active'
        | 'inactive',
      featured: newProduct.featured,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Agregar usando el store global
    addProduct(productToAdd);

    // Mostrar notificación
    toast.success(`Producto "${newProduct.name}" agregado correctamente`);

    // Limpiar formulario y cerrar modal
    clearForm();
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus =
      filterStatus === 'all' || product.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: string | number = a[sortBy as keyof typeof a] as
      | string
      | number;
    let bValue: string | number = b[sortBy as keyof typeof b] as
      | string
      | number;

    if (sortBy === 'price' || sortBy === 'stock' || sortBy === 'rating') {
      aValue = parseFloat(String(aValue));
      bValue = parseFloat(String(bValue));
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Paginación
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Funciones de ordenamiento
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Funciones de selección masiva
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId],
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map(p => p.id));
    }
  };

  // Funciones de acciones masivas
  const bulkToggleFeatured = () => {
    selectedProducts.forEach(productId => {
      const product = products.find(p => p.id === productId);
      if (product) {
        const updatedProduct = { ...product, featured: !product.featured };
        updateProduct(productId, updatedProduct);
      }
    });

    toast.success(`${selectedProducts.length} productos actualizados`);
    setSelectedProducts([]);
  };

  const bulkToggleStatus = () => {
    selectedProducts.forEach(productId => {
      const product = products.find(p => p.id === productId);
      if (product) {
        const updatedProduct = {
          ...product,
          status: product.status === 'active' ? 'inactive' : 'active',
        };
        updateProduct(productId, updatedProduct);
      }
    });

    toast.success(`${selectedProducts.length} productos actualizados`);
    setSelectedProducts([]);
  };

  const bulkDelete = () => {
    selectedProducts.forEach(productId => {
      deleteProduct(productId);
    });

    toast.success(`${selectedProducts.length} productos eliminados`);
    setSelectedProducts([]);
  };

  // Función para duplicar producto
  const duplicateProduct = (product: (typeof products)[0]) => {
    const duplicatedProduct = {
      ...product,
      id: Date.now().toString(),
      name: `${product.name} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addProduct(duplicatedProduct);
    toast.success(`Producto "${product.name}" duplicado correctamente`);
  };

  // Calcular estadísticas
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0,
  );
  const averageRating =
    products.length > 0
      ? (
          products.reduce((sum, p) => sum + p.rating, 0) / products.length
        ).toFixed(1)
      : '0.0';
  const totalReviews = products.reduce((sum, p) => sum + p.reviews, 0);

  // Funciones de manejo
  const handleDeleteProduct = (product: (typeof mockProducts)[0]) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      toast.success(
        `Producto "${selectedProduct.name}" eliminado correctamente`,
      );
    }
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen mt-18 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-8 gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 font-medium rounded-xl"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Volver al Dashboard
                </Button>
              </Link>
              <div className="text-white">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  📦 Gestión de Productos
                </h1>
                <p className="text-lg lg:text-xl text-purple-100">
                  Administra el catálogo de productos de la tienda
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
              <Shield className="h-5 w-5 text-white" />
              <span className="text-white font-semibold">Administrador</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats Cards Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-purple-100">
                Total Productos
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <Package className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{products.length}</div>
              <p className="text-purple-100 text-sm">En el catálogo</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-rose-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-pink-100">
                Destacados
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {products.filter(p => p.featured).length}
              </div>
              <p className="text-pink-100 text-sm">Productos destacados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-emerald-100">
                En Stock
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <Tag className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {products.filter(p => p.stock > 0).length}
              </div>
              <p className="text-emerald-100 text-sm">Con inventario</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-blue-100">
                Valor Total
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                ${totalValue.toFixed(0)}
              </div>
              <p className="text-blue-100 text-sm">Valor del inventario</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-orange-100">
                Stock Bajo
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{lowStockProducts}</div>
              <p className="text-orange-100 text-sm">Menos de 10 unidades</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-yellow-100">
                Rating Promedio
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{averageRating}</div>
              <p className="text-yellow-100 text-sm">{totalReviews} reseñas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Premium */}
        <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-t-2xl">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Filter className="h-6 w-6" />
              Filtros y Búsqueda
            </CardTitle>
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                  <Input
                    placeholder="Buscar productos por nombre, descripción..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                <option value="Electródomesticos">Electródomesticos</option>
                <option value="Comida">Comida</option>
                <option value="Aseos">Aseos</option>
              </select>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Products List Premium */}
        <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <Package className="h-6 w-6" />
                Lista de Productos ({filteredProducts.length})
              </CardTitle>
              <div className="flex items-center gap-3">
                {/* Vista Grid/Lista */}
                <div className="flex bg-white/20 rounded-xl p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`h-8 px-3 rounded-lg ${
                      viewMode === 'grid'
                        ? 'bg-white/30 text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`h-8 px-3 rounded-lg ${
                      viewMode === 'list'
                        ? 'bg-white/30 text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Acciones masivas */}
                {selectedProducts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={bulkToggleFeatured}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-8 px-3"
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Destacar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={bulkToggleStatus}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-8 px-3"
                    >
                      <EyeOff className="h-4 w-4 mr-1" />
                      Estado
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={bulkDelete}
                      className="bg-red-500/20 hover:bg-red-500/30 text-white border-red-300 h-8 px-3"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-8 px-3"
                    title="Exportar productos"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-8 px-3"
                    title="Importar productos"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 font-medium rounded-xl px-6 py-3"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Agregar Producto
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Controles de ordenamiento y paginación */}
          <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              {/* Ordenamiento */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Ordenar por:
                </span>
                <div className="flex gap-2">
                  {[
                    { field: 'name', label: 'Nombre' },
                    { field: 'price', label: 'Precio' },
                    { field: 'stock', label: 'Stock' },
                    { field: 'rating', label: 'Rating' },
                    { field: 'createdAt', label: 'Fecha' },
                  ].map(({ field, label }) => (
                    <Button
                      key={field}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSort(field)}
                      className={`h-8 px-3 rounded-lg ${
                        sortBy === field
                          ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-600 dark:text-purple-300'
                          : 'border-neutral-300 dark:border-neutral-600'
                      }`}
                    >
                      {label}
                      {sortBy === field &&
                        (sortOrder === 'asc' ? (
                          <ChevronUp className="h-3 w-3 ml-1" />
                        ) : (
                          <ChevronDown className="h-3 w-3 ml-1" />
                        ))}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Paginación */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Página {currentPage} de {totalPages}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    ←
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    →
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Selección masiva */}
            {paginatedProducts.length > 0 && (
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === paginatedProducts.length
                    }
                    onChange={selectAllProducts}
                    className="h-4 w-4 rounded border-neutral-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Seleccionar todos ({selectedProducts.length} de{' '}
                    {paginatedProducts.length})
                  </span>
                </label>
              </div>
            )}

            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {paginatedProducts.map(product => (
                <div
                  key={product.id}
                  className={`bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-200 overflow-hidden ${
                    selectedProducts.includes(product.id)
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : ''
                  }`}
                >
                  {/* Checkbox de selección */}
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      className="h-4 w-4 rounded border-neutral-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.featured && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        ⭐ Destacado
                      </div>
                    )}
                    <div className="absolute top-2 left-8">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {product.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          {product.rating}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          ({product.reviews})
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                        Stock: {product.stock}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ${product.price.toFixed(2)}
                        </p>
                        {product.originalPrice > product.price && (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 h-10 rounded-xl border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicateProduct(product)}
                        className="h-10 w-10 rounded-xl border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        title="Duplicar producto"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product)}
                        className="h-10 w-10 rounded-xl border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 rounded-xl border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        title="Más acciones"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mensaje cuando no hay productos */}
            {paginatedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-neutral-500 dark:text-neutral-500">
                  {filteredProducts.length === 0
                    ? 'No hay productos que coincidan con los filtros aplicados'
                    : 'No hay productos en esta página'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-white/20 dark:border-neutral-800 max-w-md w-full">
            {/* Header Premium */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-8 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    ⚠️ Confirmar Eliminación
                  </h2>
                  <p className="text-red-100 text-lg">
                    Esta acción no se puede deshacer
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteModal(false)}
                  className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                      ¿Eliminar producto?
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      &quot;{selectedProduct.name}&quot;
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6">
                <h4 className="font-medium text-neutral-800 dark:text-neutral-200 mb-3">
                  ⚠️ Esta acción eliminará permanentemente:
                </h4>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    El producto del catálogo
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    Toda la información asociada
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    No se puede recuperar
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Premium */}
            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-6 rounded-b-3xl border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 h-12 rounded-xl border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 font-medium"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  🗑️ Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Agregar Producto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-white/20 dark:border-neutral-800 max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header Premium */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-3xl flex-shrink-0">
              <div className="flex justify-between items-center">
                <div className="text-white">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                    ✨ Nuevo Producto
                  </h2>
                  <p className="text-blue-100 text-base lg:text-lg">
                    Agrega un producto a tu catálogo
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false);
                    clearForm();
                  }}
                  className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              {/* Indicador de acción */}
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      Completa la información del producto
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Llena todos los campos obligatorios y haz clic en
                      &quot;AGREGAR PRODUCTO&quot; al final
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Información Básica */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Información Básica
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Nombre del Producto *
                      </label>
                      <Input
                        placeholder="Ej: Licuadora Profesional"
                        value={newProduct.name}
                        onChange={e => handleFormChange('name', e.target.value)}
                        className="h-12 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Categoría *
                      </label>
                      <select
                        className="w-full h-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newProduct.category}
                        onChange={e =>
                          handleFormChange('category', e.target.value)
                        }
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="Electródomesticos">
                          Electródomesticos
                        </option>
                        <option value="Comida">Comida</option>
                        <option value="Aseos">Aseos</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Precio *
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={newProduct.price}
                        onChange={e =>
                          handleFormChange('price', e.target.value)
                        }
                        className="h-12 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Stock
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={newProduct.stock}
                        onChange={e =>
                          handleFormChange('stock', e.target.value)
                        }
                        className="h-12 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Descripción del Producto
                  </h3>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Descripción *
                    </label>
                    <textarea
                      className="w-full min-h-[120px] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe las características y beneficios del producto..."
                      value={newProduct.description}
                      onChange={e =>
                        handleFormChange('description', e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Imagen */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Imagen del Producto
                  </h3>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      URL de la Imagen
                    </label>
                    <Input
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={newProduct.image}
                      onChange={e => handleFormChange('image', e.target.value)}
                      className="h-12 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      💡 Deja vacío para usar una imagen por defecto según la
                      categoría
                    </p>
                  </div>
                </div>

                {/* Configuración */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Configuración
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded-lg border-2 border-neutral-300 focus:ring-2 focus:ring-orange-500 text-orange-500"
                        checked={newProduct.featured}
                        onChange={e =>
                          handleFormChange('featured', e.target.checked)
                        }
                      />
                      <div>
                        <span className="block font-medium text-neutral-800 dark:text-neutral-200">
                          Destacado
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          Aparecerá en la sección destacados
                        </span>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded-lg border-2 border-neutral-300 focus:ring-2 focus:ring-orange-500 text-orange-500"
                        checked={newProduct.active}
                        onChange={e =>
                          handleFormChange('active', e.target.checked)
                        }
                      />
                      <div>
                        <span className="block font-medium text-neutral-800 dark:text-neutral-200">
                          Activo
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          Visible para los clientes
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Premium */}
            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-4 rounded-b-3xl border-t border-neutral-200 dark:border-neutral-700 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    clearForm();
                  }}
                  className="flex-1 h-12 rounded-xl border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 font-semibold text-base transition-all duration-200"
                >
                  ❌ Cancelar
                </Button>
                <Button
                  onClick={handleAddProduct}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Plus className="h-5 w-5" />
                    🚀 AGREGAR PRODUCTO
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Producto */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-white/20 dark:border-neutral-800 max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header Premium */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-t-3xl flex-shrink-0">
              <div className="flex justify-between items-center">
                <div className="text-white">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                    ✏️ Editar Producto
                  </h2>
                  <p className="text-emerald-100 text-base lg:text-lg">
                    Modifica la información del producto
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                  }}
                  className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              {/* Indicador de acción */}
              <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <Edit className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">
                      Editando: {selectedProduct.name}
                    </h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      Modifica los campos que necesites y haz clic en
                      &quot;GUARDAR CAMBIOS&quot; al final
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Información Básica */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Información Básica
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Nombre del Producto *
                      </label>
                      <Input
                        placeholder="Ej: Licuadora Profesional"
                        value={editProduct.name}
                        onChange={e =>
                          handleEditFormChange('name', e.target.value)
                        }
                        className="h-12 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Categoría *
                      </label>
                      <select
                        className="w-full h-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={editProduct.category}
                        onChange={e =>
                          handleEditFormChange('category', e.target.value)
                        }
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="Electródomesticos">
                          Electródomesticos
                        </option>
                        <option value="Comida">Comida</option>
                        <option value="Aseos">Aseos</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Precio *
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={editProduct.price}
                        onChange={e =>
                          handleEditFormChange('price', e.target.value)
                        }
                        className="h-12 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Stock
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={editProduct.stock}
                        onChange={e =>
                          handleEditFormChange('stock', e.target.value)
                        }
                        className="h-12 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    Descripción del Producto
                  </h3>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Descripción *
                    </label>
                    <textarea
                      className="w-full min-h-[120px] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Describe las características y beneficios del producto..."
                      value={editProduct.description}
                      onChange={e =>
                        handleEditFormChange('description', e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Imagen */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    Imagen del Producto
                  </h3>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      URL de la Imagen
                    </label>
                    <Input
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={editProduct.image}
                      onChange={e =>
                        handleEditFormChange('image', e.target.value)
                      }
                      className="h-12 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      🖼️ URL de la imagen del producto
                    </p>
                  </div>
                </div>

                {/* Configuración */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    Configuración
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded-lg border-2 border-neutral-300 focus:ring-2 focus:ring-indigo-500 text-indigo-500"
                        checked={editProduct.featured}
                        onChange={e =>
                          handleEditFormChange('featured', e.target.checked)
                        }
                      />
                      <div>
                        <span className="block font-medium text-neutral-800 dark:text-neutral-200">
                          Destacado
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          Aparecerá en la sección destacados
                        </span>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded-lg border-2 border-neutral-300 focus:ring-2 focus:ring-indigo-500 text-indigo-500"
                        checked={editProduct.active}
                        onChange={e =>
                          handleEditFormChange('active', e.target.checked)
                        }
                      />
                      <div>
                        <span className="block font-medium text-neutral-800 dark:text-neutral-200">
                          Activo
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          Visible para los clientes
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Premium */}
            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-4 rounded-b-3xl border-t border-neutral-200 dark:border-neutral-700 flex-shrink-0">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 h-12 rounded-xl border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 font-medium"
                >
                  ❌ Cancelar
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Edit className="h-5 w-5" />
                    💾 GUARDAR CAMBIOS
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
