import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-guard';
import { orderSchema } from '@/schemas/orderSchema';

// GET /api/orders - Obtener órdenes (admin ve todas, usuario ve las suyas)
export async function GET(request: NextRequest) {
  try {
    // Permitir tanto ADMIN como USER autenticado
    const user = await requireRole(['ADMIN', 'USER']);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};
    if (status) where.status = status;

    // Si no es ADMIN, solo puede ver sus propias órdenes
    if (user.role !== 'ADMIN') {
      where.userId = user.id;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  productName: true,
                  slug: true,
                },
              },
              variant: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Error al obtener las órdenes' },
      { status: 500 },
    );
  }
}

// POST /api/orders - Crear una nueva orden
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validar con Zod
    const result = orderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten() },
        { status: 400 },
      );
    }
    const {
      userId,
      customerEmail,
      customerName,
      items,
      subtotal,
      taxAmount,
      shippingAmount,
      total,
    } = result.data;
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 400 },
      );
    }
    // Generar número de orden único
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    // Crear la orden
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: 'PENDING',
        customerEmail,
        customerName,
        subtotal,
        taxAmount: taxAmount ?? 0,
        shippingAmount: shippingAmount ?? 0,
        total,
        paymentStatus: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            productSku: item.productSku,
            variantName: item.variantName,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          })),
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                productName: true,
                slug: true,
              },
            },
            variant: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Error al crear la orden' },
      { status: 500 },
    );
  }
}
