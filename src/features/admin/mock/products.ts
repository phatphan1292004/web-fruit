export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  sold: number;
  image: string;
  rating: number;
  isVisible: boolean;
  description: string;
  unit: string;
  createdAt: string;
}

export const productCategories = [
  'Tất cả',
  'Trái cây nhiệt đới',
  'Trái cây nhập khẩu',
  'Trái cây Việt Nam',
  'Trái cây sấy',
  'Combo & Set',
];

export const mockProducts: AdminProduct[] = [
  {
    id: 'prod1',
    name: 'Sầu Riêng Monthong Thái',
    category: 'Trái cây nhiệt đới',
    price: 150000,
    originalPrice: 180000,
    stock: 45,
    sold: 342,
    image: 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=300&h=300&fit=crop',
    rating: 4.8,
    isVisible: true,
    description: 'Sầu riêng Monthong Thái Lan tươi ngon, cơm vàng ươm, hạt lép, vị ngọt béo đặc trưng.',
    unit: 'kg',
    createdAt: '2024-01-10',
  },
  {
    id: 'prod2',
    name: 'Xoài Cát Hòa Lộc',
    category: 'Trái cây Việt Nam',
    price: 100000,
    originalPrice: 120000,
    stock: 78,
    sold: 285,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=300&fit=crop',
    rating: 4.7,
    isVisible: true,
    description: 'Xoài cát Hòa Lộc chính vụ, thịt dày, ngọt thanh, thơm đặc trưng.',
    unit: 'kg',
    createdAt: '2024-01-15',
  },
  {
    id: 'prod3',
    name: 'Nho Xanh Mỹ',
    category: 'Trái cây nhập khẩu',
    price: 150000,
    originalPrice: 170000,
    stock: 120,
    sold: 256,
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=300&h=300&fit=crop',
    rating: 4.6,
    isVisible: true,
    description: 'Nho xanh không hạt nhập khẩu từ Mỹ, quả to, giòn ngọt.',
    unit: 'kg',
    createdAt: '2024-02-01',
  },
  {
    id: 'prod4',
    name: 'Dâu Tây Đà Lạt',
    category: 'Trái cây Việt Nam',
    price: 100000,
    originalPrice: 100000,
    stock: 60,
    sold: 198,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop',
    rating: 4.5,
    isVisible: true,
    description: 'Dâu tây Đà Lạt tươi, quả chín đỏ tự nhiên, vị chua ngọt hài hòa.',
    unit: 'hộp 500g',
    createdAt: '2024-02-10',
  },
  {
    id: 'prod5',
    name: 'Bưởi Da Xanh',
    category: 'Trái cây Việt Nam',
    price: 80000,
    originalPrice: 95000,
    stock: 90,
    sold: 176,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=300&h=300&fit=crop',
    rating: 4.4,
    isVisible: true,
    description: 'Bưởi da xanh Bến Tre, múi dày, ngọt thanh, ít hạt.',
    unit: 'trái',
    createdAt: '2024-02-15',
  },
  {
    id: 'prod6',
    name: 'Táo Envy New Zealand',
    category: 'Trái cây nhập khẩu',
    price: 120000,
    originalPrice: 140000,
    stock: 150,
    sold: 165,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop',
    rating: 4.7,
    isVisible: true,
    description: 'Táo Envy nhập khẩu New Zealand, giòn ngọt, thơm tự nhiên.',
    unit: 'kg',
    createdAt: '2024-03-01',
  },
  {
    id: 'prod7',
    name: 'Combo Trái Cây Mix 5 Loại',
    category: 'Combo & Set',
    price: 299000,
    originalPrice: 350000,
    stock: 25,
    sold: 78,
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=300&fit=crop',
    rating: 4.8,
    isVisible: true,
    description: 'Combo 5 loại trái cây tươi ngon: Nho, Táo, Cam, Dâu, Kiwi.',
    unit: 'set',
    createdAt: '2024-06-01',
  },
  {
    id: 'prod8',
    name: 'Xoài Sấy Dẻo',
    category: 'Trái cây sấy',
    price: 85000,
    originalPrice: 95000,
    stock: 100,
    sold: 188,
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=300&h=300&fit=crop',
    rating: 4.4,
    isVisible: true,
    description: 'Xoài sấy dẻo tự nhiên, không đường, giữ nguyên hương vị.',
    unit: 'gói 250g',
    createdAt: '2024-06-10',
  },
];
