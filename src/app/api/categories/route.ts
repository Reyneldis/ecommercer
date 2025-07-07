import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-guard';

// GET /api/categories - Obtener todas las categorías
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Error al obtener las categorías' },
      { status: 500 },
    );
  }
}

// POST /api/categories - Crear una nueva categoría (solo admin)
export async function POST(request: NextRequest) {
  try {
    await requireRole(['ADMIN']);
    const body = await request.json();
    const { categoryName, slug, mainImage, description } = body;

    // Validaciones básicas
    if (!categoryName || !slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son requeridos' },
        { status: 400 },
      );
    }

    // Verificar si el slug ya existe
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con este slug' },
        { status: 400 },
      );
    }

    const category = await prisma.category.create({
      data: {
        categoryName,
        slug,
        mainImage,
        description,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Error al crear la categoría' },
      { status: 500 },
    );
  }
}
