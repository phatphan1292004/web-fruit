import store, { storeClient } from '../../../integrations/store';
import { readCookie } from './products';

export interface BackendAnalytics {
  monthlyRevenue: {
    month: string;
    revenue: number;
    profit: number;
  }[];
  orderStatusData: {
    name: string;
    value: number;
    color: string;
  }[];
  topSellingProducts: {
    name: string;
    sold: number;
    revenue: number;
  }[];
  userGrowthData: {
    month: string;
    newUsers: number;
    totalUsers: number;
  }[];
}

const setupAuth = () => {
  const uid = readCookie('userId');
  if (uid) {
    storeClient.defaults.headers.common['x-user-uid'] = uid;
  }
};

export async function fetchAdminAnalytics(): Promise<BackendAnalytics | null> {
  setupAuth();
  return store.get<BackendAnalytics>('/admin/analytics');
}
