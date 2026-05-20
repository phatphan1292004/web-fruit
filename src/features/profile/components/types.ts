export type ProfileTab =
  | 'dashboard'
  | 'personal'
  | 'orders'
  | 'wishlist'
  | 'addresses'
  | 'vouchers'
  | 'notifications'
  | 'password';

export type ProfileOrderStatus = 'Đang xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';

export type ProfileOrder = {
  id: string;
  date: string;
  items: string;
  total: number;
  status: ProfileOrderStatus;
};

export type WishlistItem = {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
};

export type AddressItem = {
  id: number;
  label: string;
  address: string;
  isDefault?: boolean;
};

export type VoucherItem = {
  id: number;
  code: string;
  condition: string;
  expiry: string;
};

export type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
};
