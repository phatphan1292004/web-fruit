export type FruitCategory =
  | 'Trong nước'
  | 'Nhập khẩu'
  | 'Giỏ quà'
  | 'Hữu cơ'
  | 'Theo mùa';

export type PriceRange =
  | 'all'
  | 'under-100'
  | '100-300'
  | '300-500'
  | 'over-500';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'bestseller' | 'newest';

export type FruitProduct = {
  id: number;
  slug: string;
  name: string;
  category: FruitCategory;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  label: 'Hot' | 'Sale' | 'New';
  image: string;
  bestseller: number;
  createdAt: string;
};
