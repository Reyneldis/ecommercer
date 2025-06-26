import { useState, useEffect } from 'react';
export function UseGetFeaturedProduct() {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/products?filter[isFeatured][$eq]=true&populate=*`;
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();
        setResult(json.data);
        setLoading(true);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    })();
  }, [url]);

  return { result, loading, error };
}
