'use client';
import { ProductActions } from '@/components/shared/ProductActions/ProductActions';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import React, { useState, useEffect } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';
import type { Product } from '@/types';

interface ProductPageProps {
  params: Promise<{ produsctsSlug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | undefined>(undefined);

  useEffect(() => {
    async function fetchProduct() {
      const { produsctsSlug } = await params;
      const res = await fetch(`/api/products/${produsctsSlug}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        setProduct(null);
      }
    }
    fetchProduct();
  }, [params]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  if (!product) return null;

  return (
    <div className="min-h-screen flex justify-center items-center">
      <main className="min-h-screenflex items-center justify-center py-16">
        <div className="max-w-4xl w-full bg-white/80 dark:bg-neutral-900 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-10">
          {/* Imagen principal - carousel premium mejorado */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 relative">
            <div className="w-full max-w-md bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md rounded-3xl shadow-2xl p-4 relative">
              <Carousel className="w-full" setApi={setEmblaApi}>
                <CarouselContent>
                  {product.images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <div className="relative group transition-transform duration-500">
                        <Image
                          src={img.url}
                          alt={`${product.productName} ${idx + 1}`}
                          width={400}
                          height={300}
                          className="w-full h-auto object-contain rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-105 bg-white dark:bg-neutral-900"
                          priority={idx === 0}
                        />
                        {/* Contador de imagen */}
                        <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
                          {activeIndex + 1}/{product.images.length}
                        </span>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious
                  className="!size-12 !bg-white/90 dark:!bg-neutral-800/90 hover:!bg-primary hover:!text-white dark:hover:!bg-primary dark:hover:!text-white !border-none !shadow-xl transition absolute left-2 top-1/2 -translate-y-1/2 z-20"
                  onClick={() => emblaApi && emblaApi.scrollPrev()}
                />
                <CarouselNext
                  className="!size-12 !bg-white/90 dark:!bg-neutral-800/90 hover:!bg-primary hover:!text-white dark:hover:!bg-primary dark:hover:!text-white !border-none !shadow-xl transition absolute right-2 top-1/2 -translate-y-1/2 z-20"
                  onClick={() => emblaApi && emblaApi.scrollNext()}
                />
              </Carousel>
              {/* Dots de navegación dinámicos */}
              <div className="flex justify-center mt-4 gap-2">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => emblaApi && emblaApi.scrollTo(idx)}
                    className={`inline-block w-3 h-3 rounded-full transition-all duration-300 border-2 ${
                      activeIndex === idx
                        ? 'bg-primary border-primary scale-125 shadow-lg'
                        : 'bg-neutral-300 dark:bg-neutral-700 border-transparent'
                    }`}
                    aria-label={`Ir a la imagen ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Info */}
          <div className="flex-1 flex flex-col justify-between gap-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                {product.productName}
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-6">
                {product.description}
              </p>
              {/* Características */}
              {product.features && product.features.length > 0 && (
                <ul className="mb-4 list-disc list-inside text-neutral-700 dark:text-neutral-200">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              )}
              {/* Variantes funcionales */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                    Opciones disponibles:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.variants.map((variant, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full border bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 text-sm shadow-sm"
                      >
                        {variant.name ? `Variante: ${variant.name}` : ''}
                        {variant.price ? ` $${variant.price}` : ''}
                        {variant.stock !== undefined
                          ? ` (${variant.stock} disponibles)`
                          : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-2xl font-semibold text-primary mb-2">
                ${product.price}
              </p>
            </div>
            <ProductActions product={product} />
          </div>
        </div>
      </main>
    </div>
  );
}
