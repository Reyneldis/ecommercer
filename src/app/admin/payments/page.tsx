'use client';

import { useAdmin } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CreditCard,
  Search,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Datos de ejemplo de transacciones (en producción esto vendría de Stripe API)
const mockTransactions = [
  {
    id: 'txn_001',
    customer: 'Juan Pérez',
    email: 'juan.perez@email.com',
    amount: 219.98,
    status: 'succeeded',
    paymentMethod: 'card',
    last4: '4242',
    createdAt: '2024-01-20T10:30:00Z',
    orderId: 'ORD-001',
  },
  {
    id: 'txn_002',
    customer: 'María García',
    email: 'maria.garcia@email.com',
    amount: 149.99,
    status: 'succeeded',
    paymentMethod: 'card',
    last4: '5555',
    createdAt: '2024-01-19T14:20:00Z',
    orderId: 'ORD-002',
  },
  {
    id: 'txn_003',
    customer: 'Carlos López',
    email: 'carlos.lopez@email.com',
    amount: 1079.97,
    status: 'pending',
    paymentMethod: 'card',
    last4: '1234',
    createdAt: '2024-01-18T16:45:00Z',
    orderId: 'ORD-003',
  },
  {
    id: 'txn_004',
    customer: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    amount: 99.98,
    status: 'failed',
    paymentMethod: 'card',
    last4: '8888',
    createdAt: '2024-01-17T12:15:00Z',
    orderId: 'ORD-004',
  },
  {
    id: 'txn_005',
    customer: 'Luis Rodríguez',
    email: 'luis.rodriguez@email.com',
    amount: 99.94,
    status: 'succeeded',
    paymentMethod: 'card',
    last4: '9999',
    createdAt: '2024-01-16T09:30:00Z',
    orderId: 'ORD-005',
  },
];

const statusConfig = {
  succeeded: {
    label: 'Exitoso',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: CheckCircle,
  },
  pending: {
    label: 'Pendiente',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: Clock,
  },
  failed: {
    label: 'Fallido',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: XCircle,
  },
};

export default function AdminPaymentsPage() {
  const { isAdmin } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-red-900 dark:via-neutral-800 dark:to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-red-600 dark:text-red-400">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch =
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || transaction.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = mockTransactions
    .filter(t => t.status === 'succeeded')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = mockTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const failedAmount = mockTransactions
    .filter(t => t.status === 'failed')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleViewDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  const handleRefresh = () => {
    toast.success('Datos actualizados');
  };

  const handleExport = () => {
    toast.success('Reporte exportado');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900 dark:via-neutral-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Dashboard de Pagos
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Gestiona y monitorea todas las transacciones de Stripe
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Ingresos Totales
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ${Number(totalRevenue).toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Transacciones
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {mockTransactions.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Pendientes
                  </p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    ${Number(pendingAmount).toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Fallidos
                  </p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    ${Number(failedAmount).toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl mb-8">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-2xl">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Filter className="h-6 w-6" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                  <Input
                    placeholder="Buscar por cliente, email o ID de transacción..."
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
                <option value="succeeded">Exitosos</option>
                <option value="pending">Pendientes</option>
                <option value="failed">Fallidos</option>
              </select>
              <Button
                onClick={handleRefresh}
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Actualizar
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="h-12 px-6 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl"
              >
                <Download className="h-5 w-5 mr-2" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Transacciones */}
        <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-t-2xl">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <CreditCard className="h-6 w-6" />
              Transacciones Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {filteredTransactions.map(transaction => {
                const status =
                  statusConfig[transaction.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;

                return (
                  <div
                    key={transaction.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 text-lg">
                          {transaction.customer}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {transaction.email}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />$
                            {Number(transaction.amount).toFixed(2)}
                          </span>
                          <span className="flex items-center gap-1">
                            •••• {transaction.last4}
                          </span>
                          <span className="flex items-center gap-1">
                            {new Date(
                              transaction.createdAt,
                            ).toLocaleDateString()}
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
                        onClick={() => handleViewDetails(transaction)}
                        className="h-10 px-4 rounded-xl border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalles */}
      {showDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 pt-20">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-white/20 dark:border-neutral-800 max-w-2xl w-full max-h-[85vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-3">
                    💳 Detalles de la Transacción
                  </h2>
                  <p className="text-blue-100 text-lg font-medium">
                    ID: {selectedTransaction.id}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <XCircle className="h-8 w-8" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2 uppercase tracking-wide">
                    Cliente
                  </label>
                  <p className="text-xl font-bold text-blue-900 dark:text-blue-100 bg-white dark:bg-blue-900/30 px-4 py-3 rounded-xl">
                    {selectedTransaction.customer}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-xl font-bold text-blue-900 dark:text-blue-100 bg-white dark:bg-blue-900/30 px-4 py-3 rounded-xl">
                    {selectedTransaction.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2 uppercase tracking-wide">
                    Monto
                  </label>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400 bg-white dark:bg-green-900/30 px-4 py-3 rounded-xl">
                    ${Number(selectedTransaction.amount).toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2 uppercase tracking-wide">
                    Estado
                  </label>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-semibold ${
                      statusConfig[
                        selectedTransaction.status as keyof typeof statusConfig
                      ].color
                    }`}
                  >
                    {(() => {
                      const StatusIcon =
                        statusConfig[
                          selectedTransaction.status as keyof typeof statusConfig
                        ].icon;
                      return <StatusIcon className="h-5 w-5" />;
                    })()}
                    {
                      statusConfig[
                        selectedTransaction.status as keyof typeof statusConfig
                      ].label
                    }
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2 uppercase tracking-wide">
                    Tarjeta
                  </label>
                  <p className="text-xl font-bold text-blue-900 dark:text-blue-100 bg-white dark:bg-blue-900/30 px-4 py-3 rounded-xl">
                    •••• {selectedTransaction.last4}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2 uppercase tracking-wide">
                    Fecha
                  </label>
                  <p className="text-xl font-bold text-blue-900 dark:text-blue-100 bg-white dark:bg-blue-900/30 px-4 py-3 rounded-xl">
                    {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <Button
                  onClick={() => setShowDetails(false)}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
