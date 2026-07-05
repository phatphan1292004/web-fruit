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
  address?: string;
  customer?: {
    name?: string;
    phone?: string;
  };
  paymentMethod?: string;
};

export type WishlistItem = {
  id: number;
  _id?: string;
  slug: string;
  name: string;
  price: number;
  rating: number;
  image: string;
};

export type AddressItem = {
  id: number | string;
  _id?: string;
  label: string;
  receiverName?: string;
  phone?: string;
  province?: string;
  district?: string;
  provinceId?: number;
  ward?: string;
  wardId?: number;
  detailedAddress?: string;
  address: string;
  isDefault?: boolean;
};

export type VoucherItem = {
  id: string | number;
  code: string;
  condition: string;
  expiry: string;
  name?: string;
  type?: string;
  discountInfo?: string;
};

export type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
};
