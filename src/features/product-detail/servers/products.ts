import { get } from '../../../integrations/store';

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
};

export async function fetchProductDetail(slug: string) {
  return get<ApiProduct>(`/products/${slug}`);
}
