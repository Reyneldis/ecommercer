'use client';

import { ShoppingCart, Menu, X } from 'lucide-react';
import Logo from '../Logo/Logo';
import { ModeToggle } from '../model-dark';
import { useCart } from '@/hooks/use-cart';
// import { toast } from 'sonner';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartModal from '../CartModal';
// Clerk imports
import { UserButton, SignInButton, useAuth } from '@clerk/nextjs';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');
  const { items } = useCart();
  const pathname = usePathname();
  // const router = useRouter();
  const { isSignedIn } = useAuth();

  const totalItems = items.length;

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  //     setSearchQuery('');
  //   }
  // };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[95vw] max-w-4xl mx-auto rounded-full bg-background/90 shadow-xl border border-border/40 px-6 py-2 flex items-center justify-between backdrop-blur-lg">
        {/* Logo y navegación principal */}
        <div className="flex items-center gap-8">
          <Logo />
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-base font-normal px-3 py-1 rounded-full transition-colors ${
                isActive('/')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/about"
              className={`text-base font-normal px-3 py-1 rounded-full transition-colors ${
                isActive('/about')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              Sobre nosotros
            </Link>
          </div>
        </div>

        {/* Íconos de acción */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Carrito */}
          <button
            onClick={handleCartClick}
            className="relative p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors shadow-sm"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* Usuario con Clerk */}
          <div className="hidden md:flex items-center">
            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      'ring-2 ring-primary transition-all duration-300 hover:scale-110',
                  },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button
                  className="p-2 rounded-full border border-primary/30 bg-background hover:bg-primary/10 transition-all duration-300 shadow-sm text-muted-foreground hover:text-primary flex items-center justify-center"
                  aria-label="Iniciar sesión"
                >
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.25a7.25 7.25 0 1115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z"
                    />
                  </svg>
                </button>
              </SignInButton>
            )}
          </div>

          {/* Tema */}
          <div className="ml-1">
            <ModeToggle />
          </div>

          {/* Menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Menú móvil flotante */}
      {isMenuOpen && (
        <div className="fixed top-20 left-1/2 z-40 -translate-x-1/2 w-[90vw] max-w-2xl mx-auto rounded-2xl bg-background/95 shadow-2xl border border-border/40 px-6 py-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className={`text-base font-normal px-3 py-2 rounded-full transition-colors ${
                isActive('/')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/about"
              className={`text-base font-normal px-3 py-2 rounded-full transition-colors ${
                isActive('/about')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre nosotros
            </Link>
            {/* Usuario móvil con Clerk */}
            <div className="flex items-center">
              {isSignedIn ? (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:
                        'ring-2 ring-primary transition-all duration-300 hover:scale-110',
                    },
                  }}
                />
              ) : (
                <SignInButton mode="modal">
                  <button
                    className="p-2 rounded-full border border-primary/30 bg-background hover:bg-primary/10 transition-all duration-300 shadow-sm text-muted-foreground hover:text-primary flex items-center justify-center"
                    aria-label="Iniciar sesión"
                  >
                    <svg
                      width="22"
                      height="22"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.25a7.25 7.25 0 1115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z"
                      />
                    </svg>
                  </button>
                </SignInButton>
              )}
            </div>
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handleCartClick}
                className="relative p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors shadow-sm"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
              <div className="ml-1">
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal del Carrito */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
