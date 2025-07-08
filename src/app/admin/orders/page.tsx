'use client';

import { useAdmin } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Package,
  Search,
  Mail,
  Calendar,
  Shield,
  ArrowLeft,
  Filter,
  MoreHorizontal,
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Datos de ejemplo de pedidos (en producción esto vendría de una API)
const mockOrders = [
  {
    id: 'ORD-001',
    customer: {
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      avatar: '',
    },
    items: [
      { name: 'Arrocera Eléctrica', quantity: 1, price: 89.99 },
      { name: 'Licuadora Profesional', quantity: 1, price: 129.99 },
    ],
    total: 219.98,
    status: 'pending',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    shippingAddress: 'Calle Principal 123, Ciudad',
    paymentMethod: 'Tarjeta de crédito',
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'María García',
      email: 'maria.garcia@email.com',
      avatar: '',
    },
    items: [{ name: 'Cafetera Eléctrica', quantity: 1, price: 149.99 }],
    total: 149.99,
    status: 'processing',
    createdAt: '2024-01-19T14:20:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    shippingAddress: 'Avenida Central 456, Ciudad',
    paymentMethod: 'PayPal',
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Carlos López',
      email: 'carlos.lopez@email.com',
      avatar: '',
    },
    items: [
      { name: 'Refrigerador', quantity: 1, price: 599.99 },
      { name: 'Lavadora', quantity: 1, price: 399.99 },
      { name: 'Freidora de Aire', quantity: 1, price: 79.99 },
    ],
    total: 1079.97,
    status: 'shipped',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-19T11:30:00Z',
    shippingAddress: 'Plaza Mayor 789, Ciudad',
    paymentMethod: 'Transferencia bancaria',
  },
  {
    id: 'ORD-004',
    customer: {
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      avatar: '',
    },
    items: [{ name: 'Ventilador Recargable', quantity: 2, price: 49.99 }],
    total: 99.98,
    status: 'delivered',
    createdAt: '2024-01-17T12:15:00Z',
    updatedAt: '2024-01-18T15:20:00Z',
    shippingAddress: 'Calle Secundaria 321, Ciudad',
    paymentMethod: 'Tarjeta de débito',
  },
  {
    id: 'ORD-005',
    customer: {
      name: 'Luis Rodríguez',
      email: 'luis.rodriguez@email.com',
      avatar: '',
    },
    items: [
      { name: 'Bombillo LED', quantity: 5, price: 12.99 },
      { name: 'Productos de Aseo', quantity: 1, price: 34.99 },
    ],
    total: 99.94,
    status: 'cancelled',
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-16T14:45:00Z',
    shippingAddress: 'Boulevard Norte 654, Ciudad',
    paymentMethod: 'Tarjeta de crédito',
  },
];

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: Clock,
  },
  processing: {
    label: 'Procesando',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: Package,
  },
  shipped: {
    label: 'Enviado',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    icon: Truck,
  },
  delivered: {
    label: 'Entregado',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: XCircle,
  },
};

export default function AdminOrdersPage() {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Usar estado para los pedidos en lugar de datos estáticos
  const [orders, setOrders] = useState(mockOrders);

  // Redirigir si no es admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-lg font-medium text-neutral-600 dark:text-neutral-400">
            Cargando pedidos...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // Filtrar pedidos usando el estado
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Calcular estadísticas usando el estado
  const totalRevenue = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    order => order.status === 'pending',
  ).length;
  const deliveredOrders = orders.filter(
    order => order.status === 'delivered',
  ).length;

  // Funciones de manejo
  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (order: any) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleStatusChange = (newStatus: string) => {
    if (selectedOrder) {
      // Actualizar el estado real de los pedidos
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : order,
        ),
      );

      // Actualizar el pedido seleccionado también
      setSelectedOrder(prev => (prev ? { ...prev, status: newStatus } : null));

      console.log(`Pedido ${selectedOrder.id} actualizado a: ${newStatus}`);

      // Mostrar notificación elegante
      toast.success(
        `Pedido ${selectedOrder.id} actualizado a: ${
          statusConfig[newStatus as keyof typeof statusConfig].label
        }`,
      );
    }
    setShowStatusModal(false);
  };

  return (
    <div className="min-h-screen mt-18 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center gap-6">
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 font-medium rounded-xl"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Volver al Dashboard
                </Button>
              </Link>
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">
                  📦 Gestión de Pedidos
                </h1>
                <p className="text-xl text-green-100">
                  Administra todos los pedidos de la tienda
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
              <Shield className="h-5 w-5 text-white" />
              <span className="text-white font-semibold">Administrador</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats Cards Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-blue-100">
                Total Pedidos
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{totalOrders}</div>
              <p className="text-blue-100 text-sm">Todos los pedidos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-yellow-100">
                Pendientes
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{pendingOrders}</div>
              <p className="text-yellow-100 text-sm">Esperando procesamiento</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-blue-100">
                Enviados
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{deliveredOrders}</div>
              <p className="text-blue-100 text-sm">En camino al cliente</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-green-100">
                Completados
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {totalOrders - pendingOrders - deliveredOrders}
              </div>
              <p className="text-green-100 text-sm">Entregados exitosamente</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Premium */}
        <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-2xl">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Filter className="h-6 w-6" />
              Filtros y Búsqueda
            </CardTitle>
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                  <Input
                    placeholder="Buscar por cliente, email o ID de pedido..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="shipped">Enviados</option>
                <option value="delivered">Entregados</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List Premium */}
        <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <ShoppingCart className="h-6 w-6" />
              Lista de Pedidos
            </CardTitle>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const status =
                  statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;

                return (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 text-lg">
                          {order.customer.name}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {order.customer.email}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {order.items.length} items
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />$
                            {Number(order.total).toFixed(2)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${status.color}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {status.label}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                        className="h-10 px-4 rounded-xl border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(order)}
                        className="h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                      >
                        Actualizar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalles Premium */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 pt-20">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-white/20 dark:border-neutral-800 max-w-4xl w-full max-h-[85vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-3">
                    📋 Detalles del Pedido
                  </h2>
                  <div className="flex items-center gap-4">
                    <p className="text-blue-100 text-lg font-medium">
                      Pedido #{selectedOrder.id}
                    </p>
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm ${
                        statusConfig[
                          selectedOrder.status as keyof typeof statusConfig
                        ].color
                      }`}
                    >
                      {(() => {
                        const StatusIcon =
                          statusConfig[
                            selectedOrder.status as keyof typeof statusConfig
                          ].icon;
                        return <StatusIcon className="h-4 w-4" />;
                      })()}
                      {
                        statusConfig[
                          selectedOrder.status as keyof typeof statusConfig
                        ].label
                      }
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                  className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white border-0 transition-all duration-200"
                >
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="space-y-8">
                {/* Información del Cliente */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border border-blue-100 dark:border-blue-800">
                  <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-6 flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    👤 Información del Cliente
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2 uppercase tracking-wide">
                          Nombre Completo
                        </label>
                        <p className="text-xl font-bold text-blue-900 dark:text-blue-100 bg-white dark:bg-blue-900/30 px-4 py-3 rounded-xl">
                          {selectedOrder.customer.name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2 uppercase tracking-wide">
                          Email
                        </label>
                        <p className="text-xl font-bold text-blue-900 dark:text-blue-100 bg-white dark:bg-blue-900/30 px-4 py-3 rounded-xl">
                          {selectedOrder.customer.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2 uppercase tracking-wide">
                          Teléfono
                        </label>
                        <p className="text-xl font-bold text-blue-900 dark:text-blue-100 bg-white dark:bg-blue-900/30 px-4 py-3 rounded-xl">
                          {selectedOrder.phone || 'No especificado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2 uppercase tracking-wide">
                          Fecha del Pedido
                        </label>
                        <p className="text-xl font-bold text-blue-900 dark:text-blue-100 bg-white dark:bg-blue-900/30 px-4 py-3 rounded-xl">
                          {new Date(selectedOrder.createdAt).toLocaleDateString(
                            'es-ES',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del Pedido */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8 border border-green-100 dark:border-green-800">
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-6 flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    📦 Información del Pedido
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-green-600 dark:text-green-300 mb-2 uppercase tracking-wide">
                        ID del Pedido
                      </label>
                      <p className="text-xl font-bold text-green-900 dark:text-green-100 bg-white dark:bg-green-900/30 px-4 py-3 rounded-xl">
                        #{selectedOrder.id}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-green-600 dark:text-green-300 mb-2 uppercase tracking-wide">
                        Cantidad de Items
                      </label>
                      <p className="text-xl font-bold text-green-900 dark:text-green-100 bg-white dark:bg-green-900/30 px-4 py-3 rounded-xl">
                        {selectedOrder.items.length} productos
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-green-600 dark:text-green-300 mb-2 uppercase tracking-wide">
                        Total del Pedido
                      </label>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400 bg-white dark:bg-green-900/30 px-4 py-3 rounded-xl">
                        ${Number(selectedOrder.total).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Lista de Productos */}
                  <div>
                    <label className="block text-sm font-semibold text-green-600 dark:text-green-300 mb-4 uppercase tracking-wide">
                      Productos del Pedido
                    </label>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-green-900/30 rounded-2xl p-4 border border-green-200 dark:border-green-700"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h4 className="font-semibold text-green-900 dark:text-green-100 text-lg">
                                {item.name}
                              </h4>
                              <p className="text-green-600 dark:text-green-300">
                                Cantidad: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                $
                                {(
                                  Number(item.price) * Number(item.quantity)
                                ).toFixed(2)}
                              </p>
                              <p className="text-sm text-green-500 dark:text-green-400">
                                ${Number(item.price).toFixed(2)} c/u
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Información de Envío y Pago */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border border-purple-100 dark:border-purple-800">
                  <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-6 flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    🚚 Información de Envío y Pago
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-purple-600 dark:text-purple-300 mb-2 uppercase tracking-wide">
                        Dirección de Envío
                      </label>
                      <p className="text-lg font-semibold text-purple-900 dark:text-purple-100 bg-white dark:bg-purple-900/30 px-4 py-3 rounded-xl min-h-[60px] flex items-center">
                        {selectedOrder.shippingAddress}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-purple-600 dark:text-purple-300 mb-2 uppercase tracking-wide">
                        Método de Pago
                      </label>
                      <p className="text-lg font-semibold text-purple-900 dark:text-purple-100 bg-white dark:bg-purple-900/30 px-4 py-3 rounded-xl">
                        {selectedOrder.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-6 rounded-b-3xl border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex gap-4">
                <Button
                  onClick={() => handleUpdateStatus(selectedOrder)}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all duration-200"
                >
                  🔄 Actualizar Estado
                </Button>
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold transition-all duration-200"
                >
                  ✅ Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Actualizar Estado Premium */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-white/20 dark:border-neutral-800 max-w-md w-full">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    🔄 Actualizar Estado
                  </h2>
                  <p className="text-indigo-100 text-lg">
                    Pedido #{selectedOrder.id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStatusModal(false)}
                  className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <div className="p-8">
              <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                  Estado Actual:{' '}
                  {
                    statusConfig[
                      selectedOrder.status as keyof typeof statusConfig
                    ].label
                  }
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleStatusChange('pending')}
                    className="w-full h-12 justify-start bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-xl font-medium"
                  >
                    <Clock className="h-5 w-5 mr-3" />
                    Marcar como Pendiente
                  </Button>
                  <Button
                    onClick={() => handleStatusChange('shipped')}
                    className="w-full h-12 justify-start bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-medium"
                  >
                    <Truck className="h-5 w-5 mr-3" />
                    Marcar como Enviado
                  </Button>
                  <Button
                    onClick={() => handleStatusChange('delivered')}
                    className="w-full h-12 justify-start bg-green-100 hover:bg-green-200 text-green-800 rounded-xl font-medium"
                  >
                    <CheckCircle className="h-5 w-5 mr-3" />
                    Marcar como Entregado
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-6 rounded-b-3xl border-t border-neutral-200 dark:border-neutral-700">
              <Button
                variant="outline"
                onClick={() => setShowStatusModal(false)}
                className="w-full h-12 rounded-xl border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 font-medium"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
