import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  slug: string;
  productName: string;
  name?: string; // For admin compatibility
  price: number;
  originalPrice?: number;
  images: string[];
  image?: string; // For admin compatibility
  description: string;
  category: string;
  stock: number;
  rating?: number;
  reviews?: number;
  status?: 'active' | 'inactive';
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  features?: string[];
  variants?: Array<{ color: string; stock: number }>;
}

interface ProductsStore {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  getActiveProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  getProductsByCategory: (category: string) => Product[];
}

// Convert admin product format to main product format
const convertAdminToMain = (adminProduct: any): Product => ({
  id: adminProduct.id,
  slug:
    adminProduct.name?.toLowerCase().replace(/\s+/g, '-') || adminProduct.id,
  productName: adminProduct.name,
  name: adminProduct.name,
  price: adminProduct.price,
  originalPrice: adminProduct.originalPrice,
  images: [adminProduct.image],
  image: adminProduct.image,
  description: adminProduct.description,
  category: adminProduct.category?.toLowerCase() || 'electrodomesticos',
  stock: adminProduct.stock,
  rating: adminProduct.rating,
  reviews: adminProduct.reviews,
  status: adminProduct.status,
  featured: adminProduct.featured,
  createdAt: adminProduct.createdAt,
  updatedAt: adminProduct.updatedAt,
});

// Convert main product format to admin product format
const convertMainToAdmin = (mainProduct: Product): any => ({
  id: mainProduct.id,
  name: mainProduct.productName,
  description: mainProduct.description,
  price: mainProduct.price,
  originalPrice: mainProduct.originalPrice || mainProduct.price,
  category: mainProduct.category,
  image: mainProduct.images[0] || mainProduct.image,
  stock: mainProduct.stock,
  rating: mainProduct.rating || 4.5,
  reviews: mainProduct.reviews || 0,
  status: mainProduct.status || 'active',
  featured: mainProduct.featured || false,
  createdAt: mainProduct.createdAt || new Date().toISOString(),
  updatedAt: mainProduct.updatedAt || new Date().toISOString(),
});

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      products: [],

      setProducts: products => set({ products }),

      addProduct: product => {
        const newProduct = convertAdminToMain(product);
        set(state => ({
          products: [...state.products, newProduct],
        }));
      },

      updateProduct: (id, updatedProduct) => {
        set(state => ({
          products: state.products.map(product =>
            product.id === id
              ? { ...product, ...convertAdminToMain(updatedProduct) }
              : product,
          ),
        }));
      },

      deleteProduct: id => {
        set(state => ({
          products: state.products.filter(product => product.id !== id),
        }));
      },

      getProductById: id => {
        return get().products.find(product => product.id === id);
      },

      getProductBySlug: slug => {
        return get().products.find(product => product.slug === slug);
      },

      getActiveProducts: () => {
        return get().products.filter(product => product.status !== 'inactive');
      },

      getFeaturedProducts: () => {
        return get().products.filter(
          product => product.featured && product.status !== 'inactive',
        );
      },

      getProductsByCategory: category => {
        return get().products.filter(
          product =>
            product.category.toLowerCase() === category.toLowerCase() &&
            product.status !== 'inactive',
        );
      },
    }),
    {
      name: 'products-storage',
      partialize: state => ({ products: state.products }),
    },
  ),
);

// Hook for admin to use admin format
export const useAdminProducts = () => {
  const store = useProductsStore();

  return {
    products: store.products.map(convertMainToAdmin),
    setProducts: (adminProducts: any[]) => {
      store.setProducts(adminProducts.map(convertAdminToMain));
    },
    addProduct: store.addProduct,
    updateProduct: (id: string, adminProduct: any) => {
      store.updateProduct(id, convertAdminToMain(adminProduct));
    },
    deleteProduct: store.deleteProduct,
    getProductById: (id: string) => {
      const product = store.getProductById(id);
      return product ? convertMainToAdmin(product) : undefined;
    },
  };
};
