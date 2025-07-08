import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncUserSchema } from '@/schemas/syncUserSchema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validar con Zod
    const result = syncUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten() },
        { status: 400 },
      );
    }
    const { clerkId, email, firstName, lastName, avatar } = result.data;
    // Buscar usuario por clerkId
    let user = await prisma.user.findUnique({ where: { clerkId } });
    // Si no existe, crearlo
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          firstName: firstName || '',
          lastName: lastName || '',
          avatar: avatar || null,
          role: 'USER',
        },
      });
    }
    // (Opcional) Actualizar datos si han cambiado
    // Puedes agregar lógica aquí si quieres mantener los datos sincronizados
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error en sync-user:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
