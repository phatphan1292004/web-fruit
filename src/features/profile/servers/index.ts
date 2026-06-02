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
