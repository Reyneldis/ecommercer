'use client';

import { useAdmin } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Shield,
  ArrowLeft,
  Filter,
  User,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

export default function AdminUsersPage() {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estado para los usuarios reales
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Nuevo estado para el modal de detalles/edición
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalUser, setModalUser] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Estado para modo creación
  const [isCreating, setIsCreating] = useState(false);

  // Fetch real de usuarios
  useEffect(() => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
      })
      .catch(() => {
        toast.error('Error al cargar los usuarios');
      })
      .finally(() => setLoadingUsers(false));
  }, [isAdmin]);

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
            Cargando usuarios...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'activo' ? user.isActive : !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calcular estadísticas
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const customerUsers = users.filter(u => u.role === 'customer').length;

  // Funciones de manejo
  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      toast.success(`Usuario "${selectedUser.name}" eliminado correctamente`);
    }
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, isActive: !u.isActive } : u)),
    );

    const user = users.find(u => u.id === userId);
    if (user) {
      toast.info(
        `Usuario "${user.name}" ${user.isActive ? 'desactivado' : 'activado'}`,
      );
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'admin'
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  // Nueva función para toggle activo
  const handleToggleActive = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/toggle-active`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Error al cambiar el estado');
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, isActive: !u.isActive } : u)),
      );
      toast.success('Estado actualizado correctamente');
    } catch {
      toast.error('Error al cambiar el estado del usuario');
    }
  };

  // Función para abrir modal y cargar datos
  const handleViewUser = async (userId: string) => {
    setModalLoading(true);
    setShowUserModal(true);
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      setModalUser(data);
    } catch {
      toast.error('Error al cargar detalles');
      setShowUserModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  // Función para abrir modal de creación
  const handleCreateUser = () => {
    setModalUser({
      firstName: '',
      lastName: '',
      email: '',
      role: 'USER',
      isActive: true,
      avatar: '',
      clerkId: `admin-manual-${uuidv4()}`,
    });
    setIsCreating(true);
    setShowUserModal(true);
  };

  // Modificar handleSaveUser para crear o editar
  const handleSaveUser = async () => {
    if (!modalUser) return;
    setModalLoading(true);
    try {
      let res, data;
      if (isCreating) {
        res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(modalUser),
        });
        data = await res.json();
        if (!res.ok) throw new Error();
        toast.success('Usuario creado');
        setUsers(prev => [data, ...prev]);
      } else {
        res = await fetch(`/api/users/${modalUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(modalUser),
        });
        data = await res.json();
        if (!res.ok) throw new Error();
        toast.success('Usuario actualizado');
        setUsers(prev =>
          prev.map(u => (u.id === modalUser.id ? { ...u, ...modalUser } : u)),
        );
      }
      setShowUserModal(false);
      setIsCreating(false);
    } catch {
      toast.error(
        isCreating ? 'Error al crear usuario' : 'Error al guardar cambios',
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Al cerrar el modal, resetear isCreating
  const closeUserModal = () => {
    setShowUserModal(false);
    setIsCreating(false);
  };

  // Función para eliminar usuario
  const handleDeleteUserModal = async () => {
    if (!modalUser) return;
    setModalLoading(true);
    try {
      const res = await fetch(`/api/users/${modalUser.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      toast.success('Usuario eliminado');
      setUsers(prev => prev.filter(u => u.id !== modalUser.id));
      setShowUserModal(false);
    } catch {
      toast.error('Error al eliminar usuario');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-18 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 w-full">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 shadow-2xl w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 w-full">
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
                  👥 Gestión de Usuarios
                </h1>
                <p className="text-xl text-purple-100">
                  Administra todos los usuarios de la plataforma
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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 w-full">
        {/* Stats Cards Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
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
              <div className="text-3xl font-bold mb-2">{totalUsers}</div>
              <p className="text-blue-100 text-sm">Todos los usuarios</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-green-100">
                Usuarios Activos
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{activeUsers}</div>
              <p className="text-green-100 text-sm">Usuarios activos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-purple-100">
                Administradores
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{adminUsers}</div>
              <p className="text-purple-100 text-sm">Usuarios admin</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-orange-100">
                Clientes
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-xl">
                <User className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{customerUsers}</div>
              <p className="text-orange-100 text-sm">Usuarios cliente</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Premium */}
        <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl mb-8 w-full">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-6 rounded-t-2xl">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Filter className="h-6 w-6" />
              Filtros y Búsqueda
            </CardTitle>
          </div>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                  <Input
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className="px-4 py-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Todos los roles</option>
                <option value="admin">Administradores</option>
                <option value="customer">Clientes</option>
              </select>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users List Premium */}
        <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl overflow-x-auto w-full">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 sm:p-6">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Users className="h-6 w-6" />
              Lista de Usuarios
            </CardTitle>
          </div>
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-end mb-4 sm:mb-6">
              <Button
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md hover:from-pink-600 hover:to-purple-700 rounded-xl"
                size="lg"
                onClick={handleCreateUser}
              >
                <User className="h-5 w-5 mr-2" /> Agregar usuario
              </Button>
            </div>
            <div className="space-y-2 sm:space-y-4">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-200 w-full overflow-x-auto"
                >
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 text-lg">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                            user.role,
                          )}`}
                        >
                          {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {user.orders} pedidos
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          ${user.totalSpent}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleToggleActive(user.id)}
                      variant={user.isActive ? 'destructive' : 'default'}
                      size="sm"
                    >
                      {user.isActive ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-neutral-300 text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                      onClick={() => handleViewUser(user.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => handleViewUser(user.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                      className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={e => {
            if (e.target === e.currentTarget) setShowDeleteModal(false);
          }}
        >
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-0 w-full max-w-md relative overflow-hidden border border-neutral-200 dark:border-neutral-800 max-h-[90vh] flex flex-col">
            {/* Header premium */}
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 p-6 flex flex-col items-center">
              <button
                className="absolute top-4 right-4 text-white/80 hover:text-white"
                onClick={() => setShowDeleteModal(false)}
              >
                <X className="h-6 w-6" />
              </button>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-pink-600 flex items-center justify-center mb-3 shadow-lg border-4 border-white dark:border-neutral-800 overflow-hidden relative">
                <Trash2 className="h-10 w-10 text-white/80" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1 text-center">
                ¿Eliminar usuario?
              </h2>
              <p className="text-white/80 text-sm mb-2 text-center">
                Esta acción no se puede deshacer
              </p>
            </div>
            {/* Contenido premium */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-4 mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                      ¿Eliminar usuario?
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-xs">
                      {selectedUser.firstName} {selectedUser.lastName} (
                      {selectedUser.email})
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-4">
                <h4 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2 text-sm">
                  ⚠️ Esta acción eliminará permanentemente:
                </h4>
                <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    El usuario de la plataforma
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    Toda la información asociada
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    No se puede recuperar
                  </li>
                </ul>
              </div>
            </div>
            {/* Footer premium sticky */}
            <div className="flex gap-3 justify-end p-4 sticky bottom-0 bg-white dark:bg-neutral-900 z-10 rounded-b-3xl border-t border-neutral-200 dark:border-neutral-700">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-pink-700"
              >
                🗑️ Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles/edición */}
      {showUserModal && modalUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={e => {
            if (e.target === e.currentTarget) closeUserModal();
          }}
        >
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-0 w-full max-w-xs sm:max-w-md relative overflow-hidden border border-neutral-200 dark:border-neutral-800 max-h-[90vh] flex flex-col">
            {/* Header premium */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 p-6 flex flex-col items-center">
              <button
                className="absolute top-4 right-4 text-white/80 hover:text-white"
                onClick={() => closeUserModal()}
              >
                <X className="h-6 w-6" />
              </button>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center mb-3 shadow-lg border-4 border-white dark:border-neutral-800 overflow-hidden relative">
                {modalUser.avatar ? (
                  <Image
                    src={modalUser.avatar}
                    alt="avatar"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="h-10 w-10 text-white/80 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
              <h2 className="text-xl font-bold text-white mb-1 text-center">
                {modalUser.firstName} {modalUser.lastName}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                  modalUser.role === 'ADMIN'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-white/80'
                }`}
              >
                {modalUser.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
              </span>
            </div>
            {/* Formulario premium */}
            <form
              className="flex-1 p-2 sm:p-4 space-y-2 sm:space-y-4 overflow-y-auto"
              onSubmit={e => {
                e.preventDefault();
                handleSaveUser();
              }}
            >
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">
                  Nombre
                </label>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-pink-400 outline-none"
                  value={modalUser.firstName}
                  onChange={e =>
                    setModalUser({ ...modalUser, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">
                  Apellido
                </label>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-pink-400 outline-none"
                  value={modalUser.lastName}
                  onChange={e =>
                    setModalUser({ ...modalUser, lastName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-pink-400 outline-none"
                  value={modalUser.email}
                  onChange={e =>
                    setModalUser({ ...modalUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">
                  Rol
                </label>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-pink-400 outline-none"
                  value={modalUser.role}
                  onChange={e =>
                    setModalUser({ ...modalUser, role: e.target.value })
                  }
                >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">
                  Estado
                </label>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-pink-400 outline-none"
                  value={modalUser.isActive ? 'activo' : 'inactivo'}
                  onChange={e =>
                    setModalUser({
                      ...modalUser,
                      isActive: e.target.value === 'activo',
                    })
                  }
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              <div className="flex gap-2 sm:gap-3 justify-end pt-2 pb-1 sticky bottom-0 bg-white dark:bg-neutral-900 z-10 rounded-b-3xl">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteUserModal}
                  disabled={modalLoading}
                  className="rounded-xl"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                </Button>
                <Button
                  type="submit"
                  disabled={modalLoading}
                  className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md hover:from-pink-600 hover:to-purple-700"
                >
                  <Edit className="h-4 w-4 mr-2" /> Guardar
                </Button>
              </div>
            </form>
            {modalLoading && (
              <div className="absolute inset-0 bg-white/60 dark:bg-neutral-900/60 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-400 border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
