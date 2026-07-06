import store, { storeClient } from '../../../integrations/store';
import { readCookie } from './products';

export interface BackendReview {
  _id: string;
  productId?: {
    _id: string;
    name: string;
    gallery?: string[];
    image?: string;
  } | string;
  firebaseUid: string;
  displayName: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  isHidden: boolean;
  reply?: string;
  adminSeen?: boolean;
  createdAt: string;
  updatedAt: string;
}

const setupAuth = () => {
  const uid = readCookie('userId');
  if (uid) {
    storeClient.defaults.headers.common['x-user-uid'] = uid;
  }
};

export async function fetchAdminReviews(): Promise<BackendReview[]> {
  setupAuth();
  const res = await store.get<BackendReview[]>('/reviews');
  return res || [];
}

export async function updateAdminReview(
  reviewId: string,
  payload: { isHidden?: boolean; reply?: string; adminSeen?: boolean }
): Promise<BackendReview | null> {
  setupAuth();
  return store.put<BackendReview, { isHidden?: boolean; reply?: string; adminSeen?: boolean }>(
    `/reviews/${reviewId}`,
    payload
  );
}

export async function deleteAdminReview(reviewId: string): Promise<any> {
  setupAuth();
  return store.del(`/reviews/${reviewId}`);
}
