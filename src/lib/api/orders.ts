import { store } from '../../integrations';

export type OrderItemInput = {
  productId: string;
  quantity: number;
};

export type OrderPreviewPayload = {
  items: OrderItemInput[];
  shippingFee: number;
  discount: number;
};

export type OrderPreviewItem = {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

export type OrderPreview = {
  items: OrderPreviewItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
};

export type OrderCustomer = {
  name: string;
  phone: string;
};

export type OrderCreatePayload = {
  firebaseUid?: string;
  customer: OrderCustomer;
  address: string;
  note?: string;
  paymentMethod: string;
  items: OrderItemInput[];
  shippingFee: number;
  discount: number;
};

export type OrderResponse = {
  _id: string;
  firebaseUid?: string;
  customer: OrderCustomer;
  address: string;
  note?: string;
  paymentMethod: string;
  status: string;
  items: OrderPreviewItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function previewOrder(payload: OrderPreviewPayload) {
  return store.post<OrderPreview, OrderPreviewPayload>('/orders/preview', payload);
}

export function createOrder(payload: OrderCreatePayload) {
  return store.post<OrderResponse, OrderCreatePayload>('/orders', payload);
}

export function verifyVNPay(queryString: string) {
  return store.get<{ success: boolean; message?: string; orderId?: string; total?: number }>(`/orders/vnpay/verify?${queryString}`);
}
