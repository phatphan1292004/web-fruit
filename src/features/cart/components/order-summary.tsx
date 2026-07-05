import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTag, FiPercent } from 'react-icons/fi';
import { ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import type { CartTotals } from './types';
import { useCartStore } from '../store/cart-store';
import { store } from '../../../integrations';

import type { ClientVoucherWallet } from '../../admin/servers/promotions';

type OrderSummaryProps = {
  totals: CartTotals;
  formatCurrency: (value: number) => string;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryHref?: string;
  secondaryHref?: string;
  primaryDisabled?: boolean;
  onPrimaryClick?: () => void;
  hideVoucherSection?: boolean;
  isCheckoutPage?: boolean;
  walletData?: ClientVoucherWallet | null;
  voucherCodeInput?: string;
  setVoucherCodeInput?: (val: string) => void;
  selectedWalletVoucherId?: string | null;
  engineAppliedVoucherId?: string | null;
  onApplyVoucher?: (codeStr?: string, walletVId?: string) => void;
  discountBreakdown?: { flashSale: number; combo: number; voucher: number } | null;
};

const OrderSummary = ({
  totals,
  formatCurrency,
  primaryLabel = 'Đặt hàng',
  secondaryLabel = 'Tiếp tục mua sắm',
  primaryHref,
  secondaryHref,
  primaryDisabled = false,
  onPrimaryClick,
  hideVoucherSection = false,
  isCheckoutPage = false,
  walletData = null,
  voucherCodeInput = '',
  setVoucherCodeInput,
  selectedWalletVoucherId = null,
  engineAppliedVoucherId = null,
  onApplyVoucher,
  discountBreakdown = null,
}: OrderSummaryProps) => {
  const appliedVoucher = useCartStore((state) => state.appliedVoucher);
  const setAppliedVoucher = useCartStore((state) => state.setAppliedVoucher);

  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [customCode, setCustomCode] = useState('');

  // Fetch active vouchers from DB
  useEffect(() => {
    let isActive = true;
    store
      .get<any[]>('/vouchers', undefined, [])
      .then((data) => {
        if (!isActive) return;
        setAvailableVouchers(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('Failed to load vouchers in checkout summary', err));

    return () => {
      isActive = false;
    };
  }, []);

  const handleApplyVoucher = (voucher: any) => {
    const isEligible = totals.subtotal >= (voucher.minOrderValue ?? 0);
    if (!isEligible) {
      toast.error(`Đơn hàng tối thiểu để áp dụng mã này là ${formatCurrency(voucher.minOrderValue)}`);
      return;
    }
    setAppliedVoucher(voucher);
    toast.success(`Áp dụng mã ${voucher.code} thành công!`);
  };

  const handleApplyCustomCode = () => {
    if (!customCode.trim()) return;
    const found = availableVouchers.find((v) => v.code.toUpperCase() === customCode.trim().toUpperCase());
    if (!found) {
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
      return;
    }
    handleApplyVoucher(found);
    setCustomCode('');
  };

  return (
    <div className="glass rounded-3xl border border-border/60 p-6 md:p-7 h-fit sticky top-24 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <h3 className="text-lg font-bold text-foreground mb-6">Tóm tắt đơn hàng</h3>
      
      {/* Item summary */}
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

      {/* Applied voucher card or selector for standard cart/shipping page */}
      {!isCheckoutPage && !hideVoucherSection && (
        appliedVoucher ? (
          <div className="flex items-center justify-between bg-primary/10 border border-dashed border-primary/40 rounded-2xl px-4 py-3 text-xs text-primary font-bold my-5">
            <span className="flex items-center gap-1.5 shrink-0">
              <FiTag className="w-3.5 h-3.5" />
              <span className="tracking-wider uppercase">{appliedVoucher.code}</span>
              <span className="font-semibold opacity-75">(-{formatCurrency(appliedVoucher.discountAmount ?? 0)})</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setAppliedVoucher(null);
                toast.info('Đã hủy áp dụng mã giảm giá');
              }}
              className="text-foreground/60 hover:text-foreground text-[10px] uppercase font-bold tracking-wider"
            >
              Gỡ
            </button>
          </div>
        ) : (
          <div className="my-5 space-y-3 pt-4 border-t border-dashed border-border/60">
            <span className="text-xs font-bold text-foreground/75 block">Khuyến mãi / Voucher</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập mã giảm giá..."
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                className="flex-1 rounded-xl border border-border bg-white px-3 py-2.5 text-xs font-semibold outline-none focus:border-primary transition-all uppercase placeholder:normal-case"
              />
              <button
                type="button"
                onClick={handleApplyCustomCode}
                className="bg-primary/10 border border-primary/20 text-primary font-bold text-xs rounded-xl px-4 py-2.5 hover:bg-primary hover:text-white transition-all shrink-0"
              >
                Áp dụng
              </button>
            </div>
            
            {availableVouchers.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full flex items-center justify-between rounded-xl border border-border bg-neutral-50/50 px-3.5 py-2.5 text-xs font-bold text-foreground/75 hover:bg-neutral-50 transition-all text-left"
                >
                  <span className="flex items-center gap-1.5"><FiPercent className="text-primary w-3.5 h-3.5" /> Xem danh sách mã giảm giá</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>
                
                {showDropdown && (
                  <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-border rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto p-1.5 space-y-1">
                    {availableVouchers.map((voucher) => {
                      const isEligible = totals.subtotal >= (voucher.minOrderValue ?? 0);
                      return (
                        <button
                          key={voucher._id || voucher.id}
                          type="button"
                          onClick={() => {
                            handleApplyVoucher(voucher);
                            setShowDropdown(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex flex-col gap-1 ${
                            isEligible 
                              ? 'hover:bg-primary/5 text-foreground'
                              : 'opacity-50 cursor-not-allowed bg-neutral-50/20'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold text-primary text-xs uppercase tracking-wider">{voucher.code}</span>
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              Giảm {formatCurrency(voucher.discountAmount)}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-foreground/50">{voucher.condition}</span>
                          {!isEligible && (
                            <span className="text-[9px] font-bold text-rose-500">Chưa đủ điều kiện đơn từ {formatCurrency(voucher.minOrderValue)}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      )}

      {/* ─── NEW CHECKOUT PROMOTION INTEGRATION (Replacing the old system) ─── */}
      {isCheckoutPage && (
        <div className="my-5 space-y-3 pt-4 border-t border-dashed border-border/60">
          <span className="text-xs font-bold text-foreground/75 block">Khuyến mãi / Voucher</span>
          
          {/* If a voucher is currently applied, show its active badge with a "Gỡ" button */}
          {selectedWalletVoucherId || engineAppliedVoucherId ? (
            (() => {
              // Find details of the applied wallet voucher
              const appliedWalletV = walletData?.vouchers.find(
                (v) => String(v.id) === String(selectedWalletVoucherId)
              );
              // Or custom code applied by typing
              const codeName = appliedWalletV?.code || voucherCodeInput || 'Mã giảm giá';
              const discountValueStr = totals.discount > 0 ? `-${formatCurrency(totals.discount)}` : 'Đang tính...';

              return (
                <div className="flex items-center justify-between bg-primary/10 border border-dashed border-primary/40 rounded-2xl px-4 py-3 text-xs text-primary font-bold my-3">
                  <span className="flex items-center gap-1.5 shrink-0 min-w-0">
                    <FiTag className="w-3.5 h-3.5 shrink-0" />
                    <span className="tracking-wider uppercase truncate">{codeName}</span>
                    <span className="font-semibold opacity-75 whitespace-nowrap">({discountValueStr})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      // Call apply with empty strings to clear the voucher
                      onApplyVoucher?.('', '');
                      if (setVoucherCodeInput) setVoucherCodeInput('');
                      toast.info('Đã hủy áp dụng mã giảm giá');
                    }}
                    className="text-foreground/60 hover:text-foreground text-[10px] uppercase font-bold tracking-wider shrink-0"
                  >
                    Gỡ
                  </button>
                </div>
              );
            })()
          ) : (
            /* Otherwise, show the input + dropdown to apply */
            <>
              {/* Direct code apply input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá..."
                  value={voucherCodeInput}
                  onChange={(e) => setVoucherCodeInput?.(e.target.value.toUpperCase())}
                  className="flex-1 rounded-xl border border-border bg-white px-3 py-2.5 text-xs font-semibold outline-none focus:border-primary transition-all uppercase placeholder:normal-case font-mono"
                />
                <button
                  type="button"
                  onClick={() => onApplyVoucher?.(voucherCodeInput)}
                  className="bg-primary/10 border border-primary/20 text-primary font-bold text-xs rounded-xl px-4 py-2.5 hover:bg-primary hover:text-white transition-all shrink-0"
                >
                  Áp dụng
                </button>
              </div>

              {/* Wallet vouchers inside dropdown */}
              {walletData && walletData.vouchers.length > 0 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full flex items-center justify-between rounded-xl border border-border bg-neutral-50/50 px-3.5 py-2.5 text-xs font-bold text-foreground/75 hover:bg-neutral-50 transition-all text-left"
                  >
                    <span className="flex items-center gap-1.5">
                      <FiPercent className="text-primary w-3.5 h-3.5" /> 
                      Xem danh sách mã giảm giá ({walletData.vouchers.length})
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-border rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto p-1.5 space-y-1">
                      {walletData.vouchers.map((voucher) => {
                        const discountStr = voucher.config?.discountType === 'percentage'
                          ? `Giảm ${voucher.config.discountValue}%`
                          : `Giảm ${voucher.config.discountValue.toLocaleString('vi-VN')}đ`;
                        const isEligible = totals.subtotal >= (voucher.config?.minOrderValue ?? 0);

                        return (
                          <button
                            key={voucher.id}
                            type="button"
                            disabled={!isEligible}
                            onClick={() => {
                              onApplyVoucher?.(undefined, voucher.id);
                              setShowDropdown(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl transition-all flex flex-col gap-1 ${
                              isEligible 
                                ? 'hover:bg-primary/5 text-foreground cursor-pointer'
                                : 'opacity-50 cursor-not-allowed bg-neutral-50/20'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-bold text-primary text-xs uppercase tracking-wider">
                                {voucher.code || 'VÉ VÍ'}
                              </span>
                              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {discountStr}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-700">{voucher.name}</span>
                            <span className="text-[9px] font-semibold text-foreground/50">
                              {voucher.description || `Đơn tối thiểu ${(voucher.config?.minOrderValue ?? 0).toLocaleString('vi-VN')}đ`}
                            </span>
                            {!isEligible && (
                              <span className="text-[9px] font-bold text-rose-500">
                                Chưa đủ điều kiện đơn từ {formatCurrency(voucher.config?.minOrderValue ?? 0)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Applied discount breakdown */}
          {discountBreakdown && (discountBreakdown.flashSale > 0 || discountBreakdown.combo > 0 || discountBreakdown.voucher > 0) && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <p className="font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">Chi tiết ưu đãi:</p>
              {discountBreakdown.flashSale > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Flash Sale trực tiếp:</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(discountBreakdown.flashSale)}</span>
                </div>
              )}
              {discountBreakdown.combo > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Combo giảm giá:</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(discountBreakdown.combo)}</span>
                </div>
              )}
              {discountBreakdown.voucher > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Voucher mã:</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(discountBreakdown.voucher)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
                return;
              }
              onPrimaryClick?.();
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
            onClick={onPrimaryClick}
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
