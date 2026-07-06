import { get } from '../../../integrations/store';

export type HomeProduct = {
  _id?: string;
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  image?: string;
  badge?: 'Hot' | 'Sale' | 'New' | 'Organic';
};

type ApiCategoryRef = {
  slug?: string;
  name?: string;
};

type ApiProduct = {
  _id?: string;
  id: number;
  slug: string;
  name: string;
  category?: string;
  categoryId?: ApiCategoryRef;
  price: number;
  oldPrice?: number;
  rating?: number;
  badges?: string[];
  gallery?: string[];
  image?: string;
};

const toFruitCategory = (value?: string): string => {
  const normalized = (value ?? '').toLowerCase();
  if (normalized.includes('nhap') || normalized.includes('nhập')) return 'Nhập khẩu';
  if (normalized.includes('huu') || normalized.includes('hữu')) return 'Hữu cơ';
  if (normalized.includes('gio') || normalized.includes('giỏ')) return 'Giỏ quà';
  if (normalized.includes('mua') || normalized.includes('mùa')) return 'Theo mùa';
  return 'Trong nước';
};

const mapProduct = (product: ApiProduct): HomeProduct => ({
  _id: product._id,
  id: product.id,
  slug: product.slug,
  name: product.name,
  category: toFruitCategory(product.categoryId?.name ?? product.category),
  price: product.price,
  originalPrice: product.oldPrice ?? product.price,
  rating: product.rating ?? 0,
  image: product.gallery?.[0] ?? product.image ?? '',
  badge: product.badges?.[0] as any ?? 'New',
});

export async function fetchHomeProducts(categorySlug?: string) {
  if (categorySlug) {
    const data = await get<ApiProduct[]>(`/products/category/${categorySlug}`, {}, []);
    return data.map(mapProduct);
  }

  const data = await get<ApiProduct[]>('/products', {}, []);
  return data.map(mapProduct);
}

export async function fetchRecommendedProducts(userId?: string | null, historySlugs?: string[]) {
  const params: Record<string, string> = {};
  if (userId) {
    params.userId = userId;
  }
  if (historySlugs && historySlugs.length > 0) {
    params.history = historySlugs.join(',');
  }
  const data = await get<ApiProduct[]>('/products/recommendations', params, []);
  return data.map(mapProduct);
}

export type HomeReview = {
  _id: string;
  productId?: {
    name?: string;
  };
  displayName: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export async function fetchPublicReviews(): Promise<HomeReview[]> {
  return get<HomeReview[]>('/reviews/public', {}, []);
}
