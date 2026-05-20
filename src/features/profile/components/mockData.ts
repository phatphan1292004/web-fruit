import type { AddressItem, NotificationItem, ProfileOrder, VoucherItem, WishlistItem } from './types';

export const userProfile = {
  name: 'Nguyễn Minh Anh',
  email: 'minhanh@morningfruit.vn',
  phone: '0912 345 678',
  birthday: '1998-06-15',
  gender: 'Nữ',
  memberSince: 2023,
  avatar: 'https://i.pravatar.cc/240?img=47',
};

export const stats = [
  { label: 'Tổng đơn hàng', value: '48', icon: 'shopping' },
  { label: 'Đơn đang giao', value: '3', icon: 'truck' },
  { label: 'Điểm tích lũy', value: '1,280', icon: 'star' },
  { label: 'Voucher hiện có', value: '6', icon: 'ticket' },
];

export const recentOrders: ProfileOrder[] = [
  { id: '#MF24018', date: '2026-05-18', items: 'Táo Envy, Dâu tây Hàn Quốc', total: 418000, status: 'Đang giao' },
  { id: '#MF24011', date: '2026-05-12', items: 'Giỏ quà trái cây Premium', total: 549000, status: 'Hoàn thành' },
  { id: '#MF24005', date: '2026-05-03', items: 'Xoài Thái, Thanh long ruột đỏ', total: 209000, status: 'Đang xử lý' },
  { id: '#MF23996', date: '2026-04-28', items: 'Táo hữu cơ Đà Lạt', total: 129000, status: 'Đã hủy' },
];

export const wishlist: WishlistItem[] = [
  { id: 1, name: 'Táo Envy New Zealand', price: 229000, rating: 4.9, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1200&auto=format&fit=crop' },
  { id: 2, name: 'Dâu tây Hàn Quốc', price: 189000, rating: 4.8, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca8?q=80&w=1200&auto=format&fit=crop' },
  { id: 3, name: 'Nho mẫu đơn Nhật Bản', price: 520000, rating: 5, image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?q=80&w=1200&auto=format&fit=crop' },
  { id: 4, name: 'Giỏ quà trái cây Premium', price: 459000, rating: 4.9, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop' },
];

export const addresses: AddressItem[] = [
  { id: 1, label: 'Nhà riêng', address: '123 Lê Lợi, Quận 1, TP.HCM', isDefault: true },
  { id: 2, label: 'Văn phòng', address: '45 Nguyễn Huệ, Quận 3, TP.HCM' },
];

export const vouchers: VoucherItem[] = [
  { id: 1, code: 'FRUIT10', condition: 'Đơn từ 200k', expiry: '30/06/2026' },
  { id: 2, code: 'ORGANIC20', condition: 'Áp dụng trái cây hữu cơ', expiry: '15/07/2026' },
  { id: 3, code: 'VIP50', condition: 'Khách VIP đơn từ 500k', expiry: '01/08/2026' },
];

export const notifications: NotificationItem[] = [
  { id: 1, title: 'Đơn hàng #MF24018 đang được giao', description: 'Shipper đã nhận hàng và đang trên đường tới bạn.', time: '5 phút trước' },
  { id: 2, title: 'Flash sale trái cây nhập khẩu', description: 'Giảm đến 20% cho các sản phẩm nhập khẩu trong hôm nay.', time: '1 giờ trước' },
  { id: 3, title: 'Voucher mới đã được thêm vào ví', description: 'Bạn vừa nhận voucher ORGANIC20 cho trái cây hữu cơ.', time: '3 giờ trước' },
];
