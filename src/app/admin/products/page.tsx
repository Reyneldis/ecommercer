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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  useAdminProducts,
  AdminProduct,
  CreateProductData,
  UpdateProductData,
} from '@/hooks/use-admin-products';
import { useCategories } from '@/hooks/use-categories';
import Image from 'next/image';
import { ProductForm } from '@/components/shared/ProductForm';

export default function AdminProductsPage() {
  const { isAdmin, loading } = useAdmin();

  // Usar el hook real de productos
  const {
    products,
    loading: productsLoading,
    error: productsError,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useAdminProducts();

  const { categories, loading: loadingCategories } = useCategories();

  // Estados del formulario
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null,
  );

  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Estados de selección
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Formulario para agregar producto
  const [formData, setFormData] = useState<CreateProductData>({
    productName: '',
    slug: '',
    price: 0,
    description: '',
    categoryId: '',
    features: [],
    variants: [],
    images: [],
  });

  // Formulario para editar producto
  const [editFormData, setEditFormData] = useState<UpdateProductData>({
    productName: '',
    slug: '',
    price: 0,
    description: '',
    categoryId: '',
    features: [],
    variants: [],
    images: [],
  });

  // Estados para errores de validación
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Limpiar formulario
  const clearForm = () => {
    setFormData({
      productName: '',
      slug: '',
      price: 0,
      description: '',
      categoryId: '',
      features: [],
      variants: [],
      images: [],
    });
  };

  // Manejar cambios en el formulario
  const handleFormChange = <K extends keyof CreateProductData>(
    field: K,
    value: CreateProductData[K],
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Manejar cambios en el formulario de edición
  const handleEditFormChange = <K extends keyof UpdateProductData>(
    field: K,
    value: UpdateProductData[K],
  ) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  // Manejar edición de producto
  const handleEditProduct = (product: AdminProduct) => {
    setSelectedProduct(product);
    setEditFormData({
      productName: product.productName,
      slug: product.slug,
      price: product.price,
      description: product.description,
      categoryId: product.categoryId,
      features: product.features,
      variants: product.variants,
      images: product.images.map((url, index) => ({
        url,
        alt: product.productName,
        sortOrder: index,
        isPrimary: index === 0,
      })),
    });
    setShowEditModal(true);
  };

  // Guardar edición
  const handleSaveEdit = async () => {
    if (!selectedProduct) return;
    try {
      await updateProduct(selectedProduct.id, editFormData);
      setShowEditModal(false);
      setSelectedProduct(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Error al actualizar producto');
      } else {
        toast.error('Error al actualizar producto');
      }
    }
  };

  // Función de validación
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.productName) errors.productName = 'El nombre es requerido';
    if (!formData.slug) errors.slug = 'El slug es requerido';
    if (!formData.price || Number(formData.price) <= 0)
      errors.price = 'El precio es requerido y debe ser mayor a 0';
    if (!formData.categoryId) errors.categoryId = 'La categoría es requerida';
    return errors;
  };

  // Agregar producto
  const handleAddProduct = async () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error('Por favor completa todos los campos obligatorios.');
      return;
    }
    try {
      await createProduct(formData);
      setShowAddModal(false);
      clearForm();
      setFormErrors({});
    } catch (error) {
      // El toast de error ya lo lanza createProduct
    }
  };

  // Calcular estadísticas
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0,
  );
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const averageRating =
    products.length > 0
      ? (
          products.reduce((sum, p) => sum + p.rating, 0) / products.length
        ).toFixed(1)
      : '0.0';
  const totalReviews = products.reduce((sum, p) => sum + p.reviews, 0);

  // Filtrar y ordenar productos
  const filteredProducts = products
    .filter(product => {
      const matchesSearch =
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === 'all' || product.category === filterCategory;
      const matchesStatus =
        filterStatus === 'all' || product.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof AdminProduct];
      const bValue = b[sortField as keyof AdminProduct];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  // Calcular paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterStatus]);

  // Manejar ordenamiento
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Manejar selección de productos
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId],
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length
        ? []
        : filteredProducts.map(p => p.id),
    );
  };

  // Operaciones en lote
  const bulkToggleFeatured = () => {
    // Implementar lógica de toggle featured
    toast.info('Función de destacar en lote próximamente');
  };

  const bulkToggleStatus = () => {
    // Implementar lógica de toggle status
    toast.info('Función de cambiar estado en lote próximamente');
  };

  const bulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    try {
      await Promise.all(selectedProducts.map(id => deleteProduct(id)));
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error deleting products:', error);
    }
  };

  // Duplicar producto
  const duplicateProduct = (product: AdminProduct) => {
    const duplicatedProduct = {
      ...product,
      productName: `${product.productName} (Copia)`,
      slug: `${product.slug}-copia-${Date.now()}`,
    };

    setFormData({
      productName: duplicatedProduct.productName,
      slug: duplicatedProduct.slug,
      price: duplicatedProduct.price,
      description: duplicatedProduct.description,
      categoryId: duplicatedProduct.categoryId,
      features: duplicatedProduct.features,
      variants: duplicatedProduct.variants,
      images: duplicatedProduct.images.map((url, index) => ({
        url,
        alt: duplicatedProduct.productName,
        sortOrder: index,
        isPrimary: index === 0,
      })),
    });
    setShowAddModal(true);
  };

  // Eliminar producto
  const handleDeleteProduct = (product: AdminProduct) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-lg font-medium text-neutral-600 dark:text-neutral-400">
            Cargando productos...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error al cargar productos
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            {productsError}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

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
                ${Number(totalValue).toFixed(0)}
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
                        sortField === field
                          ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-600 dark:text-purple-300'
                          : 'border-neutral-300 dark:border-neutral-600'
                      }`}
                    >
                      {label}
                      {sortField === field &&
                        (sortDirection === 'asc' ? (
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
            {filteredProducts.length > 0 && (
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === filteredProducts.length
                    }
                    onChange={selectAllProducts}
                    className="h-4 w-4 rounded border-neutral-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Seleccionar todos ({selectedProducts.length} de{' '}
                    {filteredProducts.length})
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
                  className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col items-center transition hover:shadow-lg min-h-[320px]"
                >
                  {/* Imagen principal */}
                  <div className="w-full flex justify-center mb-4">
                    <Image
                      src={product.images[0] || product.image}
                      alt={product.productName}
                      width={160}
                      height={120}
                      className="rounded-xl object-cover h-32 w-40 bg-neutral-100 dark:bg-neutral-800"
                    />
                  </div>
                  {/* Chip de estado */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                        ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-200 text-gray-600 dark:bg-red-900 dark:text-red-200'
                        }
                      `}
                    >
                      {product.status === 'active' ? (
                        <svg
                          className="w-3 h-3 mr-1 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <circle cx="10" cy="10" r="10" />
                        </svg>
                      ) : (
                        <svg
                          className="w-3 h-3 mr-1 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <circle cx="10" cy="10" r="10" />
                        </svg>
                      )}
                      {product.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  {/* Nombre y precio */}
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg mb-1 text-center line-clamp-2">
                    {product.productName}
                  </h3>
                  <p className="text-xl font-bold text-primary mb-2 text-center">
                    ${Number(product.price).toFixed(2)}
                  </p>
                  {/* Acciones principales */}
                  <div className="flex gap-2 mt-auto w-full justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                      className="rounded-lg border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product)}
                      className="rounded-lg border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> Eliminar
                    </Button>
                  </div>
                  {/* Menú de más opciones (placeholder) */}
                  {/* <div className="absolute bottom-4 right-4">
                    <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div> */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                Eliminar producto
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-2xl font-bold px-2"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            {/* Content */}
            <div className="mb-4">
              <p className="text-base text-neutral-700 dark:text-neutral-200 mb-2">
                ¿Estás seguro de que deseas eliminar el producto?
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                "{selectedProduct.productName}"<br />
                Esta acción no se puede deshacer.
              </p>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="rounded-md bg-red-600 hover:bg-red-700 text-white px-6"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Agregar Producto */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                Agregar producto
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  clearForm();
                }}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-2xl font-bold px-2"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <ProductForm
              initialValues={formData}
              categories={categories}
              loading={productsLoading}
              onSubmit={async data => {
                await createProduct(data);
                setShowAddModal(false);
                clearForm();
              }}
              submitLabel="Agregar"
            />
          </div>
        </div>
      )}

      {/* Modal de Editar Producto */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                Editar producto
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-2xl font-bold px-2"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <ProductForm
              initialValues={editFormData}
              categories={categories}
              loading={productsLoading}
              onSubmit={async data => {
                if (!selectedProduct) return;
                await updateProduct(selectedProduct.id, data);
                setShowEditModal(false);
                setSelectedProduct(null);
              }}
              submitLabel="Guardar"
            />
          </div>
        </div>
      )}
    </div>
  );
}
