import CarouselTextBanner from '@/components/shared/carousel-text-banner';
import Categories from '@/components/shared/categories';
import Hero from '@/components/shared/Hero/Hero';

import React from 'react';

export default function Home() {
  return (
    <main>
      <CarouselTextBanner />
      <div className="grid place-content-center items-center mx-auto max-w-5xl">
        <Hero />
        <Categories />
      </div>
    </main>
  );
}
