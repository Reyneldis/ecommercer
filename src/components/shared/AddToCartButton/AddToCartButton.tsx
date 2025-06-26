'use client';

import { useCart } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';
import { SignInButton, useAuth } from '@clerk/nextjs';

interface AddToCartButtonProps {
  product: {
    id: number;
    productName: string;
    price: number;
    image: string;
    slug: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { isSignedIn } = useAuth();

  const handleAddToCart = () => {
    if (!isSignedIn) return;
    addItem(product);
  };

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className="group relative flex-1 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <span className="relative z-10 flex items-center justify-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Inicia sesión para comprar
          </span>
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
      </SignInButton>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className="group relative flex-1 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        <ShoppingCart className="h-5 w-5" />
        Añadir al Carrito
      </span>
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    </button>
  );
}
