/* eslint-disable @next/next/no-img-element */
import { getHomeInfo } from '@/lib/get-home';
import Link from 'next/link';
import React from 'react';

export default async function Hero() {
  const { title, descriptionn, image } = await getHomeInfo();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Fondo con gradiente y elementos decorativos */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/5"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Contenido de texto */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Nuevo Lanzamiento
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                    {title}
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {descriptionn}
                </p>
              </div>

              {/* Características principales */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-muted-foreground">
                    Envío Gratis
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-muted-foreground">
                    Garantía 30 días
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-muted-foreground">
                    Pago Seguro
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-foreground bg-primary rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                >
                  Comprar Ahora
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-foreground border-2 border-border rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-secondary/50"
                >
                  Ver Catálogo
                </Link>
              </div>
            </div>

            {/* Imagen */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                <img
                  src={image}
                  alt="Hero image"
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                />
                {/* Efecto de gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>

                {/* Badge de oferta */}
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  -30% OFF
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
