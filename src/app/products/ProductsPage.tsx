'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/shared/ProductCard/ProductCard';
import Categories from '@/components/shared/categories';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      !category || category === 'todos' || product.category === category;
    const matchesSearch =
      !search ||
      product.productName.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 py-12 mt-20">
        <div className="flex flex-col space-y-12">
          {/* Encabezado */}
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {category && category !== 'todos'
                ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
                : 'Nuestra Colección'}
            </h1>
            <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
              {category && category !== 'todos'
                ? `Explora nuestra selección de productos de ${category}`
                : 'Descubre nuestra colección de productos cuidadosamente seleccionados'}
            </p>
          </div>

          {/* Categorías */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
            <Categories />
          </div>

          {/* Grid de productos */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="aspect-[4/5] bg-neutral-200 dark:bg-neutral-800" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    No se encontraron productos
                  </h3>
                  <p className="text-base text-neutral-600 dark:text-neutral-400 mt-2">
                    {search
                      ? `No hay resultados para "${search}"`
                      : 'Intenta con otra categoría o vuelve más tarde'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
