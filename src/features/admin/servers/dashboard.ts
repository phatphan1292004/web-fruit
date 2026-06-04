import store, { storeClient } from '../../../integrations/store';
import { readCookie } from './products';

export interface BackendDashboardStats {
  stats: {
    revenue: { value: number; change: number };
    orders: { value: number; change: number };
    customers: { value: number; change: number };
    products: { value: number; change: number };
  };
  revenueData: { month: string; revenue: number; orders: number }[];
  recentOrders: {
    id: string;
    customer: string;
    product: string;
    total: number;
    status: 'pending' | 'shipping' | 'completed' | 'cancelled';
    date: string;
  }[];
  topProducts: {
    id: string;
    name: string;
    image: string;
    sold: number;
    revenue: number;
    category: string;
  }[];
}

const setupAuth = () => {
  const uid = readCookie('userId');
  if (uid) {
    storeClient.defaults.headers.common['x-user-uid'] = uid;
  }
};

export async function fetchDashboardStats(): Promise<BackendDashboardStats | null> {
  setupAuth();
  return store.get<BackendDashboardStats>('/dashboard');
}
