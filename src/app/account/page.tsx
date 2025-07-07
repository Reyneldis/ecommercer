'use client';

import { useState, useEffect } from 'react';
import { User, MapPin, LogOut, Settings } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';
import AddressForm from '@/components/shared/UserProfile/AddressForm';
import PreferencesForm from '@/components/shared/UserProfile/PreferencesForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserAddress } from '@/types/user';
import { useUser } from '@clerk/nextjs';

const sections = [
  { key: 'profile', label: 'Perfil', icon: User },
  { key: 'address', label: 'Direcciones', icon: MapPin },
  { key: 'preferences', label: 'Preferencias', icon: Settings },
  { key: 'logout', label: 'Cerrar sesión', icon: LogOut },
];

export default function AccountPage() {
  const [selected, setSelected] = useState('profile');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null,
  );
  const [showPreferencesForm, setShowPreferencesForm] = useState(false);
  const {
    profile,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    updatePreferences,
  } = useUserProfile();
  const { user, isLoaded } = useUser();

  // Sincronizar usuario Clerk con Prisma vía API
  useEffect(() => {
    if (isLoaded && user) {
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
    }
  }, [isLoaded, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center py-16">
      <div className="w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-0 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="flex md:flex-col gap-2 bg-neutral-100 dark:bg-neutral-800 p-4 md:min-w-[180px]">
          {sections.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-base transition-all w-full
                ${
                  selected === key
                    ? 'bg-primary text-white shadow'
                    : 'text-neutral-700 dark:text-neutral-200 hover:bg-primary/10 hover:text-primary'
                }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </aside>
        {/* Contenido principal */}
        <section className="flex-1 p-8">
          {/* Perfil */}
          {selected === 'profile' && profile && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Mi Perfil</h2>

              {/* Avatar y información básica */}
              <div className="flex items-center gap-6 p-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profile.avatar} alt="Avatar" />
                    <AvatarFallback className="text-2xl">
                      {profile.firstName?.charAt(0)}
                      {profile.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {profile.email}
                  </p>
                  {profile.phone && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-500">
                      📞 {profile.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    Información de la cuenta
                  </h4>
                  <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <p>
                      Miembro desde:{' '}
                      {new Date(profile.createdAt).toLocaleDateString('es-ES')}
                    </p>
                    <p>
                      Última actualización:{' '}
                      {new Date(profile.updatedAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    Estado de la cuenta
                  </h4>
                  <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <p>✅ Cuenta verificada</p>
                    <p>🟢 Activa</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Direcciones */}
          {selected === 'address' && profile && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-2">Direcciones</h2>
              {profile.addresses.length === 0 ? (
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 text-neutral-500 dark:text-neutral-400 text-center">
                  No tienes direcciones guardadas.
                </div>
              ) : (
                <div className="space-y-2">
                  {profile.addresses.map(addr => (
                    <Card
                      key={addr.id}
                      className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                    >
                      <div>
                        <div className="font-semibold">
                          {addr.firstName} {addr.lastName}{' '}
                          {addr.isDefault && (
                            <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded">
                              Principal
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {addr.addressLine1}, {addr.city}, {addr.state},{' '}
                          {addr.country}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {addr.phone}
                        </div>
                        {addr.instructions && (
                          <div className="text-xs text-muted-foreground">
                            {addr.instructions}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingAddress(addr);
                            setShowAddressForm(true);
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDefaultAddress(addr.id)}
                        >
                          Hacer principal
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteAddress(addr.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              <Button
                onClick={() => {
                  setEditingAddress(null);
                  setShowAddressForm(true);
                }}
                className="mt-4"
              >
                Agregar dirección
              </Button>
              {showAddressForm && (
                <AddressForm
                  address={editingAddress || undefined}
                  onSave={async data => {
                    if (editingAddress) {
                      await updateAddress(editingAddress.id, data);
                    } else {
                      await addAddress(data);
                    }
                  }}
                  onClose={() => {
                    setShowAddressForm(false);
                    setEditingAddress(null);
                  }}
                />
              )}
            </div>
          )}

          {/* Preferencias */}
          {selected === 'preferences' && profile && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-2">Preferencias</h2>
              <Button
                onClick={() => setShowPreferencesForm(true)}
                className="mb-4"
              >
                Editar preferencias
              </Button>
              <div className="text-base text-neutral-700 dark:text-neutral-200">
                <div>
                  Idioma:{' '}
                  <span className="font-medium">
                    {profile.preferences.language}
                  </span>
                </div>
                <div>
                  Moneda:{' '}
                  <span className="font-medium">
                    {profile.preferences.currency}
                  </span>
                </div>
                <div>
                  Tema:{' '}
                  <span className="font-medium">
                    {profile.preferences.theme}
                  </span>
                </div>
              </div>
              {showPreferencesForm && (
                <PreferencesForm
                  preferences={profile.preferences}
                  onSave={updatePreferences}
                  onClose={() => setShowPreferencesForm(false)}
                />
              )}
            </div>
          )}

          {/* Logout */}
          {selected === 'logout' && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <LogOut className="h-10 w-10 text-primary mb-2" />
              <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
                ¿Seguro que quieres cerrar sesión?
              </span>
              <Button className="px-8 py-3 rounded-full border border-primary text-primary font-semibold bg-transparent hover:bg-primary hover:text-white transition-all">
                Cerrar sesión
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
