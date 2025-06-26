'use client';
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi,
} from '../ui/carousel';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import Autoplay from 'embla-carousel-autoplay';

export const dataCarousel = [
  {
    id: 1,
    title: '🚚 Envío en 24/48 horas',
    description: 'Como cliente VIP, tus envíos llegan rapidísimo',
    link: '#!',
  },
  {
    id: 2,
    title: '🎁 Promos exclusivas',
    description: 'Descuentos y sorpresas solo para miembros',
    link: '#!',
  },
  {
    id: 3,
    title: '🛡️ Compra segura',
    description: 'Tus datos y pagos están protegidos',
    link: '#!',
  },
  {
    id: 4,
    title: '⭐ Novedades semanales',
    description: '¡Siempre hay algo nuevo para ti!',
    link: '#!',
  },
  {
    id: 5,
    title: '💬 Soporte 24/7',
    description: 'Estamos para ayudarte en todo momento',
    link: '#!',
  },
];

export default function CarouselTextBanner() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const total = dataCarousel.length;

  useEffect(() => {
    if (!api) return;
    api.on('select', () => {
      setSelectedIndex(api.selectedScrollSnap());
    });
    setSelectedIndex(api.selectedScrollSnap());
  }, [api]);

  return (
    <div className="w-full flex flex-col items-center justify-center mt-32 mb-4">
      <Carousel
        className="w-full max-w-2xl"
        plugins={[
          Autoplay({
            delay: 3500,
          }),
        ]}
        setApi={setApi}
      >
        <CarouselContent>
          {dataCarousel.map(({ id, title, description, link }) => (
            <CarouselItem key={id}>
              <Link href={link} className="flex justify-center">
                <Card
                  className="w-full max-w-xl h-28 flex items-center justify-center rounded-2xl bg-white/90 dark:bg-background/80 shadow-md border border-border/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg cursor-pointer"
                  style={{ minWidth: 0 }}
                >
                  <CardContent className="flex flex-col justify-center items-center p-0 w-full h-full text-center">
                    <p className="text-xl sm:text-2xl font-semibold text-foreground mb-1 w-full truncate">
                      {title}
                    </p>
                    <p className="text-sm sm:text-base text-muted-foreground w-full truncate">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Botones de desplazamiento minimalistas debajo */}
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static relative !top-0 !left-0 !translate-x-0 !translate-y-0 bg-transparent text-primary hover:bg-primary/10 hover:text-primary rounded-full border-none shadow-none size-8" />
          <CarouselNext className="static relative !top-0 !right-0 !translate-x-0 !translate-y-0 bg-transparent text-primary hover:bg-primary/10 hover:text-primary rounded-full border-none shadow-none size-8" />
        </div>
        {/* Dots minimalistas */}
        <div className="flex justify-center gap-1 mt-2">
          {Array.from({ length: total }).map((_, idx) => (
            <button
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border ${
                selectedIndex === idx
                  ? 'bg-primary border-primary scale-110'
                  : 'bg-muted border-border/30'
              }`}
              onClick={() => api && api.scrollTo(idx)}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
