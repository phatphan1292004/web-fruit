import store, { storeClient } from '../../../integrations/store';

export interface BackendCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface BackendProduct {
  _id: string;
  id: number;
  slug: string;
  name: string;
  categoryId: string | BackendCategory;
  price: number;
  oldPrice: number;
  rating: number;
  reviewsCount: number;
  badges: string[];
  stockText: string;
  origin: string;
  weight: string;
  unit: string;
  shelfLife: string;
  storage: string;
  shortDescription: string;
  description: string;
  nutrition: string[];
  storageTips: string[];
  gallery: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const readCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
};

const setupAuth = () => {
  const uid = readCookie('userId');
  if (uid) {
    storeClient.defaults.headers.common['x-user-uid'] = uid;
  }
};

export async function fetchAdminProducts(): Promise<BackendProduct[]> {
  setupAuth();
  const res = await store.get<BackendProduct[]>('/products');
  return res || [];
}

export async function fetchAdminCategories(): Promise<BackendCategory[]> {
  setupAuth();
  const res = await store.get<BackendCategory[]>('/categories');
  return res || [];
}

export async function createAdminProduct(payload: Partial<BackendProduct>): Promise<BackendProduct | null> {
  setupAuth();
  return store.post<BackendProduct, Partial<BackendProduct>>('/products', payload);
}

export async function updateAdminProduct(
  productId: string,
  payload: Partial<BackendProduct>
): Promise<BackendProduct | null> {
  setupAuth();
  return store.put<BackendProduct, Partial<BackendProduct>>(`/products/${productId}`, payload);
}

export async function deleteAdminProduct(productId: string): Promise<any> {
  setupAuth();
  return store.del(`/products/${productId}`);
}
