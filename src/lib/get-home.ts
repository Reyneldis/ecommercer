import { query } from './strapi';
const { STRAPI_HOST } = process.env;

export function getHomeInfo() {
  return query('home?populate=cover').then(res => {
    if (!res.data) {
      return { title: '', descriptionn: '', image: '' };
    }
    const { title, descriptionn, cover } = res.data;
    const image = cover && cover.url ? `${STRAPI_HOST}${cover.url}` : '';
    return { title, descriptionn, image };
  });
}
