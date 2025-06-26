import Pagination from '@/components/shared/Pagination';
import { getProduct } from '@/lib/get-product';
import Link from 'next/link';
import React from 'react';
import ProductCard from '@/components/shared/ProductCard/ProductCard';
import type { Product } from '@/types';

const PAGE_SIZE = 3;

const priceRanges = [
  { label: 'Todos', min: 0, max: Infinity },
  { label: 'Menos de $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: 'Más de $200', min: 200, max: Infinity },
];

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | undefined;
}) {
  const { categoryId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  // Maneja que page y priceRange puedan ser arrays
  const page = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page ?? '1';

  const priceRange = Array.isArray(resolvedSearchParams.priceRange)
    ? resolvedSearchParams.priceRange[0]
    : resolvedSearchParams.priceRange ?? '0';

  const { products, pagination } = await getProduct({
    categoryId,
    page,
    pageSize: PAGE_SIZE,
  });

  // Filtrar productos por rango de precio
  const filteredProducts = products.filter((product: Product) => {
    const range = priceRanges[Number(priceRange)];
    return product.price >= range.min && product.price <= range.max;
  });

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Botón minimalista */}
        <div className="flex justify-center mb-20">
          <Link
            href="/"
            className="group relative text-xs tracking-widest uppercase text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-500"
          >
            <span className="relative z-10">Volver</span>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-neutral-400 group-hover:w-full transition-all duration-500"></span>
          </Link>
        </div>

        {/* Filtros de precio */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {priceRanges.map((range, index) => (
            <Link
              key={range.label}
              href={`?page=1&priceRange=${index}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                Number(priceRange) === index
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {range.label}
            </Link>
          ))}
        </div>

        {/* Grid de productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-32">
            <h2 className="text-xl font-light tracking-wide text-neutral-500 dark:text-neutral-400 mb-3">
              No hay productos disponibles en este rango de precio
            </h2>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">
              Prueba con otro rango de precio
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {filteredProducts.map((product: Product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}

        {/* Paginación */}
        {filteredProducts.length > 0 && (
          <div className="mt-12">
            <Pagination
              page={pagination.page}
              pageSize={pagination.pageSize}
              pageCount={pagination.pageCount}
              total={pagination.total}
            />
          </div>
        )}
      </div>
    </main>
  );
}
