import store from '../../../integrations/store';
import type { ProductReview } from '../components/types';

export type ApiReview = {
  _id: string;
  productId: string;
  firebaseUid: string;
  displayName: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export async function fetchReviewsByProductId(productId: string): Promise<ProductReview[]> {
  const reviews = await store.get<ApiReview[]>(`/reviews/product/${productId}`);
  if (!reviews || !Array.isArray(reviews)) return [];
  
  return reviews.map((rev) => ({
    id: rev._id as any,
    name: rev.displayName,
    avatar: rev.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${rev.displayName}`,
    rating: rev.rating,
    date: new Date(rev.createdAt).toLocaleDateString('vi-VN'),
    content: rev.comment,
  }));
}

export async function createReview(data: {
  productId: string;
  firebaseUid: string;
  rating: number;
  comment: string;
}): Promise<ApiReview> {
  return store.post<ApiReview, typeof data>('/reviews', data);
}
