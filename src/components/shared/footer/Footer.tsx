'use client';

import Link from 'next/link';
import { Instagram, Twitter, Facebook, Heart } from 'lucide-react';
import Logo from '../Logo/Logo';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        {/* Contenido principal */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Logo y descripción */}
          <div className="space-y-3">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Tu tienda online de confianza con productos de calidad.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Enlaces</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Sobre Nosotros
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Síguenos</h3>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="my-6 border-t border-border/40" />

        {/* Footer inferior */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2025 Delivery Express. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Hecho con</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>en Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
