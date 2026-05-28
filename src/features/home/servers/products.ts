import store from '../../../integrations/store';

export type HomeProduct = {
  _id?: string;
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  rating?: number;
  image?: string;
  badge?: 'Hot' | 'Sale' | 'New' | 'Organic';
};

export async function fetchHomeProducts() {
  return store.get<HomeProduct[]>('/products');
}
