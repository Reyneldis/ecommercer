'use client';

import AddToCartButton from '@/components/shared/AddToCartButton/AddToCartButton';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { useRouter } from 'next/navigation';

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-6 mt-6">
      <AddToCartButton product={product} />
      <button className="group flex items-center gap-2 justify-center text-base font-semibold text-neutral-700 dark:text-neutral-200 px-0 py-2 bg-transparent transition-all relative focus:outline-none">
        <span className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Comprar Ahora
        </span>
        <span
          className="absolute left-1/2 -bottom-0.5 w-0 group-hover:w-3/4 h-0.5 bg-primary rounded-full transition-all duration-300"
          style={{ transform: 'translateX(-50%)' }}
        ></span>
      </button>
      <button
        onClick={() => router.back()}
        className="group text-base text-neutral-400 dark:text-neutral-500 font-medium px-0 py-2 bg-transparent transition-all relative focus:outline-none"
      >
        Volver
        <span className="block mx-auto mt-0.5 h-0.5 w-0 group-hover:w-2/3 bg-neutral-300 dark:bg-neutral-700 rounded-full transition-all duration-300"></span>
      </button>
    </div>
  );
}
