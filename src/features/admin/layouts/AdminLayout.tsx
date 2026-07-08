import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { useAdminStore } from '../hooks/useAdminStore';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const AdminLayout = () => {
  const location = useLocation();
  const { sidebarCollapsed, fetchUnreadCounts } = useAdminStore();

  useEffect(() => {
    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 15000);
    return () => clearInterval(interval);
  }, [fetchUnreadCounts]);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <AdminSidebar />

      <div
        className={`min-h-screen flex flex-col transition-[padding-left] duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[280px]'
        }`}
      >
        <AdminHeader />

        <main className="flex-1 p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
