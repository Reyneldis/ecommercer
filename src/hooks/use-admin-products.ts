import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface AdminProduct {
  id: string;
  slug: string;
  productName: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  categoryId: string;
  image: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  status: 'active' | 'inactive';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  features: string[];
  variants: Array<{
    id: string;
    name: string;
    price: number;
    stock: number;
    attributes: Record<string, any>;
  }>;
}

export interface CreateProductData {
  productName: string;
  slug: string;
  price: number;
  description?: string;
  categoryId: string;
  features?: string[];
  variants?: Array<{
    name: string;
    price: number;
    stock: number;
    attributes?: Record<string, any>;
  }>;
  images?: Array<{
    url: string;
    alt?: string;
    sortOrder?: number;
    isPrimary?: boolean;
  }>;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  // Campos opcionales para actualización
}

export function useAdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/products');

      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Crear producto
  const createProduct = async (productData: CreateProductData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear producto');
      }

      const newProduct = await response.json();
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Producto creado correctamente');
      return newProduct;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Actualizar producto
  const updateProduct = async (id: string, productData: UpdateProductData) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar producto');
      }

      const updatedProduct = await response.json();
      setProducts(prev =>
        prev.map(product => (product.id === id ? updatedProduct : product)),
      );
      toast.success('Producto actualizado correctamente');
      return updatedProduct;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Eliminar producto
  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar producto');
      }

      setProducts(prev => prev.filter(product => product.id !== id));
      toast.success('Producto eliminado correctamente');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Obtener producto por ID
  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  };
}
