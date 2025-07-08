import { z } from 'zod';

export const categorySchema = z.object({
  categoryName: z.string().min(1, 'El nombre de la categoría es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  mainImage: z.string().url('La URL de la imagen no es válida').optional(),
  description: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
