export type ProductBadge = 'Hot' | 'Sale' | 'New' | 'Organic';

export type ProductDetail = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviewsCount: number;
  badges: ProductBadge[];
  stockText: string;
  origin: string;
  weight: string;
  unit: string;
  shelfLife: string;
  storage: string;
  shortDescription: string;
  description: string;
  nutrition: string[];
  storageTips: string[];
  gallery: string[];
};

export type ProductReview = {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
};
