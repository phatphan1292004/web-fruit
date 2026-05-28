export type CartItem = {
  id: number;
  productId?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  badge?: string;
};

export type CartTotals = {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
};
