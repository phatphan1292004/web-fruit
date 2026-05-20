import { motion } from 'framer-motion';
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiGift, FiBell, FiLock } from 'react-icons/fi';
import type { ProfileTab } from './types';

const items: { id: ProfileTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'personal', label: 'Thông tin cá nhân', icon: FiUser },
  { id: 'orders', label: 'Đơn hàng của tôi', icon: FiShoppingBag },
  { id: 'wishlist', label: 'Sản phẩm yêu thích', icon: FiHeart },
  { id: 'addresses', label: 'Địa chỉ giao hàng', icon: FiMapPin },
  { id: 'vouchers', label: 'Voucher của tôi', icon: FiGift },
  { id: 'notifications', label: 'Thông báo', icon: FiBell },
  { id: 'password', label: 'Đổi mật khẩu', icon: FiLock },
];

type SidebarProps = {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
};

const ProfileSidebar = ({ activeTab, onChange }: SidebarProps) => {
  return (
    <aside className="lg:w-80 shrink-0">
      <div className="sticky top-28 rounded-[2rem] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60">
        <div className="px-3 pt-2 pb-4">
          <p className="text-xs uppercase tracking-wider text-foreground/50">Tài khoản</p>
          <h3 className="text-2xl font-bold text-foreground mt-1">Menu</h3>
        </div>
        <div className="space-y-1">
          {items.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              whileHover={{ x: 4 }}
              onClick={() => onChange(item.id)}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300 ${activeTab === item.id ? 'bg-primary text-white shadow-md' : 'text-foreground/70 hover:bg-muted hover:text-foreground'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
