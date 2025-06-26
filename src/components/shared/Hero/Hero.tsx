'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

const HERO_DATA = {
  title: 'Delivery Express',
  description:
    'Tu pedido, en minutos. Rápido, seguro y con atención premium. ¡Haz tu compra y vive la experiencia express!',
  image: '/img/hero2.avif',
};

export default function Hero() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* Columna de texto */}
        <div className="flex flex-col items-start gap-8 animate-fade-in">
          {loading ? (
            <>
              <Skeleton className="h-14 w-3/4 mb-2 rounded-xl" />
              <Skeleton className="h-6 w-2/3 mb-4 rounded-xl" />
              <div className="flex gap-6 mt-8 w-full">
                <Skeleton className="h-12 w-40 rounded-full" />
                <Skeleton className="h-12 w-32 rounded-full" />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground animate-gradient">
                {HERO_DATA.title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed mb-4">
                {HERO_DATA.description}
              </p>
              <div className="flex gap-6 mt-8">
                {/* Botón principal premium: gradiente azul a violeta */}
                <button className="relative px-10 py-4 rounded-full font-bold text-lg text-white bg-gradient-to-r from-[#2563eb] to-[#a21caf] shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none overflow-hidden group">
                  {/* Destello animado */}
                  <span className="absolute left-[-60%] top-0 h-full w-1/2 bg-gradient-to-r from-white/60 to-transparent opacity-0 group-hover:opacity-100 animate-shine-premium rounded-full pointer-events-none" />
                  <span className="relative z-10">¡Pide ahora!</span>
                </button>
              </div>
              {/* Detalles destacados premium */}
              <div className="flex flex-wrap gap-6 mt-8 text-base font-medium text-neutral-700 animate-fade-in-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#2563eb]/20 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#2563eb]/10 cursor-pointer">
                  <span className="text-xl">🚀</span>
                  <span className="text-[#2563eb]">Envío VIP</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#a21caf]/20 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#a21caf]/10 cursor-pointer">
                  <span className="text-xl">👑</span>
                  <span className="text-[#a21caf]">Servicio exclusivo</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary/20 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-primary/10 cursor-pointer">
                  <span className="text-xl">👥</span>
                  <span className="text-primary">+1000 usuarios felices</span>
                </div>
              </div>
            </>
          )}
        </div>
        {/* Columna de imagen */}
        <div className="flex justify-center md:justify-end">
          {loading ? (
            <Skeleton className="w-full max-w-xs aspect-square rounded-2xl" />
          ) : (
            <Image
              src={HERO_DATA.image}
              alt={HERO_DATA.title}
              width={512}
              height={512}
              className="object-cover w-full h-auto rounded-2xl transition-all duration-300 hover:shadow-[0_0_32px_0_rgba(59,130,246,0.35)]"
              priority
            />
          )}
        </div>
      </div>
      {/* Animaciones personalizadas */}
      <style jsx>{`
        .animate-shine-premium {
          animation: shinePremium 1.1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes shinePremium {
          0% {
            left: -60%;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          60% {
            left: 100%;
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
        .animate-fade-in-2 {
          animation: fadeIn 1.8s 0.3s both;
        }
        .animate-float {
          animation: float 2.5s ease-in-out infinite alternate;
        }
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-16px);
          }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
