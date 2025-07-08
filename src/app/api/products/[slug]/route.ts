import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-guard';
import { productSchema } from '@/schemas/productSchema';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      category: true,
      variants: true,
    },
  });

  if (!product) {
    return NextResponse.json(
      { error: 'Producto no encontrado' },
      { status: 404 },
    );
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    await requireRole(['ADMIN']);
    const { slug } = params;
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
      price,
      description,
      categoryId,
      features,
      variants,
      images,
      status,
    } = result.data;
    // Verificar si el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
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
    // Actualizar el producto y sus relaciones
    const updatedProduct = await prisma.product.update({
      where: { slug },
      data: {
        productName,
        price,
        description,
        categoryId,
        features,
        status,
        // Actualizar variantes e imágenes: eliminar y volver a crear (simplificado)
        variants: {
          deleteMany: {},
          create: variants || [],
        },
        images: {
          deleteMany: {},
          create: images || [],
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 },
    );
  }
}
