/* eslint-disable @next/next/no-img-element */
import { getCategories } from '@/lib/get-categories';
import Link from 'next/link';
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

type Category = {
  categoryName: string;
  slug: string;
  image: string;
};

export default async function Categories() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Blobs decorativos premium */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-16 h-16 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-10 h-10 bg-primary/5 rounded-full blur-lg animate-pulse delay-2000"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 relative z-10">
        {/* Header premium */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-base font-semibold mb-4 shadow-md">
            <Sparkles className="h-5 w-5 animate-bounce" />
            Explora por categorías
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground animate-gradient">
            Nuestras Categorías
          </h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra productos exclusivos y de alta calidad en cada categoría
          </p>
        </div>

        {/* Grid de categorías premium */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 py-8">
          {categories.map((category: Category, index) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="relative bg-background/80 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-border/20 transition-all duration-500 hover:scale-[1.03] flex flex-col h-[420px] min-h-[420px]">
                {/* Badge animado sobre la imagen */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary/80 to-secondary/80 text-primary-foreground text-xs font-bold shadow-lg animate-fade-in">
                    <Sparkles className="h-3 w-3" />
                    Destacada
                  </span>
                </div>
                {/* Imagen protagonista mitad superior */}
                <div className="relative w-full h-36 rounded-t-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                  <img
                    src={category.image}
                    alt={category.categoryName}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradiente y sombra sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"></div>
                </div>
                {/* Info inferior glassmorphism */}
                <div className="flex-1 flex flex-col justify-between p-5 bg-background/70 backdrop-blur-xl rounded-b-3xl shadow-inner z-10 space-y-3">
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300 text-center">
                    {category.categoryName}
                  </h3>
                  <p className="text-base text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 text-center">
                    Explora productos exclusivos
                  </p>
                  {/* CTA visual */}
                  <div className="flex justify-center mt-2">
                    <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
                      Ver más <ArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
                {/* Efecto de brillo al hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA adicional */}
        <div className="text-center mt-14">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background/70 backdrop-blur-md border border-border/20 text-muted-foreground hover:text-foreground transition-colors duration-300 shadow-md">
            <span className="text-base font-medium">
              ¿No encuentras lo que buscas?
            </span>
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
