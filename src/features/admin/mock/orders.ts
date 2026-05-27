export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type DeliveryStatus = 'preparing' | 'in_transit' | 'delivered' | 'returned';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  phone: string;
  items: OrderItem[];
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  paymentMethod: string;
  date: string;
  address: string;
  note: string;
}

export const mockOrders: AdminOrder[] = [
  {
    id: 'ORD-2024-001',
    customer: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    phone: '0901234567',
    items: [
      { productId: 'prod1', name: 'Sầu Riêng Monthong Thái', quantity: 2, price: 150000, image: 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=80&h=80&fit=crop' },
      { productId: 'prod4', name: 'Dâu Tây Đà Lạt', quantity: 3, price: 100000, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=80&h=80&fit=crop' },
    ],
    total: 600000,
    orderStatus: 'delivered',
    paymentStatus: 'paid',
    deliveryStatus: 'delivered',
    paymentMethod: 'Chuyển khoản',
    date: '2024-12-15',
    address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    note: 'Giao giờ hành chính',
  },
  {
    id: 'ORD-2024-002',
    customer: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    phone: '0912345678',
    items: [
      { productId: 'prod8', name: 'Xoài Sấy Dẻo', quantity: 2, price: 85000, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=80&h=80&fit=crop' },
    ],
    total: 170000,
    orderStatus: 'shipped',
    paymentStatus: 'paid',
    deliveryStatus: 'in_transit',
    paymentMethod: 'COD',
    date: '2024-12-15',
    address: '456 Lê Lợi, Q.3, TP.HCM',
    note: '',
  },
  {
    id: 'ORD-2024-003',
    customer: 'Lê Hoàng Cường',
    email: 'cuong.le@email.com',
    phone: '0923456789',
    items: [
      { productId: 'prod5', name: 'Bưởi Da Xanh', quantity: 4, price: 80000, image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=80&h=80&fit=crop' },
    ],
    total: 320000,
    orderStatus: 'processing',
    paymentStatus: 'paid',
    deliveryStatus: 'preparing',
    paymentMethod: 'Ví MoMo',
    date: '2024-12-14',
    address: '789 Trần Hưng Đạo, Q.5, TP.HCM',
    note: 'Gói quà tặng',
  },
  {
    id: 'ORD-2024-004',
    customer: 'Phạm Minh Đức',
    email: 'duc.pham@email.com',
    phone: '0934567890',
    items: [
      { productId: 'prod7', name: 'Combo Trái Cây Mix 5 Loại', quantity: 1, price: 299000, image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=80&h=80&fit=crop' },
    ],
    total: 299000,
    orderStatus: 'pending',
    paymentStatus: 'unpaid',
    deliveryStatus: 'preparing',
    paymentMethod: 'COD',
    date: '2024-12-14',
    address: '321 Hai Bà Trưng, Q.1, TP.HCM',
    note: '',
  },
  {
    id: 'ORD-2024-005',
    customer: 'Hoàng Thị Em',
    email: 'em.hoang@email.com',
    phone: '0945678901',
    items: [
      { productId: 'prod3', name: 'Nho Xanh Mỹ', quantity: 3, price: 150000, image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=80&h=80&fit=crop' },
    ],
    total: 450000,
    orderStatus: 'cancelled',
    paymentStatus: 'refunded',
    deliveryStatus: 'returned',
    paymentMethod: 'Chuyển khoản',
    date: '2024-12-13',
    address: '567 Võ Văn Tần, Q.3, TP.HCM',
    note: 'Khách hủy đơn',
  },
  {
    id: 'ORD-2024-006',
    customer: 'Võ Thanh Phong',
    email: 'phong.vo@email.com',
    phone: '0956789012',
    items: [
      { productId: 'prod6', name: 'Táo Envy New Zealand', quantity: 2, price: 120000, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=80&h=80&fit=crop' },
    ],
    total: 240000,
    orderStatus: 'delivered',
    paymentStatus: 'paid',
    deliveryStatus: 'delivered',
    paymentMethod: 'ZaloPay',
    date: '2024-12-12',
    address: '890 CMT8, Q.10, TP.HCM',
    note: '',
  },
  {
    id: 'ORD-2024-007',
    customer: 'Đặng Thu Giang',
    email: 'giang.dang@email.com',
    phone: '0967890123',
    items: [
      { productId: 'prod2', name: 'Xoài Cát Hòa Lộc', quantity: 5, price: 100000, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=80&h=80&fit=crop' },
    ],
    total: 500000,
    orderStatus: 'shipped',
    paymentStatus: 'paid',
    deliveryStatus: 'in_transit',
    paymentMethod: 'Chuyển khoản',
    date: '2024-12-12',
    address: '234 Pasteur, Q.1, TP.HCM',
    note: 'Giao trước 5h chiều',
  },
  {
    id: 'ORD-2024-008',
    customer: 'Bùi Quốc Huy',
    email: 'huy.bui@email.com',
    phone: '0978901234',
    items: [
      { productId: 'prod6', name: 'Táo Envy New Zealand', quantity: 2, price: 120000, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=80&h=80&fit=crop' },
      { productId: 'prod2', name: 'Xoài Cát Hòa Lộc', quantity: 3, price: 100000, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=80&h=80&fit=crop' },
    ],
    total: 540000,
    orderStatus: 'processing',
    paymentStatus: 'paid',
    deliveryStatus: 'preparing',
    paymentMethod: 'Ví MoMo',
    date: '2024-12-11',
    address: '678 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM',
    note: '',
  },
];
