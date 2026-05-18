import { useMemo, useState } from 'react';
import CartHeader from './cart-header';
import CartItems from './cart-items';
import CartSteps from './cart-steps';
import OrderSummary from './order-summary';
import type { CartItem, CartTotals } from './types';
import Layout from '../../../components/layout/layout';

const initialItems: CartItem[] = [
  {
    id: 1,
    name: 'Combo 36 gói 85g - Pate cho Royal Canin Mini Adult Gravy',
    description: 'Royal Canin Mini Adult Gravy Petmall',
    price: 1346520,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop',
    badge: 'Bán chạy',
  },
  {
    id: 2,
    name: 'Hộp trái cây nhiệt đới cao cấp',
    description: 'Mix dưa hấu, xoài, kiwi từ những trang trại hữu cơ',
    price: 268000,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop',
    badge: 'Hữu cơ',
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const CartPage = () => {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const totals = useMemo<CartTotals>(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0;
    const discount = 0;

    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
    };
  }, [items]);

  const handleIncrease = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const handleDecrease = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Layout mainClassName="bg-gradient-to-b from-background to-muted/30 relative pt-20">
      <div className="absolute top-24 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" />
      <div
        className="absolute top-32 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"
        style={{ animationDuration: '10s' }}
      />
      <div
        className="absolute -bottom-16 left-1/2 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"
        style={{ animationDuration: '12s' }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="py-10 md:py-14 flex flex-col gap-10">
          <CartHeader
            title="Giỏ hàng"
            breadcrumb="Trang chủ > Giỏ hàng"
            subtitle="Kiểm tra thông tin giỏ hàng và sẵn sàng cho bước thanh toán tiếp theo."
          />

          <CartSteps currentStep={1} />

          <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_0.7fr] gap-8 xl:gap-10 items-start">
            <CartItems
              items={items}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
              formatCurrency={formatCurrency}
            />
            <OrderSummary
              totals={totals}
              formatCurrency={formatCurrency}
              primaryLabel="Đặt hàng"
              primaryHref="/checkout/shipping"
              secondaryLabel="Tiếp tục mua sắm"
              secondaryHref="/"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
