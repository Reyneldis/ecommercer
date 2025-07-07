import { useState, useEffect } from 'react';
import { getStripe } from '@/lib/stripe';
import { toast } from 'sonner';

interface UseStripeProps {
  clientSecret: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useStripe({
  clientSecret,
  onSuccess,
  onError,
}: UseStripeProps) {
  const [loading, setLoading] = useState(false);
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    const loadStripe = async () => {
      const stripeInstance = await getStripe();
      setStripe(stripeInstance);
    };
    loadStripe();
  }, []);

  const confirmPayment = async (paymentMethodData?: any) => {
    if (!stripe || !clientSecret) {
      toast.error('Stripe no está disponible');
      return;
    }

    setLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
          payment_method_data: paymentMethodData,
        },
      });

      if (error) {
        console.error('Payment error:', error);
        toast.error(error.message || 'Error al procesar el pago');
        onError?.(error.message);
      } else {
        onSuccess?.();
      }
    } catch (error) {
      console.error('Stripe error:', error);
      toast.error('Error inesperado al procesar el pago');
      onError?.('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return {
    stripe,
    loading,
    confirmPayment,
  };
}
