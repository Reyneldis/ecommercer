export interface Product {
  id: number;
  productName: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  quantity?: number;
}
