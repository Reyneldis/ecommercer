'use client';

import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import Logo from '../Logo/Logo';
import { ModeToggle } from '../model-dark';
import { useCart } from '@/hooks/use-cart';
// import { toast } from 'sonner';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import CartModal from '../CartModal';
// Clerk imports
import { UserButton, SignInButton, useAuth } from '@clerk/nextjs';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { items } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const totalItems = items.length;

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo y navegación principal */}
            <div className="flex items-center gap-8">
              <Logo />
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className={`text-base font-normal ${
                    isActive('/')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  } transition-colors`}
                >
                  Inicio
                </Link>
                <Link
                  href="/about"
                  className={`text-base font-normal ${
                    isActive('/about')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  } transition-colors`}
                >
                  Sobre nosotros
                </Link>
              </div>
            </div>

            {/* Búsqueda, carrito y menú */}
            <div className="flex items-center gap-4">
              {/* Búsqueda */}
              <div className="relative hidden md:block">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-56 px-4 py-2 bg-muted/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              </div>

              {/* Carrito */}
              <button
                onClick={handleCartClick}
                className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
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
                className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-6 space-y-6">
              {/* Búsqueda móvil */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full px-4 py-3 bg-muted/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {/* Enlaces móviles */}
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className={`text-base font-normal ${
                    isActive('/')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  } transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href="/about"
                  className={`text-base font-normal ${
                    isActive('/about')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  } transition-colors`}
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
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Modal del Carrito */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
