import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from '../../../components/layout/layout';
import ProfileSidebar from './ProfileSidebar';
import ProfileBanner from './ProfileBanner';
import PersonalInfoForm from './PersonalInfoForm';
import OrderHistory from './OrderHistory';
import OrderDetail from './OrderDetail';
import WishlistSection from './WishlistSection';
import AddressSection from './AddressSection';
import VoucherSection from './VoucherSection';
import NotificationPanel from './NotificationPanel';
import { useLocation } from 'react-router-dom';
import type { ProfileTab, AddressItem, NotificationItem, ProfileOrder, VoucherItem } from './types';

const notifications: NotificationItem[] = [
  { id: 1, title: 'Đơn hàng #MF24018 đang được giao', description: 'Shipper đã nhận hàng và đang trên đường tới bạn.', time: '5 phút trước' },
  { id: 2, title: 'Flash sale trái cây nhập khẩu', description: 'Giảm đến 20% cho các sản phẩm nhập khẩu trong hôm nay.', time: '1 giờ trước' },
  { id: 3, title: 'Voucher mới đã được thêm vào ví', description: 'Bạn vừa nhận voucher ORGANIC20 cho trái cây hữu cơ.', time: '3 giờ trước' },
];

const recentOrders: ProfileOrder[] = [];
import { fetchFavoriteProducts, fetchUserByFirebaseUid, fetchOrdersByFirebaseUid, fetchUserAddresses, fetchVouchers, type ApiFavoriteProduct, type ApiUser } from '../servers';
import { RefreshCw } from 'lucide-react';

const fallbackFavoriteImage =
  'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1200&auto=format&fit=crop';

const readCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const ProfilePage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as ProfileTab;
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const [notificationOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<ApiUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [favorites, setFavorites] = useState<ApiFavoriteProduct[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [orders, setOrders] = useState<ProfileOrder[]>(recentOrders);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [vouchersLoaded, setVouchersLoaded] = useState(false);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadVouchers = async () => {
      if (activeTab !== 'vouchers' || vouchersLoaded) return;
      setLoadingVouchers(true);
      try {
        const data = await fetchVouchers();
        if (!isActive) return;
        setVouchers(data ?? []);
      } catch (err) {
        console.error('Failed to load vouchers', err);
        setVouchers([]);
      }
      if (!isActive) return;
      setLoadingVouchers(false);
      setVouchersLoaded(true);
    };

    loadVouchers();
    return () => {
      isActive = false;
    };
  }, [activeTab, vouchersLoaded]);

  useEffect(() => {
    let isActive = true;

    const loadAddresses = async () => {
      if (activeTab !== 'addresses' || addressesLoaded) return;
      const userId = readCookie('userId');
      if (!userId) {
        setAddresses([]);
        setAddressesLoaded(true);
        return;
      }

      setLoadingAddresses(true);
      try {
        const data = await fetchUserAddresses(userId);
        if (!isActive) return;
        setAddresses(data ?? []);
      } catch (err) {
        console.error('Failed to load addresses', err);
        setAddresses([]);
      }
      if (!isActive) return;
      setLoadingAddresses(false);
      setAddressesLoaded(true);
    };

    loadAddresses();
    return () => {
      isActive = false;
    };
  }, [activeTab, addressesLoaded]);

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

  useEffect(() => {
    let isActive = true;

    const loadOrders = async () => {
      if (activeTab !== 'orders' || ordersLoaded) return;
      const userId = readCookie('userId');
      if (!userId) {
        setOrders([]);
        setOrdersLoaded(true);
        return;
      }

      setLoadingOrders(true);
      try {
        const data = await fetchOrdersByFirebaseUid(userId);
        if (!isActive) return;
        const mapped = (data ?? []).map((o) => ({
          id: o._id || '',
          date: o.createdAt ? o.createdAt.split('T')[0] : '',
          items: Array.isArray((o as any).items) ? ((o as any).items).map((it: any) => it.name).join(', ') : o.customer?.name || '',
          total: o.total || 0,
          status: ((): ProfileOrder['status'] => {
            switch (o.status) {
              case 'shipping': return 'Đang giao';
              case 'completed': return 'Hoàn thành';
              case 'cancelled': return 'Đã hủy';
              case 'pending':
              default:
                return 'Đang xử lý';
            }
          })(),
          address: o.address || '',
          customer: o.customer ? {
            name: o.customer.name || '',
            phone: o.customer.phone || '',
          } : undefined,
          paymentMethod: o.paymentMethod || '',
        }));
        setOrders(mapped);
      } catch (err) {
        console.error('Failed to load orders', err);
        setOrders([]);
      }
      if (!isActive) return;
      setLoadingOrders(false);
      setOrdersLoaded(true);
    };

    loadOrders();
    return () => {
      isActive = false;
    };
  }, [activeTab, ordersLoaded]);

  const content = useMemo(() => {
    switch (activeTab) {
      case 'personal':
        return null;
      case 'orders':
        return loadingOrders ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500 gap-3 bg-white rounded-[2rem] border border-border/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Đang tải lịch sử đơn hàng...</p>
          </div>
        ) : (
          <OrderHistory orders={orders} onOpen={(id) => setSelectedOrderId(id)} />
        );
      case 'wishlist':
        return (
          <WishlistSection
            items={favorites.map((item) => ({
              id: Number(item.id) || 0,
              _id: item._id,
              slug: (item as any).slug || '',
              name: item.name,
              price: item.price,
              rating: item.rating ?? 0,
              image: (item as any).gallery?.[0] || item.image || fallbackFavoriteImage,
            }))}
            isLoading={loadingFavorites}
          />
        );
      case 'addresses':
        return (
          <AddressSection
            addresses={addresses}
            isLoading={loadingAddresses}
            onAddressesChange={(updatedList) => setAddresses(updatedList)}
            firebaseUid={readCookie('userId') || ''}
          />
        );
      case 'vouchers':
        return <VoucherSection vouchers={vouchers} isLoading={loadingVouchers} />;
      case 'notifications':
        return <NotificationPanel items={notifications} />;
      case 'password':
        return (
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60">
            Tính năng đổi mật khẩu sẽ được thêm ở bước tiếp theo.
          </div>
        );
      default:
        return (
          <PersonalInfoForm
            userProfile={userProfile}
            isLoading={loadingProfile}
            onProfileUpdate={(updated) => setUserProfile(updated)}
          />
        );
    }
  }, [activeTab, favorites, loadingFavorites, orders, loadingOrders, userProfile, loadingProfile, addresses, loadingAddresses, vouchers, loadingVouchers]);

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
              <PersonalInfoForm
                userProfile={userProfile}
                isLoading={loadingProfile}
                onProfileUpdate={(updated) => setUserProfile(updated)}
              />
            ) : (
              content
            )}
          </div>
        </div>
        {selectedOrderId && (
          <OrderDetail orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
