'use client';
import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import Autoplay from 'embla-carousel-autoplay';

export const dataCarousel = [
  {
    id: 1,
    title: 'Envio en 24/48 horas',
    description: 'Como cliente VIP, tus envios en 24/48 horas',
    link: '#!',
  },
  {
    id: 2,
    title: 'Consigue',
    description: 'Como cliente VIP, tus envios en 24/48 horas',
    link: '#!',
  },
  {
    id: 3,
    title: 'Envio en 24/48 horas',
    description: 'Como cliente VIP, tus envios en 24/48 horas',
    link: '#!',
  },
  {
    id: 4,
    title: 'Envio en 24/48 horas',
    description: 'Como cliente VIP, tus envios en 24/48 horas',
    link: '#!',
  },
  {
    id: 5,
    title: 'Envio en 24/48 horas',
    description: 'Como cliente VIP, tus envios en 24/48 horas',
    link: '#!',
  },
];

export default function carouselTextBanner() {
  return (
    <div>
      <div className=" bg-gray-100 dark:bg-blue-300 mt-28 mb-2.5 p-5 ">
        <Carousel
          className="w-full max-w-4xl mx-auto mt-4"
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
        >
          <CarouselContent>
            {dataCarousel.map(({ id, title, description, link }) => (
              <CarouselItem key={id}>
                <Link href={link}>
                  <div>
                    <Card className="shadow-none bg-transparent border-none">
                      <CardContent className="flex  flex-col justify-center items-center p-2 text-center">
                        <p className="sm:text-2xl text-wrap dark:text-secondary">
                          {title}
                        </p>
                        <p className="text-xs sm:text-sm text-wrap dark:text-secondary">
                          {description}
                        </p>
                      </CardContent>
                      {/* <CardContent>{description}</CardContent> */}
                    </Card>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
