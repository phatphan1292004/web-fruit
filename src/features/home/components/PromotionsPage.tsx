import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTag, FiCopy, FiCheckCircle, FiClock, FiPercent, FiTruck, FiGift, FiInfo } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DefaultLayout from '../../../components/layout/layout';
import { fetchPublicVouchers, claimVoucher, type PublicVoucherPromo } from '../../admin/servers/promotions';

const bgImages = [
  '/images/promo_fruits.png',
  '/images/promo_citrus.png',
  '/images/promo_berries.png',
];

const readCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

function formatDiscount(v: PublicVoucherPromo): string {
  if (v.config.discountType === 'percentage') return `Giảm ${v.config.discountValue}%`;
  return `Giảm ${v.config.discountValue.toLocaleString('vi-VN')}đ`;
}

function VoucherCard({ voucher, isShipping, onClaimSuccess }: { voucher: PublicVoucherPromo; isShipping: boolean; onClaimSuccess?: () => void }) {
  const [copied, setCopied] = useState(false);
  const daysLeft = Math.ceil((new Date(voucher.endDate).getTime() - Date.now()) / 86_400_000);

  const handleCopy = async () => {
    if (!voucher.code) return;
    
    // Copy code to clipboard
    await navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    const firebaseUid = readCookie('userId');
    if (!firebaseUid) {
      toast.info(`Đã copy mã "${voucher.code}"! Đăng nhập để lưu voucher vào ví.`);
      return;
    }

    try {
      const res = await claimVoucher(voucher._id, firebaseUid);
      if (res) {
        toast.success(`Đã lưu voucher "${voucher.code}" vào ví thành công!`);
        onClaimSuccess?.();
      } else {
        toast.info(`Mã "${voucher.code}" đã có trong ví của bạn hoặc đã hết lượt nhận.`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi lưu voucher');
    }
  };

  // Color themes based on voucher category
  const theme = isShipping
    ? {
        border: 'border-sky-100 hover:border-sky-300',
        bgGradient: 'from-sky-400 to-blue-500',
        badgeBg: 'bg-sky-50 text-sky-700 border border-sky-200',
        codeBg: 'bg-sky-50 text-sky-700',
        buttonBg: 'bg-sky-500 hover:bg-sky-600 text-white',
        textTheme: 'text-sky-700',
        icon: <FiTruck className="w-4 h-4" />
      }
    : {
        border: 'border-emerald-100 hover:border-emerald-300',
        bgGradient: 'from-emerald-400 to-teal-500',
        badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        codeBg: 'bg-emerald-50 text-emerald-700',
        buttonBg: 'bg-emerald-500 hover:bg-emerald-600 text-white',
        textTheme: 'text-emerald-700',
        icon: <FiTag className="w-4 h-4" />
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white rounded-3xl border-2 ${theme.border} flex overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full min-h-[175px]`}
    >
      {/* Top indicator color strip */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.bgGradient}`} />

      {/* Ticket hollow punch cutouts */}
      <div className="absolute right-[112px] -top-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-200/50 z-10" />
      <div className="absolute right-[112px] -bottom-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-200/50 z-10" />

      {/* Card Content body */}
      <div className="flex w-full">
        {/* Left side: Voucher information */}
        <div className="flex-1 p-5 pt-6 flex flex-col justify-between">
          <div>
            {/* Category tag */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase mb-3 ${theme.badgeBg}`}>
              {theme.icon}
              {isShipping ? 'Vận Chuyển' : 'Giảm Giá Mua Sắm'}
            </div>

            <h3 className="text-sm font-bold text-slate-800 mb-1 leading-snug line-clamp-1">{voucher.name}</h3>
            
            {/* Massive Discount Display */}
            <p className="text-2xl font-black text-rose-500 tracking-tight mb-1">{formatDiscount(voucher)}</p>

            {voucher.config.minOrderValue ? (
              <p className="text-xs text-slate-400 font-bold">Đơn tối thiểu {voucher.config.minOrderValue.toLocaleString('vi-VN')}đ</p>
            ) : (
              <p className="text-xs text-slate-400 font-bold">Mọi giá trị đơn hàng</p>
            )}

            {voucher.description && (
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">{voucher.description}</p>
            )}
          </div>

          <div className={`inline-flex items-center gap-1.5 mt-4 text-[11px] font-bold ${daysLeft <= 3 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
            <FiClock className="w-3.5 h-3.5" />
            {daysLeft > 0 ? `Hạn dùng: còn ${daysLeft} ngày` : 'Hết hạn hôm nay'}
          </div>
        </div>

        {/* Vertical divider dashed line */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-px h-[80%] border-l-2 border-dashed border-slate-200" />
        </div>

        {/* Right side: Action / Copy */}
        <div className="w-28 flex flex-col items-center justify-center p-3 gap-2.5 shrink-0 z-10">
          {voucher.code ? (
            <>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest text-center">Mã Coupon</p>
              <code className="text-xs font-black bg-slate-50 border border-slate-100 text-slate-700 px-2 py-1 rounded-xl text-center break-all leading-tight font-mono tracking-wider w-full select-all">
                {voucher.code}
              </code>
              <button
                onClick={handleCopy}
                className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100 scale-95'
                    : `${theme.buttonBg} shadow-md shadow-slate-100 hover:scale-105`
                }`}
              >
                {copied ? <FiCheckCircle className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                {copied ? 'Đã lưu' : 'Lưu mã'}
              </button>
            </>
          ) : (
            <>
              <FiPercent className="w-7 h-7 text-slate-300" />
              <p className="text-[9px] text-slate-400 text-center leading-tight font-bold uppercase tracking-wider">Tự động áp dụng</p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const PromotionsPage = () => {
  const [vouchers, setVouchers] = useState<PublicVoucherPromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);

  const loadVouchers = () => {
    const firebaseUid = readCookie('userId') ?? undefined;
    fetchPublicVouchers(firebaseUid)
      .then((data) => setVouchers(data || []))
      .catch(() => setVouchers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Split vouchers into Ship discounts and general Order discounts
  const shipVouchers = vouchers.filter(
    (v) =>
      v.name.toLowerCase().includes('ship') ||
      v.name.toLowerCase().includes('vận chuyển') ||
      v.description?.toLowerCase().includes('ship') ||
      v.description?.toLowerCase().includes('vận chuyển')
  );
  
  const discountVouchers = vouchers.filter(
    (v) =>
      !v.name.toLowerCase().includes('ship') &&
      !v.name.toLowerCase().includes('vận chuyển') &&
      !v.description?.toLowerCase().includes('ship') &&
      !v.description?.toLowerCase().includes('vận chuyển')
  );

  return (
    <DefaultLayout mainClassName="bg-slate-50 relative pt-16 sm:pt-20 min-h-screen">
      {/* Banner / Header */}
      <div className="relative bg-emerald-950 py-16 md:py-24 text-white text-center overflow-hidden">
        {/* Animated background images slideshow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url('${bgImages[currentBg]}')` }}
          />
        </AnimatePresence>

        {/* Dark emerald overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/85 to-teal-950/90 pointer-events-none" />

        {/* Abstract vector backgrounds */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-4.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-white/10"
          >
            <FiGift className="text-amber-300 animate-bounce" />
            Săn Voucher Nhận Deal Hời
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight"
          >
            🎟️ Kho Mã Khuyến Mãi & Freeship
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-50 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium opacity-90"
          >
            Chọn lựa các mã miễn/giảm phí vận chuyển và mã giảm giá thanh toán. Sao chép trực tiếp mã ưu đãi để áp dụng khi thanh toán đặt hàng!
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 max-w-7xl">
        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && vouchers.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm max-w-lg mx-auto">
            <FiPercent className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-700">Chưa có mã giảm giá nào</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto font-medium">
              Hiện tại hệ thống chưa phát hành chương trình giảm giá công khai nào. Bạn hãy quay lại sau nhé!
            </p>
          </div>
        )}

        {!loading && vouchers.length > 0 && (
          <div className="space-y-12">
            
            {/* Shipping Vouchers Group */}
            {shipVouchers.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                    <FiTruck className="w-4.5 h-4.5" />
                  </div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">🚚 Ưu Đãi Vận Chuyển (Freeship)</h2>
                  <span className="bg-sky-50 text-sky-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-sky-100">
                    {shipVouchers.length} ưu đãi
                  </span>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shipVouchers.map((v) => (
                    <VoucherCard key={v._id} voucher={v} isShipping={true} onClaimSuccess={loadVouchers} />
                  ))}
                </div>
              </div>
            )}

            {/* Discount Vouchers Group */}
            {discountVouchers.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <FiTag className="w-4.5 h-4.5" />
                  </div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">🎁 Ưu Đãi Giảm Giá Đơn Hàng</h2>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-100">
                    {discountVouchers.length} ưu đãi
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {discountVouchers.map((v) => (
                    <VoucherCard key={v._id} voucher={v} isShipping={false} onClaimSuccess={loadVouchers} />
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Hint Alert banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3.5 max-w-3xl mx-auto mt-12 shadow-sm">
              <FiInfo className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-amber-800 uppercase tracking-wider mb-1">Lưu ý khi áp dụng ưu đãi</p>
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  Các mã voucher công khai ở trên có thể được sao chép và nhập thủ công tại bước thanh toán. Trong quá trình đặt hàng, bạn có thể áp dụng đồng thời cả mã Freeship cùng với 1 voucher mua sắm hoặc ưu đãi combo thành viên để nhận mức chiết khấu tốt nhất!
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default PromotionsPage;
