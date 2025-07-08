import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-guard';
import { productSchema } from '@/schemas/productSchema';

// GET /api/admin/products - Obtener todos los productos para el admin
export async function GET() {
  try {
    // Proteger endpoint: solo ADMIN
    await requireRole(['ADMIN']);

    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            categoryName: true,
            slug: true,
          },
        },
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        variants: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transformar datos para el frontend admin
    const transformedProducts = products.map(product => ({
      id: product.id,
      slug: product.slug,
      productName: product.productName,
      name: product.productName, // Para compatibilidad con el admin
      price: Number(product.price),
      description: product.description || '',
      category: product.category.categoryName,
      categoryId: product.categoryId,
      image:
        product.images.find(img => img.isPrimary)?.url ||
        product.images[0]?.url ||
        '/img/placeholder-product.jpg',
      images: product.images.map(img => img.url),
      stock: product.variants.reduce(
        (total, variant) => total + variant.stock,
        0,
      ),
      rating: 4.5, // Placeholder - se puede calcular de las reviews
      reviews: product._count.reviews,
      status: 'active', // Placeholder - se puede agregar campo status al modelo
      featured: false, // Placeholder - se puede agregar campo featured al modelo
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      features: (product.features as string[]) || [],
      variants: product.variants.map(variant => ({
        id: variant.id,
        name: variant.name,
        price: Number(variant.price),
        stock: variant.stock,
        attributes: variant.attributes as Record<string, any>,
      })),
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 },
    );
  }
}

type VariantInput = {
  name: string;
  price: number;
  stock?: number;
  attributes?: Record<string, unknown>;
};
type ImageInput = {
  url: string;
  alt?: string;
  sortOrder?: number;
  isPrimary?: boolean;
};

// POST /api/admin/products - Crear nuevo producto
export async function POST(request: Request) {
  try {
    await requireRole(['ADMIN']);
    const body = await request.json();
    // Validar con Zod
    const result = productSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten() },
        { status: 400 },
      );
    }
    const {
      productName,
      slug,
      price,
      description,
      categoryId,
      features,
      variants,
      images,
    } = result.data;
    // Verificar que el slug sea único
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Ya existe un producto con este slug' },
        { status: 400 },
      );
    }
    // Crear el producto
    const product = await prisma.product.create({
      data: {
        slug,
        productName,
        price,
        description,
        categoryId,
        features: features || [],
        variants: {
          create:
            (variants as VariantInput[] | undefined)?.map(variant => ({
              name: variant.name,
              price: variant.price,
              stock: variant.stock || 0,
              attributes: variant.attributes || {},
            })) || [],
        },
        images: {
          create:
            (images as ImageInput[] | undefined)?.map((image, index) => ({
              url: image.url,
              alt: image.alt || productName,
              sortOrder: image.sortOrder ?? index,
              isPrimary: image.isPrimary ?? index === 0,
            })) || [],
        },
      },
      include: {
        category: {
          select: {
            categoryName: true,
          },
        },
        images: true,
        variants: true,
      },
    });
    // Transformar respuesta para el frontend
    const transformedProduct = {
      id: product.id,
      slug: product.slug,
      productName: product.productName,
      name: product.productName,
      price: Number(product.price),
      description: product.description || '',
      category: product.category.categoryName,
      categoryId: product.categoryId,
      image:
        product.images.find(img => img.isPrimary)?.url ||
        product.images[0]?.url ||
        '/img/placeholder-product.jpg',
      images: product.images.map(img => img.url),
      stock: product.variants.reduce(
        (total, variant) => total + variant.stock,
        0,
      ),
      rating: 4.5,
      reviews: 0,
      status: 'active',
      featured: false,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      features: (product.features as string[]) || [],
      variants: product.variants.map(variant => ({
        id: variant.id,
        name: variant.name,
        price: Number(variant.price),
        stock: variant.stock,
        attributes: variant.attributes as Record<string, unknown>,
      })),
    };
    return NextResponse.json(transformedProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 },
    );
  }
}
