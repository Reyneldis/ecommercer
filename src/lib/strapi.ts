const { NEXT_PUBLIC_BACKEND_URL, NEXT_PUBLIC_STRAPI_PUBLISHABLE_KEY } =
  process.env;

export async function query(url: string) {
  try {
    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/${url}`, {
      headers: {
        Authorization: `Bearer ${NEXT_PUBLIC_STRAPI_PUBLISHABLE_KEY}`,
      },
    });
    if (!res.ok) throw new Error('Error en la respuesta del servidor');
    return await res.json();
  } catch (error) {
    console.error('Error en query:', error);
    return null;
  }
}
