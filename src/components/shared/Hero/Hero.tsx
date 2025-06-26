/* eslint-disable @next/next/no-img-element */
'use client';

import { getHomeInfo } from '@/lib/get-home';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Star,
  Truck,
  Shield,
  CreditCard,
  Users,
  Package,
  Zap,
} from 'lucide-react';
import { SignInButton, useAuth } from '@clerk/nextjs';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [homeData, setHomeData] = useState({
    title: '',
    descriptionn: '',
    image: '',
  });
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getHomeInfo();
        setHomeData(data);
        setIsLoaded(true);
      } catch {
        // Fallback data
        setHomeData({
          title: 'Tu Tienda Online Premium',
          descriptionn:
            'Descubre productos increíbles con envío rápido y atención personalizada. La mejor experiencia de compra online.',
          image: '/img/hero.webp',
        });
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Elementos decorativos flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary/5 rounded-full blur-lg animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Contenido de texto */}
            <div className="lg:col-span-7 space-y-8">
              <div
                className={`space-y-6 transition-all duration-1000 ${
                  isLoaded
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Badge premium */}
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/20 text-primary text-sm font-medium animate-fade-in">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="animate-pulse">
                    ✨ Nuevo Lanzamiento Premium
                  </span>
                </div>

                {/* Título principal */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground animate-gradient">
                    {homeData.title}
                  </span>
                </h1>

                {/* Descripción */}
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  {homeData.descriptionn}
                </p>

                {/* Stats flotantes */}
                <div className="flex flex-wrap gap-8 py-4">
                  <div className="flex items-center gap-3 bg-background/60 backdrop-blur-sm rounded-full px-4 py-2 border border-border/20">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-lg font-bold text-foreground">
                        10K+
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Clientes Felices
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-background/60 backdrop-blur-sm rounded-full px-4 py-2 border border-border/20">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-lg font-bold text-foreground">
                        500+
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Productos
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-background/60 backdrop-blur-sm rounded-full px-4 py-2 border border-border/20">
                    <Star className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-lg font-bold text-foreground">
                        4.9
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Rating
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Características premium */}
              <div
                className={`flex flex-wrap gap-6 transition-all duration-1000 delay-300 ${
                  isLoaded
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="flex items-center gap-3 bg-background/40 backdrop-blur-sm rounded-full px-4 py-2 border border-border/20 hover:scale-105 transition-all duration-300">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Envío Gratis
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-background/40 backdrop-blur-sm rounded-full px-4 py-2 border border-border/20 hover:scale-105 transition-all duration-300">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Garantía 30 días
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-background/40 backdrop-blur-sm rounded-full px-4 py-2 border border-border/20 hover:scale-105 transition-all duration-300">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Pago Seguro
                  </span>
                </div>
              </div>

              {/* Botones de acción premium */}
              <div
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${
                  isLoaded
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {isSignedIn ? (
                  <Link
                    href="/products"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-foreground bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Comprar Ahora
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-foreground bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 overflow-hidden">
                      <span className="relative z-10 flex items-center gap-2">
                        Comprar
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </SignInButton>
                )}
                <Link
                  href="/about"
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-foreground bg-background/60 backdrop-blur-sm border-2 border-border/40 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-background/80 hover:border-primary/40"
                >
                  <span className="flex items-center gap-2">
                    Ver Catálogo
                    <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Imagen premium */}
            <div
              className={`lg:col-span-5 transition-all duration-1000 delay-700 ${
                isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="relative group">
                {/* Contenedor principal */}
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-3xl"></div>
                  <img
                    src={homeData.image}
                    alt="Hero image"
                    className="relative z-10 object-cover w-full h-full rounded-2xl transform group-hover:scale-105 transition-all duration-700"
                  />

                  {/* Efectos de overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent rounded-2xl"></div>

                  {/* Badge de oferta premium */}
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-full text-sm font-bold shadow-2xl backdrop-blur-sm border border-primary/20 animate-bounce">
                    -30% OFF
                  </div>

                  {/* Elementos decorativos */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 rounded-full blur-sm"></div>
                  <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-secondary/20 rounded-full blur-sm"></div>
                </div>

                {/* Sombra dinámica */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 h-4 bg-primary/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}
