export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'admin' | 'customer' | 'staff';
  status: 'active' | 'banned' | 'inactive';
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

export const mockUsers: AdminUser[] = [
  {
    id: 'u1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    phone: '0901234567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=an',
    role: 'customer',
    status: 'active',
    joinDate: '2024-01-15',
    totalOrders: 12,
    totalSpent: 3450000,
  },
  {
    id: 'u2',
    name: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    phone: '0912345678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=binh',
    role: 'customer',
    status: 'active',
    joinDate: '2024-02-20',
    totalOrders: 8,
    totalSpent: 2180000,
  },
  {
    id: 'u3',
    name: 'Lê Hoàng Cường',
    email: 'cuong.le@email.com',
    phone: '0923456789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cuong',
    role: 'staff',
    status: 'active',
    joinDate: '2023-11-10',
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    id: 'u4',
    name: 'Phạm Minh Đức',
    email: 'duc.pham@email.com',
    phone: '0934567890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=duc',
    role: 'customer',
    status: 'banned',
    joinDate: '2024-03-05',
    totalOrders: 3,
    totalSpent: 890000,
  },
  {
    id: 'u5',
    name: 'Hoàng Thị Em',
    email: 'em.hoang@email.com',
    phone: '0945678901',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=em',
    role: 'customer',
    status: 'active',
    joinDate: '2024-04-12',
    totalOrders: 15,
    totalSpent: 5620000,
  },
  {
    id: 'u6',
    name: 'Võ Thanh Phong',
    email: 'phong.vo@email.com',
    phone: '0956789012',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=phong',
    role: 'admin',
    status: 'active',
    joinDate: '2023-06-01',
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    id: 'u7',
    name: 'Đặng Thu Giang',
    email: 'giang.dang@email.com',
    phone: '0967890123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=giang',
    role: 'customer',
    status: 'inactive',
    joinDate: '2024-01-28',
    totalOrders: 2,
    totalSpent: 540000,
  },
  {
    id: 'u8',
    name: 'Bùi Quốc Huy',
    email: 'huy.bui@email.com',
    phone: '0978901234',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=huy',
    role: 'customer',
    status: 'active',
    joinDate: '2024-05-18',
    totalOrders: 6,
    totalSpent: 1870000,
  },
];
