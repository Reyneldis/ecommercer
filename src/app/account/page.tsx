'use client';

import { useState } from 'react';
import { User, Package, MapPin, LogOut } from 'lucide-react';

const sections = [
  { key: 'profile', label: 'Perfil', icon: User },
  { key: 'orders', label: 'Pedidos', icon: Package },
  { key: 'address', label: 'Dirección', icon: MapPin },
  { key: 'logout', label: 'Cerrar sesión', icon: LogOut },
];

function ProfileSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Perfil</h2>
      <div className="flex flex-col gap-2">
        <span className="text-base text-neutral-700 dark:text-neutral-200">
          Nombre: <span className="font-medium">Usuario Demo</span>
        </span>
        <span className="text-base text-neutral-700 dark:text-neutral-200">
          Email: <span className="font-medium">usuario@email.com</span>
        </span>
      </div>
      <button className="mt-4 px-6 py-2 rounded-full border border-primary text-primary font-semibold bg-transparent hover:bg-primary hover:text-white transition-all">
        Editar perfil
      </button>
    </div>
  );
}

function OrdersSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Pedidos</h2>
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 text-neutral-500 dark:text-neutral-400 text-center">
        No tienes pedidos recientes.
      </div>
    </div>
  );
}

function AddressSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Dirección</h2>
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 text-neutral-500 dark:text-neutral-400 text-center">
        No tienes direcciones guardadas.
      </div>
      <button className="mt-2 px-6 py-2 rounded-full border border-primary text-primary font-semibold bg-transparent hover:bg-primary hover:text-white transition-all">
        Agregar dirección
      </button>
    </div>
  );
}

export default function AccountPage() {
  const [selected, setSelected] = useState('profile');

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
          {selected === 'profile' && <ProfileSection />}
          {selected === 'orders' && <OrdersSection />}
          {selected === 'address' && <AddressSection />}
          {selected === 'logout' && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <LogOut className="h-10 w-10 text-primary mb-2" />
              <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
                ¿Seguro que quieres cerrar sesión?
              </span>
              <button className="px-8 py-3 rounded-full border border-primary text-primary font-semibold bg-transparent hover:bg-primary hover:text-white transition-all">
                Cerrar sesión
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
