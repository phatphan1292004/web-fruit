import { Link } from 'react-router-dom';
import type { CartTotals } from './types';

type OrderSummaryProps = {
  totals: CartTotals;
  formatCurrency: (value: number) => string;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryHref?: string;
  secondaryHref?: string;
  primaryDisabled?: boolean;
};

const OrderSummary = ({
  totals,
  formatCurrency,
  primaryLabel = 'Đặt hàng',
  secondaryLabel = 'Tiếp tục mua sắm',
  primaryHref,
  secondaryHref,
  primaryDisabled = false,
}: OrderSummaryProps) => {
  return (
    <div className="glass rounded-3xl border border-border/60 p-6 md:p-7 h-fit sticky top-24 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <h3 className="text-lg font-bold text-foreground mb-6">Tóm tắt đơn hàng</h3>
      <div className="flex flex-col gap-4 text-sm text-foreground/70">
        <div className="flex items-center justify-between">
          <span>Tiền sản phẩm</span>
          <span className="font-semibold text-foreground">{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Phí vận chuyển</span>
          <span className="font-semibold text-foreground">{formatCurrency(totals.shipping)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Giảm giá</span>
          <span className="font-semibold text-destructive">-{formatCurrency(totals.discount)}</span>
        </div>
      </div>

      <div className="border-t border-border/60 my-6" />

      <div className="flex items-center justify-between text-base font-semibold text-foreground mb-6">
        <span>Tổng cộng</span>
        <span className="text-xl text-primary">{formatCurrency(totals.total)}</span>
      </div>

      <div className="flex flex-col gap-4">
        {primaryHref ? (
          <Link
            to={primaryHref}
            className={`w-full text-center py-3.5 rounded-full font-semibold shadow-lg transition-all ${
              primaryDisabled
                ? 'bg-muted text-foreground/40 cursor-not-allowed'
                : 'bg-primary text-white hover:shadow-xl hover:bg-primary/90'
            }`}
            aria-disabled={primaryDisabled}
            onClick={(event) => {
              if (primaryDisabled) {
                event.preventDefault();
              }
            }}
          >
            {primaryLabel}
          </Link>
        ) : (
          <button
            className={`w-full py-3.5 rounded-full font-semibold shadow-lg transition-all ${
              primaryDisabled
                ? 'bg-muted text-foreground/40 cursor-not-allowed'
                : 'bg-primary text-white hover:shadow-xl hover:bg-primary/90'
            }`}
            disabled={primaryDisabled}
          >
            {primaryLabel}
          </button>
        )}

        {secondaryHref ? (
          <Link
            to={secondaryHref}
            className="w-full text-center border border-border text-foreground/70 py-3 rounded-full font-semibold hover:bg-muted transition-colors"
          >
            {secondaryLabel}
          </Link>
        ) : (
          <button className="w-full border border-border text-foreground/70 py-3 rounded-full font-semibold hover:bg-muted transition-colors">
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
