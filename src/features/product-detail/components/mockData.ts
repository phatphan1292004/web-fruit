import type { ProductDetail, ProductReview } from './types';

export const productDetails: ProductDetail[] = [
  {
    id: 1,
    slug: 'tao-envy-new-zealand',
    name: 'Táo Envy New Zealand',
    category: 'Trái cây nhập khẩu',
    price: 229000,
    oldPrice: 289000,
    rating: 4.9,
    reviewsCount: 128,
    badges: ['Hot', 'Sale', 'Organic'],
    stockText: 'Còn hàng',
    origin: 'New Zealand',
    weight: '1kg',
    unit: 'Hộp',
    shelfLife: '7 - 10 ngày',
    storage: 'Bảo quản ngăn mát 2 - 5°C',
    shortDescription: 'Táo Envy New Zealand giòn ngọt, mọng nước, được tuyển chọn từ nông trại chất lượng cao và đóng gói sang trọng.',
    description:
      'Táo Envy New Zealand nổi tiếng với màu sắc đẹp, độ giòn tự nhiên và vị ngọt cân bằng. Sản phẩm được tuyển chọn cẩn thận, phù hợp làm quà tặng cao cấp hoặc dùng hằng ngày cho gia đình yêu thích lối sống lành mạnh.',
    nutrition: [
      'Vitamin C hỗ trợ đề kháng',
      'Chất xơ giúp tiêu hóa tốt hơn',
      'Chất chống oxy hóa tự nhiên',
      'Ít calo, phù hợp chế độ lành mạnh',
    ],
    storageTips: [
      'Không rửa trước khi cất tủ lạnh',
      'Bọc kín trong túi giấy hoặc hộp đựng',
      'Tránh để gần thực phẩm có mùi mạnh',
      'Dùng ngon nhất trong 7 ngày sau khi mua',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6fd6c?q=80&w=1400&auto=format&fit=crop',
    ],
  },
];

export const productReviews: ProductReview[] = [
  {
    id: 1,
    name: 'Ngọc Anh',
    avatar: 'https://i.pravatar.cc/120?img=32',
    rating: 5,
    date: '2026-05-10',
    content: 'Táo rất tươi, giòn và đóng gói cực kỳ đẹp. Giao hàng nhanh, xứng đáng với mức giá premium.',
  },
  {
    id: 2,
    name: 'Minh Tuấn',
    avatar: 'https://i.pravatar.cc/120?img=12',
    rating: 5,
    date: '2026-05-08',
    content: 'Mình mua làm quà tặng, hộp sang trọng và sản phẩm ngon hơn mong đợi. Sẽ đặt lại.',
  },
  {
    id: 3,
    name: 'Thu Hằng',
    avatar: 'https://i.pravatar.cc/120?img=45',
    rating: 4,
    date: '2026-05-03',
    content: 'Táo giòn, ngọt dịu, hợp khẩu vị gia đình mình. Chỉ mong có thêm nhiều lựa chọn size hơn.',
  },
];
