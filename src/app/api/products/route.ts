import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-guard';
import { productSchema } from '@/schemas/productSchema';

// GET /api/products - Obtener productos con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Record<string, unknown> = {};

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Obtener productos con paginación
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
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
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error al obtener los productos' },
      { status: 500 },
    );
  }
}

// POST /api/products - Crear un nuevo producto (solo admin)
export async function POST(request: NextRequest) {
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
      slug,
      productName,
      price,
      description,
      categoryId,
      features,
      variants,
      images,
      status,
    } = result.data;
    // Verificar si el slug ya existe
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Ya existe un producto con este slug' },
        { status: 400 },
      );
    }
    // Verificar si la categoría existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: 'La categoría especificada no existe' },
        { status: 400 },
      );
    }
    // Crear el producto con sus variantes e imágenes
    const product = await prisma.product.create({
      data: {
        slug,
        productName,
        price,
        description,
        categoryId,
        features,
        status,
        variants: {
          create: variants || [],
        },
        images: {
          create: images || [],
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 },
    );
  }
}
