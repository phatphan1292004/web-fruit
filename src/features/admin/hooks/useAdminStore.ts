import { create } from 'zustand';
import store from '../../../integrations/store';

interface AdminState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  unreadCounts: {
    orders: number;
    reviews: number;
    chat: number;
  };
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  setUnreadCounts: (counts: { orders: number; reviews: number; chat: number }) => void;
  fetchUnreadCounts: () => Promise<void>;
  decrementUnreadOrders: () => void;
  decrementUnreadReviews: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  unreadCounts: {
    orders: 0,
    reviews: 0,
    chat: 0,
  },
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
  toggleMobileSidebar: () => set((state) => ({ sidebarMobileOpen: !state.sidebarMobileOpen })),
  closeMobileSidebar: () => set({ sidebarMobileOpen: false }),
  setUnreadCounts: (counts) => set({ unreadCounts: counts }),
  fetchUnreadCounts: async () => {
    try {
      const res = await store.get<{ orders: number; reviews: number; chat: number }>('/admin/unread-counts');
      if (res) {
        set({ unreadCounts: res });
      }
    } catch (err) {
      console.error('Failed to fetch unread counts:', err);
    }
  },
  decrementUnreadOrders: () => set((state) => ({
    unreadCounts: {
      ...state.unreadCounts,
      orders: Math.max(0, state.unreadCounts.orders - 1),
    }
  })),
  decrementUnreadReviews: () => set((state) => ({
    unreadCounts: {
      ...state.unreadCounts,
      reviews: Math.max(0, state.unreadCounts.reviews - 1),
    }
  })),
}));
