import { useMemo, useState } from 'react';
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
import { addresses, notifications, recentOrders, vouchers, wishlist } from './mockData';
import type { ProfileTab } from './types';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [notificationOpen] = useState(false);

  const content = useMemo(() => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoForm />;
      case 'orders':
        return <OrderHistory orders={recentOrders} />;
      case 'wishlist':
        return <WishlistSection items={wishlist} />;
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
        return <PersonalInfoForm />;
    }
  }, [activeTab]);

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

        <ProfileBanner />

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
          <ProfileSidebar activeTab={activeTab} onChange={setActiveTab} />
          <div className="space-y-8">{content}</div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
