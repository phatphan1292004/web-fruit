import { create } from "zustand";
import { previewOrder } from "../../../lib/api/orders";
import type { CartItem, CartTotals } from "../components/types";

type CartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

export type ShippingInfo = {
  fullName: string;
  phoneNumber: string;
  provinceId?: number;
  provinceName?: string;
  wardId?: number;
  wardName?: string;
  addressDetail: string;
  note: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItemInput) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  getTotals: () => CartTotals;
  previewTotals: CartTotals;
  isPreviewLoading: boolean;
  fetchPreview: () => Promise<void>;
  shippingInfo: ShippingInfo;
  setShippingInfo: (info: Partial<ShippingInfo>) => void;
  resetShippingInfo: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  previewTotals: {
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  },
  isPreviewLoading: false,
  shippingInfo: {
    fullName: "",
    phoneNumber: "",
    addressDetail: "",
    note: "",
  },
  addItem: (item) =>
    set((state) => {
      const quantity = item.quantity ?? 1;
      const existing = state.items.find((entry) => entry.id === item.id);
      if (existing) {
        return {
          items: state.items.map((entry) =>
            entry.id === item.id
              ? { ...entry, quantity: entry.quantity + quantity, productId: entry.productId ?? item.productId }
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
  fetchPreview: async () => {
    const items = get().items;
    if (items.length === 0) {
      set({
        previewTotals: {
          subtotal: 0,
          shipping: 0,
          discount: 0,
          total: 0,
        },
      });
      return;
    }

    set({ isPreviewLoading: true });
    const payload = {
      items: items.map((item) => ({
        productId: item.productId ?? String(item.id),
        quantity: item.quantity,
      })),
      shippingFee: 0,
      discount: 0,
    };

    try {
      const preview = await previewOrder(payload);
      if (preview) {
        set({
          previewTotals: {
            subtotal: preview.subtotal ?? 0,
            shipping: preview.shippingFee ?? 0,
            discount: preview.discount ?? 0,
            total: preview.total ?? 0,
          },
        });
      } else {
        set({ previewTotals: get().getTotals() });
      }
    } catch {
      set({ previewTotals: get().getTotals() });
    } finally {
      set({ isPreviewLoading: false });
    }
  },
  setShippingInfo: (info) =>
    set((state) => ({
      shippingInfo: {
        ...state.shippingInfo,
        ...info,
      },
    })),
  resetShippingInfo: () =>
    set({
      shippingInfo: {
        fullName: "",
        phoneNumber: "",
        provinceId: undefined,
        provinceName: undefined,
        wardId: undefined,
        wardName: undefined,
        addressDetail: "",
        note: "",
      },
    }),
}));
