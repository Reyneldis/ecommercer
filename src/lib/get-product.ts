import { products as productsData } from './data';

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
  let filteredProducts = productsData;

  // Filtrar por slug específico
  if (productId) {
    filteredProducts = filteredProducts.filter(
      product => product.slug === productId,
    );
  } else if (categoryId) {
    // Si los productos tienen categoría, filtra por categoryId (slug de la categoría)
    filteredProducts = filteredProducts.filter(
      product => product.category === categoryId,
    );
  }

  // Paginación
  let paginatedProducts = filteredProducts;
  let pagination = undefined;
  if (pageSize) {
    const currentPage = Number(page) || 1;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    paginatedProducts = filteredProducts.slice(start, end);
    pagination = {
      page: currentPage,
      pageSize,
      pageCount: Math.ceil(filteredProducts.length / pageSize),
      total: filteredProducts.length,
    };
  }

  return Promise.resolve({
    products: paginatedProducts,
    pagination,
  });
}
