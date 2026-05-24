import { create } from "zustand";
import type { CartItem, CartTotals } from "../components/types";

type CartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItemInput) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  getTotals: () => CartTotals;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const quantity = item.quantity ?? 1;
      const existing = state.items.find((entry) => entry.id === item.id);
      if (existing) {
        return {
          items: state.items.map((entry) =>
            entry.id === item.id
              ? { ...entry, quantity: entry.quantity + quantity }
              : entry
          ),
        };
      }
      return {
        items: [...state.items, { ...item, quantity }],
      };
    }),
  increase: (id) =>
    set((state) => ({
      items: state.items.map((entry) =>
        entry.id === id ? { ...entry, quantity: entry.quantity + 1 } : entry
      ),
    })),
  decrease: (id) =>
    set((state) => ({
      items: state.items.map((entry) =>
        entry.id === id && entry.quantity > 1
          ? { ...entry, quantity: entry.quantity - 1 }
          : entry
      ),
    })),
  remove: (id) =>
    set((state) => ({
      items: state.items.filter((entry) => entry.id !== id),
    })),
  clear: () => set({ items: [] }),
  getTotals: () => {
    const subtotal = get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = 0;
    const discount = 0;

    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
    };
  },
}));
