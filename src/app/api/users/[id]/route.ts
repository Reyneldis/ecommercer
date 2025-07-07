import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-guard';

// GET /api/users/[id] - Detalles de usuario
export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    await requireRole(['ADMIN']);
    const params = await context.params;
    const { id } = params;
    const user = await prisma.user.findUnique({
      where: { id },
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
          select: { orders: true, reviews: true },
        },
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 },
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// PATCH /api/users/[id] - Editar usuario
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    await requireRole(['ADMIN']);
    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    const { firstName, lastName, email, role, avatar, isActive } = body;
    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        role,
        avatar,
        isActive,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    await requireRole(['ADMIN']);
    const params = await context.params;
    const { id } = params;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
