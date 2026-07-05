import { useEffect, useMemo } from 'react';
import CartHeader from './cart-header';
import CartItems from './cart-items';
import CartSteps from './cart-steps';
import OrderSummary from './order-summary';
import type { CartTotals } from './types';
import Layout from '../../../components/layout/layout';
import { useCartStore } from '../store/cart-store';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const CartPage = () => {
  const items = useCartStore((state) => state.items);
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);
  const remove = useCartStore((state) => state.remove);
  const fetchPreview = useCartStore((state) => state.fetchPreview);
  const previewTotals = useCartStore((state) => state.previewTotals);
  const isPreviewLoading = useCartStore((state) => state.isPreviewLoading);

  const fallbackTotals = useMemo<CartTotals>(() => {
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

  useEffect(() => {
    fetchPreview();
  }, [fetchPreview, items]);

  const totals =
    items.length > 0 && !isPreviewLoading && previewTotals.subtotal > 0
      ? previewTotals
      : fallbackTotals;

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
              onIncrease={increase}
              onDecrease={decrease}
              onRemove={remove}
              formatCurrency={formatCurrency}
            />
            <OrderSummary
              totals={totals}
              formatCurrency={formatCurrency}
              primaryLabel="Đặt hàng"
              primaryHref="/checkout/shipping"
              secondaryLabel="Tiếp tục mua sắm"
              secondaryHref="/"
              hideVoucherSection={true}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
