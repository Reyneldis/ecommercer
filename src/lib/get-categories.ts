import { query } from './strapi';
type RawCategory = {
  categoryName: string;
  slug: string;
  mainImage: { url: string };
  description?: string;
};

const { STRAPI_HOST } = process.env;
export function getCategories() {
  return query(
    'categories?fields[0]=categoryName&fields[1]=slug&populate[mainImage][fields][0]=url',
  ).then(res => {
    const categories = res.data;
    if (!categories || !Array.isArray(categories)) {
      return [];
    }
    return categories.map((category: RawCategory) => {
      const { categoryName, slug, mainImage: rawImage } = category;
      const image = `${STRAPI_HOST}${rawImage.url}`;
      return { categoryName, slug, image };
    });
  });
}
