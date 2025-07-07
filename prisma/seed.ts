import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear categorías
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        categoryName: 'Electrodomésticos',
        slug: 'electrodomesticos',
        mainImage:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        description: 'Los mejores electrodomésticos para tu hogar',
      },
    }),
    prisma.category.create({
      data: {
        categoryName: 'Aseos',
        slug: 'aseos',
        mainImage: '/img/aseo.webp',
        description: 'Productos de limpieza y aseo personal',
      },
    }),
    prisma.category.create({
      data: {
        categoryName: 'Comida',
        slug: 'comida',
        mainImage: '/img/comida.webp',
        description: 'Alimentos frescos y productos gourmet',
      },
    }),
  ]);

  console.log('✅ Categorías creadas:', categories.length);

  // Crear productos
  const products = await Promise.all([
    // Electrodomésticos
    prisma.product.create({
      data: {
        slug: 'refrigerador-samsung-french-door',
        productName: 'Refrigerador Samsung French Door',
        price: 1299.99,
        description:
          'Refrigerador de alta eficiencia con tecnología Twin Cooling Plus',
        categoryId: categories[0].id,
        features: [
          'Capacidad de 28 pies cúbicos',
          'Tecnología Twin Cooling Plus',
          'Dispensador de agua y hielo',
          'Pantalla táctil LED',
          'Energía eficiente A+++',
        ],
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500',
              alt: 'Refrigerador Samsung',
              sortOrder: 0,
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: [
            {
              name: 'Stainless Steel',
              price: 1299.99,
              stock: 15,
              attributes: { color: 'Stainless Steel', capacity: '28 cu ft' },
            },
            {
              name: 'Black Stainless Steel',
              price: 1399.99,
              stock: 10,
              attributes: {
                color: 'Black Stainless Steel',
                capacity: '28 cu ft',
              },
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        slug: 'lavadora-lg-front-load',
        productName: 'Lavadora LG Front Load',
        price: 799.99,
        description:
          'Lavadora de carga frontal con tecnología Steam y 6 Motion',
        categoryId: categories[0].id,
        features: [
          'Capacidad de 4.5 pies cúbicos',
          'Tecnología Steam',
          '6 Motion Direct Drive',
          'Smart Diagnosis',
          'Energía eficiente',
        ],
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500',
              alt: 'Lavadora LG',
              sortOrder: 0,
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: [
            {
              name: 'Blanco',
              price: 799.99,
              stock: 25,
              attributes: { color: 'Blanco', capacity: '4.5 cu ft' },
            },
            {
              name: 'Gris',
              price: 849.99,
              stock: 20,
              attributes: { color: 'Gris', capacity: '4.5 cu ft' },
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        slug: 'microondas-panasonic-inverter',
        productName: 'Microondas Panasonic Inverter',
        price: 199.99,
        description: 'Microondas con tecnología Inverter para cocción uniforme',
        categoryId: categories[0].id,
        features: [
          'Tecnología Inverter',
          '1200W de potencia',
          '1.2 pies cúbicos de capacidad',
          'Sensor de humedad',
          '10 niveles de potencia',
        ],
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1506368083636-6defb67639c5?w=500',
              alt: 'Microondas Panasonic',
              sortOrder: 0,
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: [
            {
              name: 'Negro',
              price: 199.99,
              stock: 50,
              attributes: { color: 'Negro', power: '1200W' },
            },
            {
              name: 'Stainless Steel',
              price: 229.99,
              stock: 30,
              attributes: { color: 'Stainless Steel', power: '1200W' },
            },
          ],
        },
      },
    }),
    // Aseos
    prisma.product.create({
      data: {
        slug: 'jabon-liquido-antibacterial',
        productName: 'Jabón Líquido Antibacterial',
        price: 8.99,
        description: 'Jabón líquido antibacterial con aloe vera y vitamina E',
        categoryId: categories[1].id,
        features: [
          'Antibacterial efectivo',
          'Aloe vera hidratante',
          'Vitamina E',
          'Fragancia suave',
          '500ml de producto',
        ],
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1588776814546-ec7e8c1b5b6b?w=500',
              alt: 'Jabón Líquido',
              sortOrder: 0,
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: [
            {
              name: 'Lavanda',
              price: 8.99,
              stock: 200,
              attributes: { fragrance: 'Lavanda', size: '500ml' },
            },
            {
              name: 'Manzanilla',
              price: 8.99,
              stock: 180,
              attributes: { fragrance: 'Manzanilla', size: '500ml' },
            },
            {
              name: 'Eucalipto',
              price: 9.99,
              stock: 150,
              attributes: { fragrance: 'Eucalipto', size: '500ml' },
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        slug: 'cepillo-dientes-electrico-oral-b',
        productName: 'Cepillo de Dientes Eléctrico Oral-B',
        price: 89.99,
        description:
          'Cepillo de dientes eléctrico con tecnología 3D y sensor de presión',
        categoryId: categories[1].id,
        features: [
          'Tecnología 3D Clean',
          'Sensor de presión',
          'Modo de limpieza diaria',
          'Modo sensible',
          'Cabeza de repuesto incluida',
        ],
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1559591935-c6c92c6d3b8c?w=500',
              alt: 'Cepillo Eléctrico',
              sortOrder: 0,
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: [
            {
              name: 'Blanco',
              price: 89.99,
              stock: 75,
              attributes: { color: 'Blanco', model: 'Pro 1000' },
            },
            {
              name: 'Negro',
              price: 89.99,
              stock: 60,
              attributes: { color: 'Negro', model: 'Pro 1000' },
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        slug: 'papel-higienico-premium',
        productName: 'Papel Higiénico Premium',
        price: 5.99,
        description: 'Papel higiénico de triple hoja, extra suave y absorbente',
        categoryId: categories[1].id,
        features: [
          'Triple hoja',
          'Extra suave',
          'Alta absorción',
          'Paquete de 12 rollos',
          'Ecológico',
        ],
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1588776814546-ec7e8c1b5b6b?w=500',
              alt: 'Papel Higiénico',
              sortOrder: 0,
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: [
            {
              name: 'Blanco - 12 rollos',
              price: 12.99,
              stock: 300,
              attributes: { color: 'Blanco', quantity: '12 rollos' },
            },
            {
              name: 'Blanco - 24 rollos',
              price: 22.99,
              stock: 200,
              attributes: { color: 'Blanco', quantity: '24 rollos' },
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        slug: 'desinfectante-multiusos',
        productName: 'Desinfectante Multiusos',
        price: 12.99,
        description: 'Desinfectante multiusos para superficies y ambientes',
        categoryId: categories[1].id,
        features: [
          'Elimina 99.9% de bacterias',
          'Aroma fresco',
          'Fácil de usar',
          'Botella de 1L',
          'Apto para todo tipo de superficies',
        ],
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500',
              alt: 'Desinfectante Multiusos',
              sortOrder: 0,
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: [
            {
              name: 'Desinfectante Multiusos',
              price: 12.99,
              stock: 100,
              attributes: { type: 'Multiusos', size: '1L' },
            },
          ],
        },
      },
    }),
    // Comida
    prisma.product.create({
      data: {
        slug: 'cafe-gourmet-colombiano',
        productName: 'Café Gourmet Colombiano',
        price: 24.99,
        description: 'Café 100% arábica de las montañas de Colombia',
        categoryId: categories[2].id,
        features: [
          '100% arábica colombiana',
          'Tostado medio',
          'Notas de chocolate y caramelo',
          '1kg de granos enteros',
          'Certificado orgánico',
        ],
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500',
              alt: 'Café Colombiano',
              sortOrder: 0,
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: [
            {
              name: 'Tostado Medio',
              price: 24.99,
              stock: 100,
              attributes: { roast: 'Medio', weight: '1kg' },
            },
            {
              name: 'Tostado Oscuro',
              price: 24.99,
              stock: 80,
              attributes: { roast: 'Oscuro', weight: '1kg' },
            },
            {
              name: 'Tostado Claro',
              price: 24.99,
              stock: 60,
              attributes: { roast: 'Claro', weight: '1kg' },
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        slug: 'chocolate-artesanal-belga',
        productName: 'Chocolate Artesanal Belga',
        price: 18.99,
        description: 'Chocolate belga premium con 70% de cacao',
        categoryId: categories[2].id,
        features: [
          '70% cacao belga',
          'Sin azúcares añadidos',
          'Ingredientes orgánicos',
          '200g de chocolate',
          'Sabor intenso y suave',
        ],
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500',
              alt: 'Chocolate Belga',
              sortOrder: 0,
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: [
            {
              name: '70% Cacao',
              price: 18.99,
              stock: 150,
              attributes: { cocoa: '70%', weight: '200g' },
            },
            {
              name: '85% Cacao',
              price: 19.99,
              stock: 120,
              attributes: { cocoa: '85%', weight: '200g' },
            },
            {
              name: 'Con Almendras',
              price: 21.99,
              stock: 100,
              attributes: { cocoa: '70%', nuts: 'Almendras', weight: '200g' },
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        slug: 'miel-organica-pura',
        productName: 'Miel Orgánica Pura',
        price: 15.99,
        description: 'Miel 100% natural y orgánica de abejas locales',
        categoryId: categories[2].id,
        features: [
          '100% natural y orgánica',
          'Sin pasteurizar',
          'Rica en antioxidantes',
          '500ml de miel pura',
          'Sabor intenso y dulce',
        ],
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
              alt: 'Miel Orgánica',
              sortOrder: 0,
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: [
            {
              name: 'Miel de Flores',
              price: 15.99,
              stock: 80,
              attributes: { type: 'Flores', size: '500ml' },
            },
            {
              name: 'Miel de Eucalipto',
              price: 17.99,
              stock: 60,
              attributes: { type: 'Eucalipto', size: '500ml' },
            },
            {
              name: 'Miel de Manuka',
              price: 29.99,
              stock: 40,
              attributes: { type: 'Manuka', size: '500ml' },
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        slug: 'combo-frutas-frescas',
        productName: 'Combo de Frutas Frescas',
        price: 19.99,
        description: 'Selección de frutas frescas de temporada',
        categoryId: categories[2].id,
        features: [
          'Frutas variadas',
          'Frescura garantizada',
          'Envío rápido',
          'Ideal para snacks',
          'Rico en vitaminas',
        ],
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=500',
              alt: 'Combo de Frutas',
              sortOrder: 0,
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: [
            {
              name: 'Combo de Frutas',
              price: 19.99,
              stock: 100,
              attributes: { type: 'Frutas', size: 'Combo' },
            },
          ],
        },
      },
    }),
  ]);

  console.log('✅ Productos creados:', products.length);

  // Obtener productos con sus variantes para usar en las órdenes
  const productsWithVariants = await Promise.all(
    products.map(product =>
      prisma.product.findUnique({
        where: { id: product.id },
        include: { variants: true },
      }),
    ),
  );

  // Crear usuarios de ejemplo
  const users = await Promise.all([
    prisma.user.create({
      data: {
        clerkId: 'user_2example1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      },
    }),
    prisma.user.create({
      data: {
        clerkId: 'user_2example2',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
    }),
    prisma.user.create({
      data: {
        clerkId: 'user_2example3',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'USER',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      },
    }),
  ]);

  console.log('✅ Usuarios creados:', users.length);

  // Crear algunas órdenes de ejemplo
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-001',
        userId: users[1].id,
        status: 'CONFIRMED',
        customerEmail: 'john@example.com',
        customerName: 'John Doe',
        subtotal: 1299.99,
        taxAmount: 130.0,
        shippingAmount: 29.99,
        total: 1459.98,
        paymentStatus: 'PAID',
        paymentMethod: 'CREDIT_CARD',
        items: {
          create: [
            {
              productId: productsWithVariants[0]!.id, // Refrigerador Samsung
              variantId: productsWithVariants[0]!.variants[0].id,
              productName: 'Refrigerador Samsung French Door',
              productSku: 'SAMSUNG-FRIDGE-28',
              variantName: 'Stainless Steel',
              price: 1299.99,
              quantity: 1,
              total: 1299.99,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-002',
        userId: users[2].id,
        status: 'PROCESSING',
        customerEmail: 'jane@example.com',
        customerName: 'Jane Smith',
        subtotal: 89.99,
        taxAmount: 9.0,
        shippingAmount: 9.99,
        total: 108.98,
        paymentStatus: 'PAID',
        paymentMethod: 'PAYPAL',
        items: {
          create: [
            {
              productId: productsWithVariants[4]!.id, // Cepillo eléctrico
              variantId: productsWithVariants[4]!.variants[0].id,
              productName: 'Cepillo de Dientes Eléctrico Oral-B',
              productSku: 'ORALB-PRO1000-WHITE',
              variantName: 'Blanco',
              price: 89.99,
              quantity: 1,
              total: 89.99,
            },
          ],
        },
      },
    }),
  ]);

  console.log('✅ Órdenes creadas:', orders.length);

  // Crear algunas reseñas
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        userId: users[1].id,
        productId: productsWithVariants[0]!.id,
        rating: 5,
        title: 'Excelente refrigerador',
        comment: 'Muy eficiente y espacioso, perfecto para mi familia',
        isVerified: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: users[2].id,
        productId: productsWithVariants[4]!.id,
        rating: 4,
        title: 'Buen cepillo eléctrico',
        comment: 'Limpia muy bien y la batería dura mucho',
        isVerified: true,
      },
    }),
  ]);

  console.log('✅ Reseñas creadas:', reviews.length);

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch(e => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
