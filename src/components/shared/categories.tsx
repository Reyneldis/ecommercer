/* eslint-disable @next/next/no-img-element */
import { getCategories } from '@/lib/get-categories';
import Link from 'next/link';
import React from 'react';

type Category = {
  categoryName: string;
  slug: string;
  image: string;
};

export default async function Categories() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <section className="bg-transparent py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold tracking-tight text-primary">
            Nuestras Categorías
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Explora nuestra selección de productos por categoría
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-20 gap-x-8">
          {categories.map((category: Category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center justify-start transition-all duration-300"
            >
              <div className="w-44 h-44 mb-7 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-lg border-4 border-primary/20 group-hover:scale-110 group-hover:border-primary transition-transform duration-300">
                <img
                  src={category.image}
                  alt={category.categoryName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors duration-300 text-center mb-2">
                {category.categoryName}
              </h3>
              <p className="text-lg text-gray-500 dark:text-gray-400 text-center">
                Ver productos
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
