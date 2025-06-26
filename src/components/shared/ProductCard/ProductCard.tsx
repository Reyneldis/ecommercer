/* eslint-disable @next/next/no-img-element */
'use client';

import { ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/hooks/use-cart';
import { SignInButton, useAuth } from '@clerk/nextjs';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isSignedIn } = useAuth();

  const handleAddToCart = () => {
    if (!isSignedIn) return;
    addItem(product);
  };

  return (
    <div className="group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Imagen del producto */}
      <div className="aspect-[4/5] overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <img
            src={product.image}
            alt={product.productName}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Información del producto */}
      <div className="p-5 space-y-3">
        {/* Nombre */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.productName}
          </h3>
        </Link>

        {/* Categoría y Origen */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground/70">
            {product.category}
          </span>
          <span className="text-xs text-muted-foreground/50">•</span>
          <span className="text-xs text-muted-foreground/70">
            {product.description}
          </span>
        </div>

        {/* Precio y botones */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-lg font-semibold text-foreground">
            ${product.price}
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="p-2.5 rounded-full bg-muted/10 text-muted-foreground hover:bg-primary hover:text-white transition-colors"
            >
              <Eye className="h-5 w-5" />
            </Link>
            {isSignedIn ? (
              <button
                onClick={handleAddToCart}
                className="p-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
            ) : (
              <SignInButton mode="modal">
                <button
                  className="p-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                  aria-label="Inicia sesión para comprar"
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
