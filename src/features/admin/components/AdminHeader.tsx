import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { useAdminStore } from '../hooks/useAdminStore';
import { useLocation } from 'react-router-dom';
import { SIDEBAR_MENU } from '../utils/constants';
import { motion } from 'framer-motion';
import { useState } from 'react';

const AdminHeader = () => {
  const { toggleMobileSidebar } = useAdminStore();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const currentPage = SIDEBAR_MENU.find((item) =>
    item.path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(item.path) && item.path !== '/admin'
  );

  const notifications = [
    { id: 1, text: 'Đơn hàng mới #ORD-2024-021', time: '2 phút trước', read: false },
    { id: 2, text: 'Đánh giá mới cho Sầu Riêng Monthong', time: '15 phút trước', read: false },
    { id: 3, text: 'Sản phẩm Cherry Úc sắp hết hàng', time: '1 giờ trước', read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <FiMenu className="text-xl text-slate-600" />
          </button>

          {/* Page Title */}
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-slate-800">
              {currentPage?.label || 'Dashboard'}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Quản lý cửa hàng trái cây của bạn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search (desktop only) */}
          <div className="hidden md:flex items-center bg-slate-50 rounded-xl px-3 py-2 gap-2 w-64 border border-slate-200 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            <FiSearch className="text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="bg-transparent text-sm text-slate-600 outline-none w-full placeholder-slate-400"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <FiBell className="text-xl text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-20"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Thông báo</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${
                          !n.read ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <p className="text-sm text-slate-700">{n.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 text-center">
                    <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                      Xem tất cả
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* Admin Avatar */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-700">Admin</p>
              <p className="text-xs text-slate-400">Quản trị viên</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-200">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
