export interface ProducType {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  stock: number;
}

export interface ProductFull {
  slug: string;
  productName: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  features?: string[];
  variants?: Array<Record<string, string | number>>;
}
