import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiX } from 'react-icons/fi';
import { GiFruitBowl } from 'react-icons/gi';
import { SIDEBAR_MENU, SIDEBAR_LOGOUT } from '../utils/constants';
import { useAdminStore } from '../hooks/useAdminStore';

const AdminSidebar = () => {
  const { sidebarCollapsed, toggleSidebar, sidebarMobileOpen, closeMobileSidebar, unreadCounts } = useAdminStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    closeMobileSidebar();
    navigate('/');
  };

  const getUnreadCount = (id: string) => {
    if (id === 'orders') return unreadCounts.orders;
    if (id === 'reviews') return unreadCounts.reviews;
    if (id === 'chat') return unreadCounts.chat;
    return 0;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200">
            <GiFruitBowl className="text-white text-xl" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-lg text-slate-800 whitespace-nowrap"
              >
                MorningFruit
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {/* Desktop collapse button */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <motion.div animate={{ rotate: sidebarCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <FiChevronLeft className="text-slate-400 text-sm" />
          </motion.div>
        </button>
        {/* Mobile close button */}
        <button
          onClick={closeMobileSidebar}
          className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <FiX className="text-slate-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {SIDEBAR_MENU.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === '/admin'}
            onClick={closeMobileSidebar}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${isActive
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                
                <div className="relative flex items-center">
                  <item.icon className={`text-lg flex-shrink-0 ${isActive ? 'text-emerald-600' : ''}`} />
                  {sidebarCollapsed && getUnreadCount(item.id) > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </div>

                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex-1 flex items-center justify-between overflow-hidden"
                    >
                      <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                        {item.label}
                      </span>
                      {getUnreadCount(item.id) > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-extrabold bg-red-500 text-white rounded-full leading-none min-w-[20px] h-5 flex items-center justify-center animate-pulse shadow-sm shadow-red-200">
                          {getUnreadCount(item.id)}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
        >
          <SIDEBAR_LOGOUT.icon className="text-lg flex-shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                {SIDEBAR_LOGOUT.label}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-white border-r border-slate-200 fixed left-0 top-0 bottom-0 overflow-hidden z-30"
      >
        {sidebarContent}
      </motion.aside>
 
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileSidebar}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
