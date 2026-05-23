import { store } from '../../integrations';

export type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  label?: 'Hot' | 'Sale' | 'New' | 'Organic';
  image?: string;
  gallery?: string[];
  description?: string;
  shortDescription?: string;
  origin?: string;
  weight?: string;
  unit?: string;
  shelfLife?: string;
  storage?: string;
  nutrition?: string[];
  storageTips?: string[];
  stockText?: string;
  bestseller?: number;
  createdAt?: string;
};

export function fetchProducts(): Promise<ApiProduct[]> {
  return store.get<ApiProduct[]>('/products');
}

export function fetchProductBySlug(slug: string): Promise<ApiProduct> {
  return store.get<ApiProduct>(`/products/${slug}`);
}
