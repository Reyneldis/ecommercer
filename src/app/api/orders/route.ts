import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-guard';

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
    const {
      userId,
      customerEmail,
      customerName,
      items,
      subtotal,
      taxAmount,
      shippingAmount,
      total,
    } = body;

    // Validaciones básicas
    if (
      !userId ||
      !customerEmail ||
      !customerName ||
      !items ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: 'Datos de orden incompletos' },
        { status: 400 },
      );
    }

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
        subtotal: parseFloat(subtotal),
        taxAmount: parseFloat(taxAmount || '0'),
        shippingAmount: parseFloat(shippingAmount || '0'),
        total: parseFloat(total),
        paymentStatus: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            productSku: item.productSku,
            variantName: item.variantName,
            price: parseFloat(item.price),
            quantity: item.quantity,
            total: parseFloat(item.total),
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
