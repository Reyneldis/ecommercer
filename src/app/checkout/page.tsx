'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  User,
  ShoppingBag,
  ArrowLeft,
  Shield,
  Truck,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { getStripe } from '@/lib/stripe';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { items } = useCart();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Estados Unidos',
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      router.push('/');
      toast.error('Tu carrito está vacío');
      return;
    }
  }, [isSignedIn, items, router]);

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear Payment Intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingAddress: formData,
          billingAddress: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el pago');
      }

      const { clientSecret } = await response.json();

      // Redirigir a Stripe Checkout
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe no está disponible');
      }
      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
          payment_method_data: {
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zipCode,
                country: formData.country,
              },
            },
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      toast.error('Error al procesar el pago. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            Finalizar Compra
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Completa tu información para procesar el pago de forma segura
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Formulario de Checkout */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 rounded-t-2xl">
                <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <User className="h-6 w-6" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Información Personal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-semibold"
                      >
                        Nombre
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={e =>
                          handleInputChange('firstName', e.target.value)
                        }
                        required
                        className="mt-1 h-12 rounded-xl border-neutral-200 dark:border-neutral-700"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-semibold"
                      >
                        Apellido
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={e =>
                          handleInputChange('lastName', e.target.value)
                        }
                        required
                        className="mt-1 h-12 rounded-xl border-neutral-200 dark:border-neutral-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={e =>
                          handleInputChange('email', e.target.value)
                        }
                        required
                        className="mt-1 h-12 rounded-xl border-neutral-200 dark:border-neutral-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-semibold">
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={e =>
                          handleInputChange('phone', e.target.value)
                        }
                        required
                        className="mt-1 h-12 rounded-xl border-neutral-200 dark:border-neutral-700"
                      />
                    </div>
                  </div>

                  {/* Dirección de Envío */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Dirección de Envío
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="address"
                          className="text-sm font-semibold"
                        >
                          Dirección
                        </Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={e =>
                            handleInputChange('address', e.target.value)
                          }
                          required
                          className="mt-1 h-12 rounded-xl border-green-200 dark:border-green-700"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label
                            htmlFor="city"
                            className="text-sm font-semibold"
                          >
                            Ciudad
                          </Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={e =>
                              handleInputChange('city', e.target.value)
                            }
                            required
                            className="mt-1 h-12 rounded-xl border-green-200 dark:border-green-700"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="state"
                            className="text-sm font-semibold"
                          >
                            Estado
                          </Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={e =>
                              handleInputChange('state', e.target.value)
                            }
                            required
                            className="mt-1 h-12 rounded-xl border-green-200 dark:border-green-700"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="zipCode"
                            className="text-sm font-semibold"
                          >
                            Código Postal
                          </Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={e =>
                              handleInputChange('zipCode', e.target.value)
                            }
                            required
                            className="mt-1 h-12 rounded-xl border-green-200 dark:border-green-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón de Pago */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto h-12 px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200"
                      disabled={loading}
                    >
                      {loading ? 'Procesando...' : 'Pagar ahora'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumen de Compra */}
          <div className="order-1 lg:order-2 mb-6 lg:mb-0">
            <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 rounded-t-2xl">
                <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <ShoppingBag className="h-6 w-6" />
                  Resumen de Compra
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {/* Productos */}
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.slug} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Totales */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Subtotal
                    </span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Envío
                    </span>
                    <span className="font-semibold">
                      ${shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Impuestos
                    </span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Garantías */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Shield className="h-4 w-4 text-green-500" />
                    Pago 100% seguro
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Truck className="h-4 w-4 text-blue-500" />
                    Envío gratis en pedidos +$50
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Garantía de 30 días
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
