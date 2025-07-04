// src/lib/data.ts
export const categories = [
  {
    categoryName: 'Electródomesticos',
    slug: 'electrodomesticos',
    mainImage: '/img/hero.webp',
    description: ' Productos electrónicos.',
  },
  {
    categoryName: 'Comida',
    slug: 'comida',
    mainImage: '/img/combo-comida.webp',
    description: 'Comdia',
  },
  {
    categoryName: 'Aseos',
    slug: 'aseo',
    mainImage: '/img/aseo.webp',
    description: 'Todo para tu casa y familia.',
  },
  // ...agrega más categorías si quieres
];

export const products = [
  {
    slug: 'laptop-dell-xps',
    productName: 'Laptop Dell XPS 13',
    price: 1200,
    images: ['/img/arrocera-negra.webp', '/img/arrocera-negra.webp'],
    description:
      'Potente laptop ultraligera con pantalla InfinityEdge y procesador Intel de última generación.',
    category: 'electrodomesticos',
    features: [
      'Pantalla 13.3" Full HD',
      'Procesador Intel i7',
      '16GB RAM',
      '512GB SSD',
    ],
    variants: [
      { color: 'Plata', stock: 5 },
      { color: 'Negro', stock: 2 },
    ],
  },
  {
    slug: 'camiseta-blanca-basica',
    productName: 'Camiseta Blanca Básica',
    price: 15,
    images: ['/img/friadora.webp'],
    description:
      'Camiseta de algodón 100% suave y cómoda, ideal para cualquier ocasión.',
    category: 'electrodomesticos',
  },
  {
    slug: 'sofa-moderno-gris',
    productName: 'Sofá Moderno Gris',
    price: 850,
    images: ['/img/lavadora-2.webp'],
    description:
      'Sofá de diseño contemporáneo, tapizado en tela gris resistente y fácil de limpiar.',
    category: 'electrodomesticos',
  },
  {
    slug: 'arrocera-negra',
    productName: 'Arrocera Negra',
    price: 60,
    images: ['/img/arrocera-negra.webp'],
    description:
      'Arrocera eléctrica de gran capacidad, ideal para familias grandes.',
    category: 'electrodomesticos',
  },
  {
    slug: 'cafetera-electrica',
    productName: 'Cafetera Eléctrica',
    price: 45,
    images: ['/img/cafetera-electrica.webp'],
    description: 'Cafetera eléctrica programable con jarra de vidrio.',
    category: 'electrodomesticos',
  },
  {
    slug: 'paquete-pollo',
    productName: 'Paquete de Pollo',
    price: 20,
    images: ['/img/paquete_pollo.webp'],
    description: 'Paquete de pollo fresco, ideal para tus comidas diarias.',
    category: 'comida',
  },
  {
    slug: 'bombillo-led',
    productName: 'Bombillo LED',
    price: 5,
    images: ['/img/bombillo.webp'],
    description: 'Bombillo LED de bajo consumo, luz blanca.',
    category: 'electrodomesticos',
  },
  {
    slug: 'aseo-multiusos',
    productName: 'Aseo Multiusos',
    price: 8,
    images: ['/img/aseo.webp'],
    description: 'Producto de limpieza multiusos para el hogar.',
    category: 'aseo',
  },
];
