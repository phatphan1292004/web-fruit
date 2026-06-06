import { get } from '../../../integrations/store';
import type { FruitProduct } from '../components/types';

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
  reviewsCount?: number;
  reviews?: number;
  badges?: string[];
  stockText?: string;
  origin?: string;
  weight?: string;
  unit?: string;
  shelfLife?: string;
  storage?: string;
  shortDescription?: string;
  description?: string;
  nutrition?: string[];
  storageTips?: string[];
  gallery?: string[];
  image?: string;
  createdAt?: string;
};

const toFruitCategory = (value?: string): FruitProduct['category'] => {
  const normalized = (value ?? '').toLowerCase();
  if (normalized.includes('nhap') || normalized.includes('nhập')) return 'Nhập khẩu';
  if (normalized.includes('huu') || normalized.includes('hữu')) return 'Hữu cơ';
  if (normalized.includes('gio') || normalized.includes('giỏ')) return 'Giỏ quà';
  if (normalized.includes('mua') || normalized.includes('mùa')) return 'Theo mùa';
  return 'Trong nước';
};

const mapProduct = (product: ApiProduct): FruitProduct => ({
  _id: product._id,
  id: product.id,
  slug: product.slug,
  name: product.name,
  category: toFruitCategory(product.categoryId?.name ?? product.category),
  price: product.price,
  originalPrice: product.oldPrice ?? product.price,
  rating: product.rating ?? 0,
  reviews: product.reviewsCount ?? product.reviews ?? 0,
  label: (product.badges?.[0] ?? 'New').toLowerCase().includes('sale') ? 'Sale' : (product.badges?.[0] ?? 'New').toLowerCase().includes('hot') ? 'Hot' : 'New',
  image: product.gallery?.[0] ?? product.image ?? '',
  bestseller: 0,
  createdAt: product.createdAt ?? new Date().toISOString(),
});

type ProductQuery = {
  search?: string;
  categorySlug?: string;
};

export async function fetchCategoryProducts(query: ProductQuery = {}) {
  const data = await get<ApiProduct[]>('/products', query, []);
  return data.map(mapProduct);
}

export async function fetchProductsByCategory(categorySlug: string, search?: string) {
  const data = await get<ApiProduct[]>('/products', { categorySlug, search }, []);
  return data.map(mapProduct);
}
