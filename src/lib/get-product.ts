import { query } from './strapi';

const { STRAPI_HOST } = process.env;

interface Product {
  slug: string;
  productName: string;
  price: number;
  images: Array<{ url: string }>;
  description: string;
}

export function getProduct({
  categoryId,
  productId,
  pageSize,
  page,
}: {
  categoryId?: string;
  productId?: string;
  pageSize?: number;
  page?: string | number;
}) {
  let url = 'products?populate=images';

  // Si hay productId, buscar por slug específico
  if (productId) {
    url = `products?filters[slug][$eq]=${productId}&populate=images`;
  }
  // Si hay categoryId, buscar por categoría
  else if (categoryId) {
    url = `products?filters[category][slug][$contains]=${categoryId}&populate=images`;
  }

  // Agregar paginación solo si no es búsqueda por ID específico
  if (!productId) {
    if (page) url += `&pagination[page]=${page}`;
    if (pageSize) url += `&pagination[pageSize]=${pageSize}`;
  }

  return query(url).then(res => {
    const { data, meta } = res;
    const products = data.map((product: Product) => {
      const {
        slug,
        productName,
        price,
        images: rawImages,
        description,
      } = product;
      const image = `${STRAPI_HOST}${rawImages[0].url}`;
      return { image, productName, price, slug, description };
    });
    return { products, pagination: meta?.pagination };
  });
}
