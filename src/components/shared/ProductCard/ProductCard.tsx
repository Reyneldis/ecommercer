'use client';

import { ShoppingCart, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/hooks/use-cart';
import { SignInButton, useAuth } from '@clerk/nextjs';
import Image from 'next/image';

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
    <div className="group relative bg-background/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-border/20 transition-all duration-500 hover:scale-[1.025] flex flex-col h-[420px] min-h-[420px]">
      {/* Badge de oferta o novedad */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary/80 to-secondary/80 text-primary-foreground text-xs font-bold shadow-lg animate-fade-in">
          <Sparkles className="h-3 w-3" />
          Nuevo
        </span>
      </div>

      {/* Imagen protagonista (65% de la altura) */}
      <div className="relative w-full h-[65%] min-h-[210px] rounded-t-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <Link
          href={`/products/${product.slug}`}
          className="block w-full h-full"
        >
          <Image
            src={product.image}
            alt={product.productName}
            width={400}
            height={273}
            className="w-full h-auto object-cover object-center transition-transform duration-700 group-hover:scale-110"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 100%)',
            }}
            onError={e => {
              e.currentTarget.style.objectFit = 'contain';
            }}
            priority={false}
          />
          {/* Gradiente y sombra sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"></div>
        </Link>
      </div>

      {/* Info inferior glassmorphism */}
      <div className="flex-1 flex flex-col justify-between p-5 bg-background/80 backdrop-blur-2xl rounded-b-3xl shadow-inner z-10 space-y-3">
        {/* Nombre */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.productName}
          </h3>
        </Link>

        {/* Categoría y descripción */}
        <div className="flex items-center gap-2 justify-center">
          <span className="text-xs font-medium text-muted-foreground/80">
            {product.category}
          </span>
          <span className="text-xs text-muted-foreground/40">•</span>
          <span className="text-xs text-muted-foreground/80 line-clamp-1">
            {product.description}
          </span>
        </div>

        {/* Precio y botones */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xl font-extrabold text-primary drop-shadow-sm">
            ${product.price}
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="group/eye flex items-center justify-center p-2 rounded-full bg-background/70 backdrop-blur-md border border-border/20 shadow-md text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-xl focus:outline-none"
              aria-label="Ver detalles"
            >
              <Eye className="h-5 w-5" />
            </Link>
            {isSignedIn ? (
              <button
                onClick={handleAddToCart}
                className="group/cart flex items-center justify-center p-2 rounded-full bg-primary/10 border border-primary/20 shadow-md text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-xl focus:outline-none"
                aria-label="Añadir al carrito"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
            ) : (
              <SignInButton mode="modal">
                <button
                  className="group/cart flex items-center justify-center p-2 rounded-full bg-primary/10 border border-primary/20 shadow-md text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-xl focus:outline-none"
                  aria-label="Inicia sesión para comprar"
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>

      {/* Efecto de brillo al hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
    </div>
  );
}
