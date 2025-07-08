import { z } from 'zod';

const variantSchema = z.object({
  name: z.string().min(1, 'El nombre de la variante es requerido'),
  price: z.preprocess(
    val => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().nonnegative('El precio debe ser positivo'),
  ),
  stock: z.number().int().min(0, 'El stock no puede ser negativo').optional(),
  attributes: z.record(z.any()).optional(),
});

const imageSchema = z.object({
  url: z.string().url('La URL de la imagen no es válida'),
  alt: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

export const productSchema = z.object({
  slug: z.string().min(1, 'El slug es requerido'),
  productName: z.string().min(1, 'El nombre es requerido'),
  price: z.preprocess(
    val => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().nonnegative('El precio debe ser positivo'),
  ),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  features: z.array(z.string()).optional(),
  variants: z.array(variantSchema).optional(),
  images: z.array(imageSchema).optional(),
  status: z.enum(['active', 'inactive']),
});

export type ProductInput = z.infer<typeof productSchema>;
