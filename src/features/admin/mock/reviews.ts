export interface AdminReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
  isHidden: boolean;
  reply: string;
}

export const mockReviews: AdminReview[] = [
  {
    id: 'rev1',
    userId: 'u1',
    userName: 'Nguyễn Văn An',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=an',
    productId: 'prod1',
    productName: 'Sầu Riêng Monthong Thái',
    productImage: 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=80&h=80&fit=crop',
    rating: 5,
    comment: 'Sầu riêng rất ngon, cơm vàng, hạt lép. Giao hàng nhanh, đóng gói cẩn thận. Sẽ mua lại!',
    date: '2024-12-14',
    isHidden: false,
    reply: 'Cảm ơn bạn đã ủng hộ! Chúc bạn ngon miệng ạ 🥰',
  },
  {
    id: 'rev2',
    userId: 'u2',
    userName: 'Trần Thị Bình',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=binh',
    productId: 'prod3',
    productName: 'Nho Xanh Mỹ',
    productImage: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=80&h=80&fit=crop',
    rating: 4,
    comment: 'Nho ngon, giòn, ngọt. Tuy nhiên có vài quả hơi mềm. Nhìn chung hài lòng.',
    date: '2024-12-13',
    isHidden: false,
    reply: '',
  },
  {
    id: 'rev3',
    userId: 'u5',
    userName: 'Hoàng Thị Em',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=em',
    productId: 'prod8',
    productName: 'Xoài Sấy Dẻo',
    productImage: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=80&h=80&fit=crop',
    rating: 5,
    comment: 'Xoài sấy dẻo ngon ngọt vừa, rất ngon. Gói cẩn thận.',
    date: '2024-12-12',
    isHidden: false,
    reply: '',
  },
  {
    id: 'rev4',
    userId: 'u8',
    userName: 'Bùi Quốc Huy',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=huy',
    productId: 'prod2',
    productName: 'Xoài Cát Hòa Lộc',
    productImage: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=80&h=80&fit=crop',
    rating: 3,
    comment: 'Xoài hơi chua, chưa chín đều. Kỳ vọng nhiều hơn với giá này.',
    date: '2024-12-11',
    isHidden: false,
    reply: 'Xin lỗi bạn về trải nghiệm này. Shop sẽ chọn lọc kỹ hơn. Liên hệ hotline để được hỗ trợ đổi trả ạ.',
  },
  {
    id: 'rev5',
    userId: 'u5',
    userName: 'Hoàng Thị Em',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=em',
    productId: 'prod7',
    productName: 'Combo Trái Cây Mix 5 Loại',
    productImage: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=80&h=80&fit=crop',
    rating: 5,
    comment: 'Combo rất đa dạng, trái cây tươi ngon. Mua tặng bạn bè ai cũng khen!',
    date: '2024-12-10',
    isHidden: false,
    reply: '',
  },
  {
    id: 'rev6',
    userId: 'u3',
    userName: 'Lê Hoàng Cường',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cuong',
    productId: 'prod4',
    productName: 'Dâu Tây Đà Lạt',
    productImage: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=80&h=80&fit=crop',
    rating: 4,
    comment: 'Dâu tây thơm, ngọt vừa. Hộp đẹp, giao hàng đúng hẹn.',
    date: '2024-12-09',
    isHidden: false,
    reply: 'Cảm ơn bạn! Dâu tây mùa này rất ngon đó ạ 🍓',
  },
  {
    id: 'rev7',
    userId: 'u7',
    userName: 'Đặng Thu Giang',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=giang',
    productId: 'prod5',
    productName: 'Bưởi Da Xanh',
    productImage: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=80&h=80&fit=crop',
    rating: 5,
    comment: 'Bưởi ngọt lịm, múi dày, ít hạt. Cả nhà ai cũng thích!',
    date: '2024-12-08',
    isHidden: false,
    reply: '',
  },
  {
    id: 'rev8',
    userId: 'u4',
    userName: 'Phạm Minh Đức',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=duc',
    productId: 'prod7',
    productName: 'Combo Trái Cây Mix 5 Loại',
    productImage: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=80&h=80&fit=crop',
    rating: 2,
    comment: 'Trái cây không tươi lắm, một số quả dập. Rất thất vọng!',
    date: '2024-12-07',
    isHidden: true,
    reply: '',
  },
];
