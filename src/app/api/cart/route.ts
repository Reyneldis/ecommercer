import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/cart - Obtener items del carrito de un usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 },
      );
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            category: true,
          },
        },
        variant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calcular total del carrito
    const total = cartItems.reduce((sum, item) => {
      const price = item.variant ? item.variant.price : item.product.price;
      return sum + price * item.quantity;
    }, 0);

    return NextResponse.json({
      items: cartItems,
      total: total,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Error al obtener el carrito' },
      { status: 500 },
    );
  }
}

// POST /api/cart - Agregar item al carrito
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, variantId, quantity = 1 } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'Usuario y producto son requeridos' },
        { status: 400 },
      );
    }

    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }

    // Si se especifica una variante, verificar que existe
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });

      if (!variant) {
        return NextResponse.json(
          { error: 'Variante no encontrada' },
          { status: 404 },
        );
      }
    }

    // Verificar si el item ya existe en el carrito
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId,
          productId,
          variantId: variantId || null,
        },
      },
    });

    let cartItem;

    if (existingItem) {
      // Actualizar cantidad
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
          variant: true,
        },
      });
    } else {
      // Crear nuevo item
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          variantId,
          quantity,
        },
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
          variant: true,
        },
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Error al agregar al carrito' },
      { status: 500 },
    );
  }
}

// PUT /api/cart - Actualizar cantidad de un item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'ID del item y cantidad son requeridos' },
        { status: 400 },
      );
    }

    if (quantity <= 0) {
      // Si la cantidad es 0 o menor, eliminar el item
      await prisma.cartItem.delete({
        where: { id: itemId },
      });

      return NextResponse.json({ message: 'Item eliminado del carrito' });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        variant: true,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el carrito' },
      { status: 500 },
    );
  }
}

// DELETE /api/cart - Eliminar item del carrito
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'ID del item requerido' },
        { status: 400 },
      );
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: 'Item eliminado del carrito' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Error al eliminar del carrito' },
      { status: 500 },
    );
  }
}
