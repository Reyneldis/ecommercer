import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductInput } from '@/schemas/productSchema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface ProductFormProps {
  initialValues?: Partial<ProductInput>;
  categories: { id: string; categoryName: string }[];
  onSubmit: (data: ProductInput) => void | Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

export function ProductForm({
  initialValues,
  categories,
  onSubmit,
  loading,
  submitLabel = 'Guardar',
}: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState(
    initialValues?.images && initialValues.images[0]?.url
      ? initialValues.images[0].url
      : '',
  );
  const [imageError, setImageError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
      setImageUrl(
        initialValues.images && initialValues.images[0]?.url
          ? initialValues.images[0].url
          : '',
      );
      setImageError(false);
    }
  }, [initialValues, reset]);

  // Actualizar el campo images cuando cambia la URL
  useEffect(() => {
    setValue('images', imageUrl ? [{ url: imageUrl }] : []);
    setImageError(false);
  }, [imageUrl, setValue]);

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Producto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <Input {...register('productName')} placeholder="Ej: Licuadora" />
            {errors.productName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.productName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <Input {...register('slug')} placeholder="ejemplo-producto" />
            {errors.slug && (
              <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio *</label>
            <Input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <Input
              {...register('description')}
              placeholder="Descripción del producto"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Categoría *
            </label>
            <select
              {...register('categoryId')}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado *</label>
            <select
              {...register('status')}
              className="w-full border rounded px-3 py-2"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              URL de la imagen principal
            </label>
            <Input
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Pega la URL de la imagen principal del producto
            </p>
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageError ? '/img/placeholder-product.jpg' : imageUrl}
                  alt="Previsualización"
                  className="w-full max-h-40 object-contain rounded border"
                  onError={() => setImageError(true)}
                />
                {imageError && (
                  <p className="text-xs text-red-500 mt-1">
                    No se pudo cargar la imagen. Mostrando placeholder.
                  </p>
                )}
              </div>
            )}
            {errors.images && (
              <p className="text-red-500 text-xs mt-1">
                {errors.images.message as string}
              </p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? 'Guardando...' : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
