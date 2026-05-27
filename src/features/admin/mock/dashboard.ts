export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  sold: number;
  revenue: number;
  category: string;
}

export const dashboardStats: DashboardStat[] = [
  {
    id: 'revenue',
    label: 'Tổng doanh thu',
    value: '₫248.500.000',
    change: 12.5,
    changeLabel: 'so với tháng trước',
    icon: 'revenue',
    color: 'emerald',
  },
  {
    id: 'orders',
    label: 'Đơn hàng',
    value: '1.284',
    change: 8.2,
    changeLabel: 'so với tháng trước',
    icon: 'orders',
    color: 'blue',
  },
  {
    id: 'users',
    label: 'Khách hàng',
    value: '3.842',
    change: 5.1,
    changeLabel: 'so với tháng trước',
    icon: 'users',
    color: 'orange',
  },
  {
    id: 'products',
    label: 'Sản phẩm',
    value: '8',
    change: 0.0,
    changeLabel: 'tất cả hoạt động',
    icon: 'products',
    color: 'purple',
  },
];

export const revenueData: RevenueData[] = [
  { month: 'T1', revenue: 18500000, orders: 95 },
  { month: 'T2', revenue: 21200000, orders: 108 },
  { month: 'T3', revenue: 19800000, orders: 102 },
  { month: 'T4', revenue: 23500000, orders: 118 },
  { month: 'T5', revenue: 25100000, orders: 125 },
  { month: 'T6', revenue: 22800000, orders: 112 },
  { month: 'T7', revenue: 27300000, orders: 136 },
  { month: 'T8', revenue: 24600000, orders: 122 },
  { month: 'T9', revenue: 26900000, orders: 134 },
  { month: 'T10', revenue: 28400000, orders: 140 },
  { month: 'T11', revenue: 31200000, orders: 155 },
  { month: 'T12', revenue: 29800000, orders: 148 },
];

export const recentOrders: RecentOrder[] = [
  {
    id: 'ORD-2024-001',
    customer: 'Nguyễn Văn An',
    product: 'Xoài Cát Hòa Lộc',
    total: 450000,
    status: 'delivered',
    date: '2024-12-15',
  },
  {
    id: 'ORD-2024-002',
    customer: 'Trần Thị Bình',
    product: 'Sầu Riêng Monthong Thái',
    total: 890000,
    status: 'shipped',
    date: '2024-12-15',
  },
  {
    id: 'ORD-2024-003',
    customer: 'Lê Hoàng Cường',
    product: 'Bưởi Da Xanh',
    total: 320000,
    status: 'processing',
    date: '2024-12-14',
  },
  {
    id: 'ORD-2024-004',
    customer: 'Phạm Minh Đức',
    product: 'Dưa Hấu Không Hạt',
    total: 150000,
    status: 'pending',
    date: '2024-12-14',
  },
  {
    id: 'ORD-2024-005',
    customer: 'Hoàng Thị Em',
    product: 'Nho Xanh Mỹ',
    total: 680000,
    status: 'cancelled',
    date: '2024-12-13',
  },
];

export const topProducts: TopProduct[] = [
  {
    id: 'prod1',
    name: 'Sầu Riêng Monthong Thái',
    image: 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=100&h=100&fit=crop',
    sold: 342,
    revenue: 51300000,
    category: 'Trái cây nhiệt đới',
  },
  {
    id: 'prod2',
    name: 'Xoài Cát Hòa Lộc',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=100&h=100&fit=crop',
    sold: 285,
    revenue: 28500000,
    category: 'Trái cây Việt Nam',
  },
  {
    id: 'prod3',
    name: 'Nho Xanh Mỹ',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=100&h=100&fit=crop',
    sold: 256,
    revenue: 38400000,
    category: 'Trái cây nhập khẩu',
  },
  {
    id: 'prod4',
    name: 'Dâu Tây Đà Lạt',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=100&h=100&fit=crop',
    sold: 198,
    revenue: 19800000,
    category: 'Trái cây Việt Nam',
  },
  {
    id: 'prod5',
    name: 'Bưởi Da Xanh',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=100&h=100&fit=crop',
    sold: 176,
    revenue: 14080000,
    category: 'Trái cây Việt Nam',
  },
];
