import { FiHome, FiUsers, FiPackage, FiShoppingCart, FiStar, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';
import type { IconType } from 'react-icons';

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: IconType;
  path: string;
}

export const SIDEBAR_MENU: SidebarMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/admin' },
  { id: 'users', label: 'Quản lý người dùng', icon: FiUsers, path: '/admin/users' },
  { id: 'products', label: 'Quản lý sản phẩm', icon: FiPackage, path: '/admin/products' },
  { id: 'orders', label: 'Quản lý đơn hàng', icon: FiShoppingCart, path: '/admin/orders' },
  { id: 'reviews', label: 'Quản lý đánh giá', icon: FiStar, path: '/admin/reviews' },
  { id: 'analytics', label: 'Thống kê', icon: FiBarChart2, path: '/admin/analytics' },
  { id: 'settings', label: 'Cài đặt', icon: FiSettings, path: '/admin/settings' },
];

export const SIDEBAR_LOGOUT: SidebarMenuItem = {
  id: 'logout',
  label: 'Đăng xuất',
  icon: FiLogOut,
  path: '/',
};

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'text-amber-700', bg: 'bg-amber-50' },
  processing: { label: 'Đang xử lý', color: 'text-blue-700', bg: 'bg-blue-50' },
  shipped: { label: 'Đang giao', color: 'text-indigo-700', bg: 'bg-indigo-50' },
  delivered: { label: 'Đã giao', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  cancelled: { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-50' },
};

export const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  unpaid: { label: 'Chưa thanh toán', color: 'text-amber-700', bg: 'bg-amber-50' },
  paid: { label: 'Đã thanh toán', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  refunded: { label: 'Đã hoàn tiền', color: 'text-red-700', bg: 'bg-red-50' },
};

export const DELIVERY_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  preparing: { label: 'Đang chuẩn bị', color: 'text-amber-700', bg: 'bg-amber-50' },
  in_transit: { label: 'Đang vận chuyển', color: 'text-blue-700', bg: 'bg-blue-50' },
  delivered: { label: 'Đã giao', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  returned: { label: 'Đã trả lại', color: 'text-red-700', bg: 'bg-red-50' },
};

export const USER_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Hoạt động', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  banned: { label: 'Đã khóa', color: 'text-red-700', bg: 'bg-red-50' },
  inactive: { label: 'Không hoạt động', color: 'text-slate-700', bg: 'bg-slate-100' },
};

export const USER_ROLE_MAP: Record<string, { label: string; color: string; bg: string }> = {
  admin: { label: 'Admin', color: 'text-purple-700', bg: 'bg-purple-50' },
  staff: { label: 'Nhân viên', color: 'text-blue-700', bg: 'bg-blue-50' },
  customer: { label: 'Khách hàng', color: 'text-slate-700', bg: 'bg-slate-100' },
};

export const PAGE_SIZE = 8;
