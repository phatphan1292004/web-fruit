import store from "../../../integrations/store";

export type ApiUser = {
  id?: number;
  firebaseUid?: string;
  displayName?: string;
  name?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  memberSince?: number;
  avatarUrl?: string;
  avatar?: string;
  createdAt?: string;
  role?: string;
};

export type FavoritePayload = {
  productId: string;
};

export type ApiFavoriteProduct = {
  id?: number | string;
  _id?: string;
  productId?: string;
  name: string;
  price: number;
  rating?: number;
  image?: string;
};

export async function fetchUserByFirebaseUid(firebaseUid: string) {
  return store.get<ApiUser>(`/users/${firebaseUid}`);
}

export async function addFavoriteProduct(
  firebaseUid: string,
  payload: FavoritePayload
) {
  return store.post(`/users/${firebaseUid}/favorites`, payload);
}

export async function fetchFavoriteProducts(firebaseUid: string) {
  return store.get<ApiFavoriteProduct[]>(`/users/${firebaseUid}/favorites`);
}

export type ApiOrder = {
  _id: string;
  firebaseUid?: string;
  paymentMethod?: string;
  status?: string;
  total?: number;
  customer?: {
    name?: string;
    phone?: string;
  };
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: {
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    totalPrice?: number;
  }[];
};

export type UpdateOrderPayload = {
  address?: string;
  customer?: {
    name?: string;
    phone?: string;
  };
};

export async function fetchOrderById(orderId: string) {
  return store.get<ApiOrder>(`/orders/${orderId}`);
}

export async function fetchOrdersByFirebaseUid(firebaseUid: string) {
  if (!firebaseUid) return [] as ApiOrder[];
  return store.get<ApiOrder[]>('/orders', { firebaseUid }) as Promise<ApiOrder[]>;
}

export async function updateOrder(
  orderId: string,
  payload: UpdateOrderPayload,
  firebaseUid?: string
) {
  const url = firebaseUid
    ? `/orders/${orderId}?firebaseUid=${encodeURIComponent(firebaseUid)}`
    : `/orders/${orderId}`;
  return store.patch<ApiOrder, UpdateOrderPayload>(url, payload);
}
