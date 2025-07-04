'use client';

import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/shared/ProductCard/ProductCard';
import Categories from '@/components/shared/categories';
import { Skeleton } from '@/components/ui/skeleton';
import { products as productsData } from '@/lib/data';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const products = productsData;
  const loading = false;

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo premium con blobs y degradado */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-[#e0e7ff] via-[#f5f7fa] to-[#c7d2fe] dark:from-[#232946] dark:via-[#121629] dark:to-[#232946]" />
        <svg
          className="absolute left-[-10%] top-[-10%] w-[60vw] h-[60vw] opacity-40 blur-2xl animate-pulse"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="200" cy="200" rx="200" ry="200" fill="#a5b4fc" />
        </svg>
        <svg
          className="absolute right-[-15%] bottom-[-15%] w-[50vw] h-[50vw] opacity-30 blur-2xl animate-pulse delay-1000"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="200" cy="200" rx="200" ry="200" fill="#fbcfe8" />
        </svg>
        <svg
          className="absolute left-[30%] top-[60%] w-[40vw] h-[40vw] opacity-20 blur-2xl animate-pulse delay-500"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="200" cy="200" rx="200" ry="200" fill="#fcd34d" />
        </svg>
      </div>
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
                <Skeleton
                  key={index}
                  className="h-[420px] rounded-3xl w-full bg-white dark:bg-neutral-900 shadow-sm"
                />
              ))}
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, idx) => (
                    <ProductCard
                      key={product.slug}
                      product={{
                        ...product,
                        id: idx,
                        image: product.images[0],
                      }}
                    />
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
