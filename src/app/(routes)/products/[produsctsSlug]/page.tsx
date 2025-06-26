import { getProduct } from '@/lib/get-product';
import { ProductActions } from '@/components/shared/ProductActions/ProductActions';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface ProductPageProps {
  params: Promise<{ produsctsSlug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { produsctsSlug } = await params;

  const { products } = await getProduct({ productId: produsctsSlug });
  const product = products?.[0];

  if (!product) return notFound();

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center py-16">
      <div className="max-w-4xl w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-10">
        {/* Imagen */}
        <div className="flex-1 flex items-center justify-center">
          <Image
            src={product.image}
            alt={product.productName}
            width={320}
            height={384}
            className="w-80 h-96 object-cover rounded-xl shadow-md"
            priority={false}
          />
        </div>
        {/* Info */}
        <div className="flex-1 flex flex-col justify-between gap-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              {product.productName}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-6">
              {product.description}
            </p>
            <p className="text-2xl font-semibold text-primary mb-2">
              ${product.price}
            </p>
          </div>
          <ProductActions product={product} />
        </div>
      </div>
    </main>
  );
}
