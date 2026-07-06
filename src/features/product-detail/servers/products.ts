import { get, post } from '../../../integrations/store';

export async function trackProductActivity(userId: string | null, slug: string, action: 'view' | 'click' = 'view') {
  return post<any, { userId: string | null; slug: string; action: string }>('/products/track', {
    userId,
    slug,
    action,
  });
}

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
  createdAt?: string;
};

export async function fetchProductDetail(slug: string) {
  return get<ApiProduct>(`/products/${slug}`);
}

export async function fetchRelatedProducts(slug: string) {
  return get<ApiProduct[]>(`/products/${slug}/related`);
}
