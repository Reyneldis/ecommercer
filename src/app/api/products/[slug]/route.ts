import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
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
