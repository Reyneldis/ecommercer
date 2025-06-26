import { Suspense } from 'react';
import ProductsPage from './ProductsPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando productos...</div>}>
      <ProductsPage />
    </Suspense>
  );
}
