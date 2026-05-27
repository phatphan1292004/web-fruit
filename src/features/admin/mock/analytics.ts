export interface MonthlyRevenue {
  month: string;
  revenue: number;
  profit: number;
}

export interface OrderStatusData {
  name: string;
  value: number;
  color: string;
}

export interface TopSellingProduct {
  name: string;
  sold: number;
  revenue: number;
}

export interface UserGrowthData {
  month: string;
  newUsers: number;
  totalUsers: number;
}

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'T1', revenue: 18500000, profit: 5550000 },
  { month: 'T2', revenue: 21200000, profit: 6360000 },
  { month: 'T3', revenue: 19800000, profit: 5940000 },
  { month: 'T4', revenue: 23500000, profit: 7050000 },
  { month: 'T5', revenue: 25100000, profit: 7530000 },
  { month: 'T6', revenue: 22800000, profit: 6840000 },
  { month: 'T7', revenue: 27300000, profit: 8190000 },
  { month: 'T8', revenue: 24600000, profit: 7380000 },
  { month: 'T9', revenue: 26900000, profit: 8070000 },
  { month: 'T10', revenue: 28400000, profit: 8520000 },
  { month: 'T11', revenue: 31200000, profit: 9360000 },
  { month: 'T12', revenue: 29800000, profit: 8940000 },
];

export const orderStatusData: OrderStatusData[] = [
  { name: 'Đã giao', value: 485, color: '#22c55e' },
  { name: 'Đang giao', value: 128, color: '#3b82f6' },
  { name: 'Đang xử lý', value: 96, color: '#f59e0b' },
  { name: 'Chờ xác nhận', value: 64, color: '#8b5cf6' },
  { name: 'Đã hủy', value: 42, color: '#ef4444' },
];

export const topSellingProducts: TopSellingProduct[] = [
  { name: 'Sầu Riêng Monthong', sold: 342, revenue: 51300000 },
  { name: 'Dưa Hấu Không Hạt', sold: 320, revenue: 11200000 },
  { name: 'Xoài Cát Hòa Lộc', sold: 285, revenue: 28500000 },
  { name: 'Nho Xanh Mỹ', sold: 256, revenue: 38400000 },
  { name: 'Chuối Sấy Giòn', sold: 250, revenue: 11250000 },
];

export const userGrowthData: UserGrowthData[] = [
  { month: 'T1', newUsers: 120, totalUsers: 1200 },
  { month: 'T2', newUsers: 145, totalUsers: 1345 },
  { month: 'T3', newUsers: 98, totalUsers: 1443 },
  { month: 'T4', newUsers: 167, totalUsers: 1610 },
  { month: 'T5', newUsers: 189, totalUsers: 1799 },
  { month: 'T6', newUsers: 156, totalUsers: 1955 },
  { month: 'T7', newUsers: 210, totalUsers: 2165 },
  { month: 'T8', newUsers: 178, totalUsers: 2343 },
  { month: 'T9', newUsers: 234, totalUsers: 2577 },
  { month: 'T10', newUsers: 267, totalUsers: 2844 },
  { month: 'T11', newUsers: 312, totalUsers: 3156 },
  { month: 'T12', newUsers: 286, totalUsers: 3442 },
];
