import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-guard';

// GET /api/users - Obtener usuarios (solo admin)
export async function GET(request: NextRequest) {
  try {
    await requireRole(['ADMIN']);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          createdAt: true,
          isActive: true,
          _count: {
            select: {
              orders: true,
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
      prisma.user.count(),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Error al obtener los usuarios' },
      { status: 500 },
    );
  }
}

// POST /api/users - Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerkId, email, firstName, lastName, role, avatar } = body;

    // Validaciones básicas
    if (!clerkId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 },
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 },
      );
    }

    const user = await prisma.user.create({
      data: {
        clerkId,
        email,
        firstName,
        lastName,
        role: role || 'USER',
        avatar,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Error al crear el usuario' },
      { status: 500 },
    );
  }
}
