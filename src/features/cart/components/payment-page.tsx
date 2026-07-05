import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import CartHeader from './cart-header';
import CartSteps from './cart-steps';
import OrderSummary from './order-summary';
import Layout from '../../../components/layout/layout';
import { createOrder } from '../../../lib/api/orders';
import { useCartStore } from '../store/cart-store';
import { toast } from 'react-toastify';
import { 
  fetchMyVouchers, 
  calculateOrderPromotions, 
  applyWalletVoucher, 
  type ClientVoucherWallet
} from '../../admin/servers/promotions';

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

const tierLabels: Record<string, string> = {
  bronze: 'Đồng (Bronze)',
  silver: 'Bạc (Silver)',
  gold: 'Vàng (Gold)',
  platinum: 'Kim cương (Platinum)'
};

const tierColors: Record<string, string> = {
  bronze: 'bg-amber-100 text-amber-800 border-amber-200',
  silver: 'bg-slate-100 text-slate-800 border-slate-200',
  gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  platinum: 'bg-purple-100 text-purple-800 border-purple-200'
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const previewTotals = useCartStore((state) => state.previewTotals);
  const isPreviewLoading = useCartStore((state) => state.isPreviewLoading);
  const fetchPreview = useCartStore((state) => state.fetchPreview);
  const getTotals = useCartStore((state) => state.getTotals);
  const shippingInfo = useCartStore((state) => state.shippingInfo);
  const clearCart = useCartStore((state) => state.clear);
  const resetShippingInfo = useCartStore((state) => state.resetShippingInfo);
  const setAppliedVoucher = useCartStore((state) => state.setAppliedVoucher);

  // Promotions & Wallet States
  const [walletData, setWalletData] = useState<ClientVoucherWallet | null>(null);
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [selectedWalletVoucherId, setSelectedWalletVoucherId] = useState<string | null>(null);
  const [engineAppliedVoucherId, setEngineAppliedVoucherId] = useState<string | null>(null);
  
  const [discountOverride, setDiscountOverride] = useState<number | null>(null);
  const [totalOverride, setTotalOverride] = useState<number | null>(null);
  const [discountBreakdown, setDiscountBreakdown] = useState<{ flashSale: number; combo: number; voucher: number } | null>(null);

  useEffect(() => {
    fetchPreview();
  }, [fetchPreview, items]);

  const readCookie = (name: string) => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  };

  // Fetch personal vouchers wallet
  useEffect(() => {
    const firebaseUid = readCookie('userId');
    if (firebaseUid) {
      fetchMyVouchers(firebaseUid).then((data) => {
        if (data) setWalletData(data);
      });
    }
  }, []);

  const runPromoEngine = async (codeStr?: string, walletVId?: string) => {
    const firebaseUid = readCookie('userId') ?? undefined;
    const orderItems = items.map((item) => ({
      productId: item.productId ?? String(item.id),
      quantity: item.quantity,
    }));

    try {
      let res;
      if (walletVId) {
        res = await applyWalletVoucher({
          userVoucherId: walletVId,
          firebaseUid,
          items: orderItems,
        });
      } else {
        res = await calculateOrderPromotions({
          code: codeStr,
          firebaseUid,
          items: orderItems,
        });
      }

      if (res) {
        if (res.voucherError) {
          toast.error(res.voucherError);
          // Reset overrides on error
          setDiscountOverride(null);
          setTotalOverride(null);
          setDiscountBreakdown(null);
          setEngineAppliedVoucherId(null);
          setSelectedWalletVoucherId(null);
        } else {
          setDiscountOverride(res.totalDiscount);
          setTotalOverride(res.total);
          setDiscountBreakdown({
            flashSale: res.flashSaleDiscount || 0,
            combo: res.comboDiscount || 0,
            voucher: res.voucherDiscount || 0,
          });
          setEngineAppliedVoucherId(res.appliedVoucherId);
          if (walletVId) {
            setSelectedWalletVoucherId(walletVId);
          } else {
            setSelectedWalletVoucherId(null);
          }
          toast.success('Áp dụng ưu đãi thành công!');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi áp dụng khuyến mãi.');
    }
  };

  const fallbackTotals = useMemo(() => getTotals(), [getTotals]);
  const totals =
    items.length > 0 && !isPreviewLoading && previewTotals.subtotal > 0
      ? previewTotals
      : fallbackTotals;

  // Compute final totals after custom promotion engine overrides
  const computedTotals = useMemo(() => {
    return {
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      discount: discountOverride !== null ? discountOverride : totals.discount,
      total: totalOverride !== null ? totalOverride : totals.total,
    };
  }, [totals, discountOverride, totalOverride]);

  const address = useMemo(() => {
    return [shippingInfo.addressDetail, shippingInfo.wardName, shippingInfo.provinceName]
      .filter(Boolean)
      .join(', ');
  }, [shippingInfo.addressDetail, shippingInfo.provinceName, shippingInfo.wardName]);

  const paymentMethod = useMemo(() => {
    const mapping: Record<string, string> = {
      cod: 'COD',
      vietqr: 'VietQR',
      momo: 'MOMO',
      vnpay: 'VNPAY',
    };
    return mapping[selected] ?? 'COD';
  }, [selected]);

  const isOrderReady = useMemo(() => {
    return (
      items.length > 0 &&
      shippingInfo.fullName.trim().length > 0 &&
      shippingInfo.phoneNumber.trim().length > 0 &&
      shippingInfo.addressDetail.trim().length > 0 &&
      Boolean(shippingInfo.provinceId) &&
      Boolean(shippingInfo.wardId)
    );
  }, [items.length, shippingInfo]);

  const handleSubmit = async () => {
    if (isSubmitting || !isOrderReady) return;
    setIsSubmitting(true);

    try {
      const firebaseUid = readCookie('userId') ?? undefined;
      const payload = {
        firebaseUid,
        customer: {
          name: shippingInfo.fullName,
          phone: shippingInfo.phoneNumber,
        },
        address,
        note: shippingInfo.note || undefined,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId ?? String(item.id),
          quantity: item.quantity,
        })),
        shippingFee: computedTotals.shipping,
        discount: computedTotals.discount,
        appliedVoucherId: engineAppliedVoucherId ?? undefined,
        userVoucherId: selectedWalletVoucherId ?? undefined,
      };

      const result = await createOrder(payload);
      if (result?._id) {
        toast.success('Đặt hàng thành công!');
        clearCart();
        resetShippingInfo();
        setAppliedVoucher(null);
        if (selected === 'vnpay' && result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          navigate('/');
        }
      } else {
        toast.error('Đặt hàng thất bại. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Đặt hàng thất bại. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // VietQR generation
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const [qrContent, setQrContent] = useState<string>('');
  const bankName = import.meta.env.VITE_VIETQR_BANK_NAME ?? 'Ngân hàng';
  const bankAccount = import.meta.env.VITE_VIETQR_ACCOUNT_NO ?? '';
  const accountName = import.meta.env.VITE_VIETQR_ACCOUNT_NAME ?? '';
  const transferPrefix = import.meta.env.VITE_VIETQR_TRANSFER_PREFIX ?? 'PAY';

  useEffect(() => {
    if (selected !== 'vietqr') {
      setQrSrc(null);
      return;
    }

    const amount = (computedTotals?.total ?? 0) || 0;
    const suffix = String(Date.now()).slice(-4);
    const content = `${transferPrefix} ${suffix}`;
    setQrContent(content);

    const payload = `VietQR\nBANK:${bankName}\nACC:${bankAccount}\nNAME:${accountName}\nAMOUNT:${amount}\nCONTENT:${content}`;

    let mounted = true;
    QRCode.toDataURL(payload, { margin: 1, width: 300 })
      .then((url) => {
        if (mounted) setQrSrc(url);
      })
      .catch(() => {
        if (mounted) setQrSrc(null);
      });

    return () => {
      mounted = false;
    };
  }, [selected, computedTotals]);

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
              {/* Delivery Info */}
              <div className="glass rounded-3xl border border-border/60 p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="text-lg font-bold text-foreground">Thông tin giao hàng</h3>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">Đã xác nhận</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm">
                  <div className="flex flex-col gap-2">
                    <span className="text-foreground/50 uppercase tracking-wider text-xs">Người nhận</span>
                    <span className="font-semibold text-foreground">{shippingInfo.fullName || '---'}</span>
                    <span className="text-foreground/70">{shippingInfo.phoneNumber || '---'}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-foreground/50 uppercase tracking-wider text-xs">Địa chỉ giao hàng</span>
                    <span className="font-semibold text-foreground">{address || '---'}</span>
                  </div>
                </div>
              </div>

              {/* Promotions Engine and Voucher Wallet */}
              <div className="glass rounded-3xl border border-border/60 p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="text-lg font-bold text-foreground">Mã giảm giá & Hạng thành viên</h3>
                  {walletData?.tier && (
                    <span className={`inline-block px-3 py-1 text-xs font-bold border rounded-full ${tierColors[walletData.tier] || ''}`}>
                      Thành viên: {tierLabels[walletData.tier]}
                    </span>
                  )}
                </div>

                {/* Direct code apply input */}
                <div className="flex gap-3 max-w-md">
                  <input
                    type="text"
                    value={voucherCodeInput}
                    onChange={(e) => setVoucherCodeInput(e.target.value)}
                    placeholder="Nhập mã voucher (ví dụ: SUMMER50)..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-white text-sm outline-none uppercase font-mono"
                  />
                  <button
                    onClick={() => runPromoEngine(voucherCodeInput)}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Áp dụng
                  </button>
                </div>

                {/* Vouchers list from wallet */}
                {walletData && walletData.vouchers.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Ví Voucher của bạn</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {walletData.vouchers.map((v) => {
                        const isSelected = selectedWalletVoucherId === v.id;
                        return (
                          <div 
                            key={v.id} 
                            onClick={() => runPromoEngine(undefined, v.id)}
                            className={`p-4 rounded-2xl border bg-white/50 cursor-pointer transition-all flex flex-col justify-between gap-2 hover:shadow-md ${
                              isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border/60'
                            }`}
                          >
                            <div>
                              <p className="font-bold text-foreground text-sm flex items-center justify-between">
                                <span>{v.name}</span>
                                {v.code && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">{v.code}</span>}
                              </p>
                              {v.description && <p className="text-xs text-foreground/60 mt-1">{v.description}</p>}
                            </div>
                            <div className="flex justify-between items-center mt-2 border-t border-dashed border-border/60 pt-2">
                              <span className="text-[10px] text-foreground/40 font-medium">Hạn dùng: {new Date(v.expiresAt).toLocaleDateString('vi-VN')}</span>
                              <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-foreground/75'}`}>
                                {isSelected ? 'Đang chọn' : 'Áp dụng'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Custom discount breakdown breakdown */}
                {discountBreakdown && (discountBreakdown.flashSale > 0 || discountBreakdown.combo > 0 || discountBreakdown.voucher > 0) && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm space-y-2">
                    <p className="font-bold text-foreground/75 text-xs uppercase tracking-wider mb-2">Chi tiết ưu đãi áp dụng:</p>
                    {discountBreakdown.flashSale > 0 && (
                      <div className="flex justify-between text-foreground/80">
                        <span>Giảm giá trực tiếp Flash Sale:</span>
                        <span className="font-semibold text-rose-600">-{formatCurrency(discountBreakdown.flashSale)}</span>
                      </div>
                    )}
                    {discountBreakdown.combo > 0 && (
                      <div className="flex justify-between text-foreground/80">
                        <span>Giảm giá Combo sản phẩm:</span>
                        <span className="font-semibold text-rose-600">-{formatCurrency(discountBreakdown.combo)}</span>
                      </div>
                    )}
                    {discountBreakdown.voucher > 0 && (
                      <div className="flex justify-between text-foreground/80">
                        <span>Giảm giá mã Voucher:</span>
                        <span className="font-semibold text-rose-600">-{formatCurrency(discountBreakdown.voucher)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Methods */}
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
                {selected === 'vietqr' && (
                  <div className="mt-6 p-6 rounded-2xl bg-rose-50 border border-rose-100">
                    <div className="flex gap-6 items-start">
                      <div className="flex-shrink-0 bg-white p-4 rounded-lg shadow-sm">
                        {qrSrc ? (
                          <img src={qrSrc} alt="QR code" className="w-48 h-48 object-cover" />
                        ) : (
                          <div className="w-48 h-48 bg-white/50 flex items-center justify-center text-sm text-foreground/60">QR đang tải...</div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-xs text-foreground/50 uppercase tracking-wider">Ngân hàng</p>
                            <p className="font-semibold text-foreground">{bankName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-foreground/50 uppercase tracking-wider">Số tài khoản</p>
                            <p className="font-semibold text-foreground">{bankAccount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-foreground/50 uppercase tracking-wider">Chủ tài khoản</p>
                            <p className="font-semibold text-foreground">{accountName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-foreground/50 uppercase tracking-wider">Số tiền</p>
                            <p className="font-semibold text-rose-600">{formatCurrency(computedTotals?.total ?? 0)}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-xs text-foreground/50 uppercase tracking-wider">Nội dung chuyển khoản</p>
                          <div className="mt-2 p-3 border-dashed border border-border rounded-md bg-white">{qrContent}</div>
                        </div>

                        <p className="text-sm text-foreground/60">Vui lòng chuyển đúng số tiền và đúng nội dung để hệ thống xác nhận nhanh hơn.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <OrderSummary
              totals={computedTotals}
              formatCurrency={formatCurrency}
              primaryLabel="Xác nhận thanh toán"
              primaryDisabled={!isOrderReady || isSubmitting}
              onPrimaryClick={handleSubmit}
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
