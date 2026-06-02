import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from '../../../components/layout/layout';
import ProfileSidebar from './ProfileSidebar';
import ProfileBanner from './ProfileBanner';
import PersonalInfoForm from './PersonalInfoForm';
import OrderHistory from './OrderHistory';
import WishlistSection from './WishlistSection';
import AddressSection from './AddressSection';
import VoucherSection from './VoucherSection';
import NotificationPanel from './NotificationPanel';
import type { ProfileTab, AddressItem, NotificationItem, ProfileOrder, VoucherItem } from './types';

const addresses: AddressItem[] = [
  { id: 1, label: 'Nhà riêng', address: '123 Lê Lợi, Quận 1, TP.HCM', isDefault: true },
  { id: 2, label: 'Văn phòng', address: '45 Nguyễn Huệ, Quận 3, TP.HCM' },
];

const vouchers: VoucherItem[] = [
  { id: 1, code: 'FRUIT10', condition: 'Đơn từ 200k', expiry: '30/06/2026' },
  { id: 2, code: 'ORGANIC20', condition: 'Áp dụng trái cây hữu cơ', expiry: '15/07/2026' },
  { id: 3, code: 'VIP50', condition: 'Khách VIP đơn từ 500k', expiry: '01/08/2026' },
];

const notifications: NotificationItem[] = [
  { id: 1, title: 'Đơn hàng #MF24018 đang được giao', description: 'Shipper đã nhận hàng và đang trên đường tới bạn.', time: '5 phút trước' },
  { id: 2, title: 'Flash sale trái cây nhập khẩu', description: 'Giảm đến 20% cho các sản phẩm nhập khẩu trong hôm nay.', time: '1 giờ trước' },
  { id: 3, title: 'Voucher mới đã được thêm vào ví', description: 'Bạn vừa nhận voucher ORGANIC20 cho trái cây hữu cơ.', time: '3 giờ trước' },
];

const recentOrders: ProfileOrder[] = [
  { id: '#MF24018', date: '2026-05-18', items: 'Táo Envy, Dâu tây Hàn Quốc', total: 418000, status: 'Đang giao' },
  { id: '#MF24011', date: '2026-05-12', items: 'Giỏ quà trái cây Premium', total: 549000, status: 'Hoàn thành' },
  { id: '#MF24005', date: '2026-05-03', items: 'Xoài Thái, Thanh long ruột đỏ', total: 209000, status: 'Đang xử lý' },
  { id: '#MF23996', date: '2026-04-28', items: 'Táo hữu cơ Đà Lạt', total: 129000, status: 'Đã hủy' },
];
import { fetchFavoriteProducts, fetchUserByFirebaseUid, type ApiFavoriteProduct, type ApiUser } from '../servers';

const fallbackFavoriteImage =
  'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1200&auto=format&fit=crop';

const readCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [notificationOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<ApiUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [favorites, setFavorites] = useState<ApiFavoriteProduct[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      const userId = readCookie('userId');
      if (!userId) {
        setUserProfile(null);
        setLoadingProfile(false);
        return;
      }
      setLoadingProfile(true);
      const data = await fetchUserByFirebaseUid(userId);
      if (!isActive) return;
      setUserProfile(data ?? null);
      setLoadingProfile(false);

      const resolvedName = data?.displayName || data?.name;
      if (resolvedName) {
        localStorage.setItem('displayName', resolvedName);
      }
    };

    loadProfile();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadFavorites = async () => {
      if (activeTab !== 'wishlist' || favoritesLoaded) return;
      const userId = readCookie('userId');
      if (!userId) {
        setFavorites([]);
        setFavoritesLoaded(true);
        return;
      }

      setLoadingFavorites(true);
      const data = await fetchFavoriteProducts(userId);
      if (!isActive) return;
      setFavorites(data ?? []);
      setLoadingFavorites(false);
      setFavoritesLoaded(true);
    };

    loadFavorites();
    return () => {
      isActive = false;
    };
  }, [activeTab, favoritesLoaded]);

  const content = useMemo(() => {
    switch (activeTab) {
      case 'personal':
        return null;
      case 'orders':
        return <OrderHistory orders={recentOrders} />;
      case 'wishlist':
        return (
          <WishlistSection
            items={favorites.map((item) => ({
              id: Number(item.id) || 0,
              name: item.name,
              price: item.price,
              rating: item.rating ?? 0,
              image: item.image || fallbackFavoriteImage,
            }))}
            isLoading={loadingFavorites}
          />
        );
      case 'addresses':
        return <AddressSection addresses={addresses} />;
      case 'vouchers':
        return <VoucherSection vouchers={vouchers} />;
      case 'notifications':
        return <NotificationPanel items={notifications} />;
      case 'password':
        return (
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60">
            Tính năng đổi mật khẩu sẽ được thêm ở bước tiếp theo.
          </div>
        );
      default:
        return <PersonalInfoForm userProfile={userProfile} isLoading={loadingProfile} />;
    }
  }, [activeTab, favorites, loadingFavorites]);

  return (
    <Layout mainClassName="bg-gradient-to-b from-emerald-50 via-white to-orange-50 pt-28 pb-16">
      <div className="container mx-auto px-4 md:px-8 space-y-8">
        <AnimatePresence>
          {notificationOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-[2rem] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60"
            >
              <NotificationPanel items={notifications} />
            </motion.div>
          )}
        </AnimatePresence>

        <ProfileBanner userProfile={userProfile} isLoading={loadingProfile} />

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
          <ProfileSidebar activeTab={activeTab} onChange={setActiveTab} />
          <div className="space-y-8">
            {activeTab === 'personal' ? (
              <PersonalInfoForm userProfile={userProfile} isLoading={loadingProfile} />
            ) : (
              content
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
