import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-guard';

// PUT /api/admin/products/[id] - Actualizar producto
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Proteger endpoint: solo ADMIN
    await requireRole(['ADMIN']);

    const { id } = params;
    const body = await request.json();
    const {
      productName,
      slug,
      price,
      description,
      categoryId,
      features,
      variants,
      images,
    } = body;

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        images: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }

    // Verificar que el slug sea único (si cambió)
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Ya existe un producto con este slug' },
          { status: 400 },
        );
      }
    }

    // Actualizar el producto
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        slug: slug || existingProduct.slug,
        productName: productName || existingProduct.productName,
        price: price || existingProduct.price,
        description: description || existingProduct.description,
        categoryId: categoryId || existingProduct.categoryId,
        features: features || existingProduct.features,
        // Actualizar variantes si se proporcionan
        variants: variants
          ? {
              deleteMany: {},
              create: variants.map((variant: any) => ({
                name: variant.name,
                price: variant.price,
                stock: variant.stock || 0,
                attributes: variant.attributes || {},
              })),
            }
          : undefined,
        // Actualizar imágenes si se proporcionan
        images: images
          ? {
              deleteMany: {},
              create: images.map((image: any, index: number) => ({
                url: image.url,
                alt: image.alt || productName || existingProduct.productName,
                sortOrder: image.sortOrder || index,
                isPrimary: image.isPrimary || index === 0,
              })),
            }
          : undefined,
      },
      include: {
        category: {
          select: {
            categoryName: true,
          },
        },
        images: true,
        variants: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    // Transformar respuesta para el frontend
    const transformedProduct = {
      id: updatedProduct.id,
      slug: updatedProduct.slug,
      productName: updatedProduct.productName,
      name: updatedProduct.productName,
      price: Number(updatedProduct.price),
      description: updatedProduct.description || '',
      category: updatedProduct.category.categoryName,
      categoryId: updatedProduct.categoryId,
      image:
        updatedProduct.images.find(img => img.isPrimary)?.url ||
        updatedProduct.images[0]?.url ||
        '/img/placeholder-product.jpg',
      images: updatedProduct.images.map(img => img.url),
      stock: updatedProduct.variants.reduce(
        (total, variant) => total + variant.stock,
        0,
      ),
      rating: 4.5,
      reviews: updatedProduct._count.reviews,
      status: 'active',
      featured: false,
      createdAt: updatedProduct.createdAt.toISOString(),
      updatedAt: updatedProduct.updatedAt.toISOString(),
      features: (updatedProduct.features as string[]) || [],
      variants: updatedProduct.variants.map(variant => ({
        id: variant.id,
        name: variant.name,
        price: Number(variant.price),
        stock: variant.stock,
        attributes: variant.attributes as Record<string, any>,
      })),
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/products/[id] - Eliminar producto
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Proteger endpoint: solo ADMIN
    await requireRole(['ADMIN']);

    const { id } = params;

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }

    // Eliminar el producto (esto también eliminará variantes e imágenes por CASCADE)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Producto eliminado correctamente' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 },
    );
  }
}
