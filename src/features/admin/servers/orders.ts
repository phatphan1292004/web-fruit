import store, { storeClient } from '../../../integrations/store';
import { readCookie } from './products';

export interface BackendOrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  image?: string; // fallback if needed
}

export interface BackendOrder {
  _id: string;
  firebaseUid?: string;
  customer: {
    name: string;
    phone: string;
  };
  address: string;
  note?: string;
  paymentMethod: string;
  status: 'pending' | 'shipping' | 'completed' | 'cancelled';
  items: BackendOrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

const setupAuth = () => {
  const uid = readCookie('userId');
  if (uid) {
    storeClient.defaults.headers.common['x-user-uid'] = uid;
  }
};

export async function fetchAdminOrders(): Promise<BackendOrder[]> {
  setupAuth();
  const res = await store.get<BackendOrder[]>('/orders');
  return res || [];
}

export async function updateAdminOrderStatus(
  orderId: string,
  status: string
): Promise<BackendOrder | null> {
  setupAuth();
  return store.patch<BackendOrder, { status: string }>(`/orders/${orderId}/status`, { status });
}

export async function deleteAdminOrder(orderId: string): Promise<any> {
  setupAuth();
  return store.del(`/orders/${orderId}`);
}
