'use client';

import { useAdmin } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info,
  Bell,
  Sparkles,
  Zap,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default async function TestNotificationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();

  const resolvedParams = await params;
  const categoryId = resolvedParams.categoryId;
  const resolvedSearchParams = await searchParams;

  // Redirigir si no es admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const testNotifications = () => {
    // Notificación de éxito
    toast.success('¡Operación completada exitosamente! Los cambios se han guardado correctamente.');

    // Notificación de error después de 1 segundo
    setTimeout(() => {
      toast.error('Ha ocurrido un error inesperado. Por favor, intenta nuevamente.');
    }, 1000);

    // Notificación de advertencia después de 2 segundos
    setTimeout(() => {
      toast.warning('Ten cuidado con esta acción. Asegúrate de revisar todos los detalles.');
    }, 2000);

    // Notificación de información después de 3 segundos
    setTimeout(() => {
      toast.info('Esta es una notificación informativa con el nuevo diseño premium.');
    }, 3000);
  };

  const testWithActions = () => {
    toast.success('¿Quieres deshacer esta acción? Puedes revertir los cambios realizados.', {
      action: {
        label: 'Deshacer',
        onClick: () => {
          toast.info('Acción deshecha correctamente. Los cambios han sido revertidos.');
        },
      },
    });
  };

  const testLongMessage = () => {
    toast.info('Esta es una notificación con un mensaje muy largo que debería envolverse correctamente en múltiples líneas para asegurar que sea legible en todos los dispositivos. El nuevo diseño es mucho más atractivo y moderno.', {
      duration: 6000,
    });
  };

  const testProductNotifications = () => {
    // Simular notificaciones del panel de productos
    toast.success('Producto "Licuadora Profesional" agregado correctamente al catálogo.');

    setTimeout(() => {
      toast.success('Producto "Cafetera Eléctrica" actualizado con éxito.');
    }, 1000);

    setTimeout(() => {
      toast.info('3 productos han sido destacados en el catálogo.');
    }, 2000);

    setTimeout(() => {
      toast.error('Producto "Refrigerador" eliminado del catálogo.');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-8 gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
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
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  🔔 Sistema de Notificaciones
                </h1>
                <p className="text-lg lg:text-xl text-purple-100">
                  Prueba las nuevas notificaciones premium
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Información */}
          <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <Sparkles className="h-6 w-6" />
                Nuevo Sistema de Notificaciones Premium
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Hemos rediseñado completamente el sistema de notificaciones con un estilo moderno, 
                gradientes atractivos y animaciones suaves para una mejor experiencia de usuario.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">✨ Nuevas Características:</h4>
                  <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
                    <li>• Gradientes modernos y atractivos</li>
                    <li>• Iconos con fondos circulares</li>
                    <li>• Animaciones suaves y efectos hover</li>
                    <li>• Diseño responsive mejorado</li>
                    <li>• Sombras y efectos de profundidad</li>
                    <li>• Mejor legibilidad y contraste</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🎨 Tipos de Notificaciones:</h4>
                  <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
                    <li>
                      • <span className="text-green-600 font-medium">Success</span> - Verde esmeralda
                    </li>
                    <li>
                      • <span className="text-red-600 font-medium">Error</span> - Rojo rosa
                    </li>
                    <li>
                      • <span className="text-yellow-600 font-medium">Warning</span> - Amarillo naranja
                    </li>
                    <li>
                      • <span className="text-blue-600 font-medium">Info</span> - Azul púrpura
                    </li>
                    <li>
                      • <span className="text-neutral-600 font-medium">Default</span> - Neutro
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de Prueba */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Prueba Básica
                </CardTitle>
              </div>
              <CardContent className="p-6 space-y-3">
                <Button onClick={testNotifications} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Probar Todas las Notificaciones
                </Button>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Muestra una secuencia de notificaciones de diferentes tipos con el nuevo diseño
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Con Acciones
                </CardTitle>
              </div>
              <CardContent className="p-6 space-y-3">
                <Button
                  onClick={testWithActions}
                  variant="outline"
                  className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Notificación con Acción
                </Button>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Notificación que no se auto-cierra y tiene botón de acción interactivo
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Mensaje Largo
                </CardTitle>
              </div>
              <CardContent className="p-6 space-y-3">
                <Button
                  onClick={testLongMessage}
                  variant="outline"
                  className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-semibold"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Probar Mensaje Largo
                </Button>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Prueba cómo se ve una notificación con texto extenso
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Simulación de Productos
                </CardTitle>
              </div>
              <CardContent className="p-6 space-y-3">
                <Button
                  onClick={testProductNotifications}
                  variant="outline"
                  className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-semibold"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Simular Panel de Productos
                </Button>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Notificaciones típicas del panel de administración de productos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pruebas Individuales */}
          <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 p-4">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Pruebas Individuales
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button
                  onClick={() =>
                    toast.success('¡Operación exitosa!', {
                      description: '¡Operación exitosa!',
                      title: '🎉 Éxito',
                      variant: 'success',
                    })
                  }
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
                >
                  Success
                </Button>
                <Button
                  onClick={() =>
                    toast.error('Algo salió mal', {
                      description: 'Algo salió mal',
                      title: '❌ Error',
                      variant: 'error',
                    })
                  }
                  size="sm"
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold"
                >
                  Error
                </Button>
                <Button
                  onClick={() =>
                    toast.warning('Ten cuidado con esta acción', {
                      description: 'Ten cuidado con esta acción',
                      title: '⚠️ Advertencia',
                      variant: 'warning',
                    })
                  }
                  size="sm"
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold"
                >
                  Warning
                </Button>
                <Button
                  onClick={() =>
                    toast.info('Información importante', {
                      description: 'Información importante',
                      title: 'ℹ️ Info',
                      variant: 'info',
                    })
                  }
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
                >
                  Info
                </Button>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3 text-center">
                Prueba cada tipo individualmente
              </p>
            </CardContent>
          </Card>

          {/* Instrucciones de Uso */}
          <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-4">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="h-5 w-5" />
                Cómo Usar
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Importar el hook:</h4>
                  <code className="block bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg text-xs font-mono">
                    import {'{'}toast{'}'} from 'sonner';
                  </code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usar en el componente:</h4>
                  <code className="block bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg text-xs font-mono">
                    toast.success('Mensaje de éxito');
                  </code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Con opciones avanzadas:</h4>
                  <code className="block bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg text-xs font-mono">
                    toast.success('Mensaje', {
                      description: 'Título',
                      duration: 5000,
                      action: {'{'}<br />
                      &nbsp;&nbsp;label: 'Deshacer',<br />
                      &nbsp;&nbsp;onClick: () => console.log('Deshacer')<br />
                      {'}'}
                    });
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
