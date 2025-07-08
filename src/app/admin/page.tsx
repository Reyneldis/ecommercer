'use client';

import { useUser } from '@clerk/nextjs';
import { useUserRole } from '@/hooks/use-user-role';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  Shield,
  Home,
  Bell,
  ArrowRight,
  DollarSign,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Tipos para los datos del dashboard
interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  total: number;
  status: string;
  createdAt: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
}

export default function AdminPage() {
  const { user } = useUser();
  const { role, loading } = useUserRole();

  // Estado para los datos del dashboard
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [errorDashboard, setErrorDashboard] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      setLoadingDashboard(true);
      setErrorDashboard(null);
      try {
        const res = await fetch('/api/admin/dashboard');
        if (!res.ok) throw new Error('Error al obtener datos del dashboard');
        const data: DashboardData = await res.json();
        setDashboard(data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setErrorDashboard(errorMessage);
      } finally {
        setLoadingDashboard(false);
      }
    }
    if (role === 'ADMIN') fetchDashboard();
  }, [role]);

  if (loading || loadingDashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-lg font-medium text-neutral-600 dark:text-neutral-400">
            Cargando panel de administración...
          </p>
        </div>
      </div>
    );
  }

  if (errorDashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold text-red-600">{errorDashboard}</h2>
      </div>
    );
  }

  if (role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold text-red-600">
          Acceso denegado. Solo administradores pueden ver esta página.
        </h2>
      </div>
    );
  }

  // Usar datos reales si existen
  const stats = dashboard?.stats || {
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    revenue: 0,
  };
  const recentOrders = dashboard?.recentOrders || [];

  return (
    <div className="min-h-screen mt-18 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 sm:py-8 gap-4">
            <div className="text-white">
              <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
                🚀 Panel de Administración
              </h1>
              <p className="text-base sm:text-xl text-blue-100">
                Bienvenido, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Link href="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border-white/30 font-medium rounded-xl"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Volver al sitio
                </Button>
              </Link>
              <div className="flex items-center gap-3 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm w-full sm:w-auto">
                <Shield className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">Administrador</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-blue-100">
                Total Usuarios
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{stats.totalUsers}</div>
              <p className="text-blue-100 text-sm flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +12% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-green-100">
                Total Pedidos
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{stats.totalOrders}</div>
              <p className="text-green-100 text-sm flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +8% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-purple-100">
                Productos
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <Package className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {stats.totalProducts}
              </div>
              <p className="text-purple-100 text-sm flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +2 nuevos este mes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-orange-100">
                Ingresos
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                ${Number(stats.revenue || 0).toLocaleString()}
              </div>
              <p className="text-orange-100 text-sm flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +15% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Quick Actions Premium */}
          <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <Activity className="h-6 w-6" />
                Acciones Rápidas
              </CardTitle>
            </div>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Link href="/admin/users">
                  <Button className="w-full h-14 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Users className="h-5 w-5 mr-3" />
                    Gestionar Usuarios
                  </Button>
                </Link>
                <Link href="/admin/orders">
                  <Button className="w-full h-14 text-base font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    Ver Pedidos
                  </Button>
                </Link>
                <Link href="/admin/products">
                  <Button className="w-full h-14 text-base font-medium bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Package className="h-5 w-5 mr-3" />
                    Gestionar Productos
                  </Button>
                </Link>
                <Link href="/admin/payments">
                  <Button className="w-full h-14 text-base font-medium bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <DollarSign className="h-5 w-5 mr-3" />
                    Dashboard de Pagos
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button className="w-full h-14 text-base font-medium bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <TrendingUp className="h-5 w-5 mr-3" />
                    Ver Estadísticas
                  </Button>
                </Link>
                <Link href="/admin/test-notifications">
                  <Button className="w-full h-14 text-base font-medium bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Bell className="h-5 w-5 mr-3" />
                    Probar Notificaciones
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders Premium */}
          <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <ShoppingCart className="h-6 w-6" />
                Pedidos Recientes
              </CardTitle>
            </div>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4 overflow-x-auto">
                {recentOrders.map((order: RecentOrder) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-200 gap-2 sm:gap-0"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm sm:text-base">
                          {order.user
                            ? `${order.user.firstName} ${order.user.lastName}`
                            : 'Cliente no registrado'}
                        </p>
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                          Pedido #{order.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-base sm:text-lg text-neutral-800 dark:text-neutral-200">
                        ${Number(order.total).toLocaleString()}
                      </p>
                      <span
                        className={`text-xs px-2 sm:px-3 py-1 rounded-full font-medium ${
                          order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : order.status === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {order.status === 'DELIVERED'
                          ? '✅ Entregado'
                          : order.status === 'SHIPPED'
                          ? '🚚 Enviado'
                          : '⏳ Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <Link href="/admin/orders">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-medium">
                    Ver Todos los Pedidos
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
