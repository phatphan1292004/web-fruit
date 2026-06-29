import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useAdminStore } from '../hooks/useAdminStore';
import { SIDEBAR_MENU } from '../utils/constants';

interface AdminNotification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

const AdminHeader = () => {
  const { toggleMobileSidebar } = useAdminStore();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const saved = localStorage.getItem('admin_notifications');
      return saved ? JSON.parse(saved) : [
        { id: 1, text: 'Hệ thống thông báo Realtime đã hoạt động.', time: new Date().toISOString(), read: false },
      ];
    } catch {
      return [];
    }
  });

  const currentPage = SIDEBAR_MENU.find((item) =>
    item.path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(item.path) && item.path !== '/admin'
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const adminUid = document.cookie.match(/(?:^|; )userId=([^;]*)/)?.[1] || '';
    if (!adminUid) return;

    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      query: {
        firebaseUid: adminUid,
        role: 'admin',
      },
    });

    socket.on('new_notification', (data: AdminNotification) => {
      setNotifications((prev) => {
        const updated = [data, ...prev].slice(0, 50); // Keep last 50
        localStorage.setItem('admin_notifications', JSON.stringify(updated));
        return updated;
      });
      // Show toast alert
      toast.info(data.text, {
        position: 'top-right',
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem('admin_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAll = () => {
    setNotifications([]);
    localStorage.removeItem('admin_notifications');
  };

  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.round(diffMs / 60000);
      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      const diffHrs = Math.round(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs} giờ trước`;
      return date.toLocaleDateString('vi-VN');
    } catch {
      return 'Vừa xong';
    }
  };

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
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-20"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-semibold text-slate-800">Thông báo</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={handleClearAll}
                          className="text-xs text-red-500 font-semibold hover:underline"
                        >
                          Xóa tất cả
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleMarkAsRead(n.id)}
                          className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${
                            !n.read ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <p className={`text-xs ${!n.read ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{n.text}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{formatTime(n.time)}</p>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <div className="px-4 py-6 text-center text-sm text-slate-400">
                          Chưa có thông báo nào.
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
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
