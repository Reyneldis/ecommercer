const { STRAPI_HOST, STRAPI_TOKEN } = process.env;

export async function query(url: string) {
  try {
    const res = await fetch(`${STRAPI_HOST}/api/${url}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });
    if (!res.ok) throw new Error('Error en la respuesta del servidor');
    return await res.json();
  } catch (error) {
    console.error('Error en query:', error);
    return null;
  }
}
