import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-guard';

// GET /api/admin/dashboard - Obtener estadísticas del dashboard
export async function GET() {
  try {
    // Proteger endpoint: solo ADMIN
    await requireRole(['ADMIN']);

    // Estadísticas generales
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      pendingReviews,
    ] = await Promise.all([
      // Total de usuarios
      prisma.user.count(),

      // Total de productos
      prisma.product.count(),

      // Total de órdenes
      prisma.order.count(),

      // Ingresos totales (solo órdenes pagadas)
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
        },
        _sum: {
          total: true,
        },
      }),

      // Órdenes recientes (últimas 5)
      prisma.order.findMany({
        take: 5,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          items: {
            take: 1,
            include: {
              product: {
                select: {
                  productName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      // Productos con stock bajo
      prisma.product.findMany({
        where: {
          variants: {
            some: {
              stock: {
                lte: 10,
              },
            },
          },
        },
        include: {
          variants: {
            where: {
              stock: {
                lte: 10,
              },
            },
          },
        },
        take: 10,
      }),

      // Reseñas pendientes de aprobación
      prisma.review.count({
        where: {
          isApproved: false,
        },
      }),
    ]);

    // Estadísticas de ventas por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
        paymentStatus: 'PAID',
      },
      _sum: {
        total: true,
      },
    });

    // Agrupar por mes
    const monthlyData = monthlySales.reduce((acc, sale) => {
      const month = sale.createdAt.toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + Number(sale._sum.total || 0);
      return acc;
    }, {} as Record<string, number>);

    // Top categorías por ventas
    const topCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        products: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingReviews,
      },
      recentOrders,
      lowStockProducts,
      monthlySales: monthlyData,
      topCategories,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del dashboard' },
      { status: 500 },
    );
  }
}
