'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  ShoppingBag,
  Mail,
  Truck,
  ArrowRight,
  Home,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface OrderDetails {
  id: string;
  status: string;
  estimatedDelivery: Date;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const paymentIntent = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get(
    'payment_intent_client_secret',
  );

  useEffect(() => {
    if (paymentIntent) {
      // Aquí podrías verificar el estado del pago con tu API
      setOrderDetails({
        id: paymentIntent,
        status: 'completed',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      });

      // Limpiar carrito después de pago exitoso
      clearCart();
      toast.success('¡Pago procesado exitosamente!');
    }
    setLoading(false);
  }, [paymentIntent, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-900 dark:via-neutral-800 dark:to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Verificando tu pago...
          </p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-red-900 dark:via-neutral-800 dark:to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
            No se encontró la orden
          </h1>
          <p className="text-red-600 dark:text-red-400 mb-6">
            Parece que hubo un problema con tu pago.
          </p>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Volver a la tienda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-900 dark:via-neutral-800 dark:to-emerald-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header de Éxito */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-green-800 dark:text-green-200 mb-4">
              ¡Pago Exitoso!
            </h1>
            <p className="text-xl text-green-600 dark:text-green-400 mb-2">
              Tu orden ha sido procesada correctamente
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              Número de orden: #{orderDetails.id}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Detalles de la Orden */}
            <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6" />
                  Detalles de la Orden
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Estado:
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                      Pagado
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Fecha:
                    </span>
                    <span className="font-semibold">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Método de pago:
                    </span>
                    <span className="font-semibold">Tarjeta de crédito</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Envío estimado:
                    </span>
                    <span className="font-semibold">
                      {orderDetails.estimatedDelivery.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Próximos Pasos */}
            <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-t-2xl">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <Truck className="h-6 w-6" />
                  Próximos Pasos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        1
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Confirmación por email
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Recibirás un email con los detalles de tu compra
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Procesamiento
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Tu orden será procesada y preparada para envío
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Envío
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Recibirás un email con el número de seguimiento
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acciones */}
          <div className="mt-12 text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/account/orders">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
                  <Package className="h-5 w-5 mr-2" />
                  Ver Mis Pedidos
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>

              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 font-semibold px-8 py-3 rounded-xl transition-all duration-300"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Continuar Comprando
                </Button>
              </Link>
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              ¿Tienes preguntas?{' '}
              <Link
                href="/contact"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Contáctanos
              </Link>
            </p>
          </div>

          {/* Información Adicional */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700">
              <Mail className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Email de Confirmación
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Recibirás un email con todos los detalles de tu compra
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700">
              <Truck className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Envío Rápido
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Tu pedido será enviado en 1-2 días hábiles
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Garantía
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                30 días de garantía en todos nuestros productos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
