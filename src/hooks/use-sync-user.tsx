'use client';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * Sincroniza el usuario Clerk con la base de datos Prisma al iniciar sesión.
 * Llama a /api/sync-user con los datos del usuario Clerk.
 */
export function useSyncUser() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    // Llama al endpoint para sincronizar usuario
    fetch('/api/sync-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.imageUrl,
      }),
    });
  }, [isSignedIn, user]);
}
