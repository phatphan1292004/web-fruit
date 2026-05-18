import { useState } from 'react';
import CartHeader from './cart-header';
import CartSteps from './cart-steps';
import OrderSummary from './order-summary';
import type { CartTotals } from './types';
import Layout from '../../../components/layout/layout';

const totals: CartTotals = {
  subtotal: 1346520,
  shipping: 0,
  discount: 0,
  total: 1346520,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const paymentOptions = [
  {
    id: 'cod',
    title: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán tiền mặt cho nhân viên giao hàng.',
  },
  {
    id: 'vietqr',
    title: 'VietQR chuyển khoản',
    description: 'Quét VietQR để chuyển khoản nhanh, đúng nội dung.',
  },
  {
    id: 'momo',
    title: 'Ví Momo',
    description: 'Thanh toán nhanh qua cổng Momo.',
  },
  {
    id: 'vnpay',
    title: 'Cổng thanh toán VNPAY',
    description: 'Thanh toán online qua cổng VNPAY.',
  },
];

const PaymentPage = () => {
  const [selected, setSelected] = useState('cod');

  return (
    <Layout mainClassName="bg-gradient-to-b from-background to-muted/30 relative pt-20">
      <div className="absolute top-24 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" />
      <div className="absolute top-32 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute -bottom-16 left-1/2 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '12s' }} />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="py-10 md:py-14 flex flex-col gap-10">
          <CartHeader
            title="Thanh toán"
            breadcrumb="Trang chủ > Thanh toán"
            subtitle="Xác nhận thông tin giao hàng và chọn phương thức thanh toán phù hợp."
          />

          <CartSteps currentStep={3} />

          <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_0.7fr] gap-8 xl:gap-10 items-start">
            <div className="flex flex-col gap-6">
              <div className="glass rounded-3xl border border-border/60 p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="text-lg font-bold text-foreground">Thông tin giao hàng</h3>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">Đã xác nhận</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm">
                  <div className="flex flex-col gap-2">
                    <span className="text-foreground/50 uppercase tracking-wider text-xs">Người nhận</span>
                    <span className="font-semibold text-foreground">Phát Phan</span>
                    <span className="text-foreground/70">0973 038 104</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-foreground/50 uppercase tracking-wider text-xs">Địa chỉ giao hàng</span>
                    <span className="font-semibold text-foreground">123, Xã Đức Thịnh, Hà Tĩnh</span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl border border-border/60 p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <h3 className="text-lg font-bold text-foreground mb-6">Phương thức thanh toán</h3>
                <div className="flex flex-col gap-4">
                  {paymentOptions.map((option) => {
                    const isActive = option.id === selected;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-start gap-4 border rounded-2xl p-4 cursor-pointer transition-all ${
                          isActive
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border/60 bg-white/70 hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={option.id}
                          checked={isActive}
                          onChange={() => setSelected(option.id)}
                          className="mt-1"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-foreground">{option.title}</span>
                          <span className="text-sm text-foreground/60">{option.description}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <OrderSummary
              totals={totals}
              formatCurrency={formatCurrency}
              primaryLabel="Xác nhận thanh toán"
              secondaryLabel="Quay lại giao hàng"
              secondaryHref="/checkout/shipping"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
