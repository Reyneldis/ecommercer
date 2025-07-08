'use client';

import {
  ShoppingCart,
  Menu,
  X,
  User,
  Shield,
  Package,
  CreditCard,
  Info,
} from 'lucide-react';
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
import { useAdmin } from '@/hooks/use-admin';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { items } = useCart();
  const pathname = usePathname();

  const { isSignedIn, isLoaded } = useAuth();
  const { isAdmin } = useAdmin();

  const totalItems = items.length;

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[95vw] max-w-4xl mx-auto rounded-full bg-background/50 shadow-xl border border-border/40 px-6 py-2 flex items-center justify-between backdrop-blur-lg">
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
          <div className="hidden md:flex items-center gap-2">
            {isLoaded && isSignedIn ? (
              <>
                <Link
                  href="/account"
                  className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors shadow-sm"
                  title="Mi cuenta"
                >
                  <User className="h-5 w-5" />
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      href="/admin"
                      className="p-2 rounded-full bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors shadow-sm"
                      title="Panel de Administración"
                    >
                      <Shield className="h-5 w-5" />
                    </Link>
                    <Link
                      href="/admin/products"
                      className="p-2 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors shadow-sm"
                      title="Gestión de Productos"
                    >
                      <Package className="h-5 w-5" />
                    </Link>
                    <Link
                      href="/admin/payments"
                      className="p-2 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors shadow-sm"
                      title="Dashboard de Pagos"
                    >
                      <CreditCard className="h-5 w-5" />
                    </Link>
                  </>
                )}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:
                        'ring-2 ring-primary transition-all duration-300 hover:scale-110',
                    },
                  }}
                />
              </>
            ) : isLoaded ? (
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
            ) : null}
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

      {/* Menú móvil flotante premium */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-gradient-to-br from-primary/80 via-background/80 to-secondary/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-xs mt-24 mx-4 rounded-3xl shadow-2xl border border-border/40 bg-background/90 p-8 flex flex-col gap-6 animate-slide-in">
            {/* Botón cerrar */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white shadow-lg transition-all text-2xl"
              aria-label="Cerrar menú"
            >
              <X className="h-7 w-7" />
            </button>
            {/* Opciones de navegación */}
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/"
                className={`flex items-center gap-3 text-lg font-semibold px-4 py-3 rounded-xl transition-all ${
                  isActive('/')
                    ? 'bg-primary/10 text-primary shadow-md'
                    : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="bg-primary/10 p-2 rounded-full">
                  <Menu className="h-6 w-6" />
                </span>
                Inicio
              </Link>
              <Link
                href="/about"
                className={`flex items-center gap-3 text-lg font-semibold px-4 py-3 rounded-xl transition-all ${
                  isActive('/about')
                    ? 'bg-primary/10 text-primary shadow-md'
                    : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="bg-secondary/10 p-2 rounded-full">
                  <Info className="h-6 w-6" />
                </span>
                Sobre nosotros
              </Link>
              {/* Usuario y admin */}
              {isLoaded && isSignedIn && (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 text-lg font-semibold px-4 py-3 rounded-xl transition-all text-primary hover:bg-primary/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="bg-primary/10 p-2 rounded-full">
                      <User className="h-6 w-6" />
                    </span>
                    Mi cuenta
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 text-lg font-semibold px-4 py-3 rounded-xl transition-all text-orange-500 hover:bg-orange-100/40"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="bg-orange-100/40 p-2 rounded-full">
                          <Shield className="h-6 w-6" />
                        </span>
                        Panel Admin
                      </Link>
                      <Link
                        href="/admin/products"
                        className="flex items-center gap-3 text-lg font-semibold px-4 py-3 rounded-xl transition-all text-blue-500 hover:bg-blue-100/40"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="bg-blue-100/40 p-2 rounded-full">
                          <Package className="h-6 w-6" />
                        </span>
                        Productos
                      </Link>
                      <Link
                        href="/admin/payments"
                        className="flex items-center gap-3 text-lg font-semibold px-4 py-3 rounded-xl transition-all text-green-500 hover:bg-green-100/40"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="bg-green-100/40 p-2 rounded-full">
                          <CreditCard className="h-6 w-6" />
                        </span>
                        Pagos
                      </Link>
                    </>
                  )}
                </>
              )}
              {/* Login/Logout */}
              <div className="mt-4 flex flex-col gap-2">
                {isLoaded && !isSignedIn && (
                  <SignInButton mode="modal">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white font-semibold shadow-md hover:bg-primary/90 transition-all">
                      <User className="h-6 w-6" />
                      Iniciar sesión
                    </button>
                  </SignInButton>
                )}
                {isLoaded && isSignedIn && (
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox:
                          'ring-2 ring-primary transition-all duration-300 hover:scale-110',
                      },
                    }}
                  />
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Modal del Carrito */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
