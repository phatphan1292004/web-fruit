import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Copy, CheckCircle, Clock, Star, Gift, UserPlus, Percent, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchPublicVouchers, type PublicVoucherPromo } from '../../admin/servers/promotions';

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  voucher_code: {
    label: 'Nhập mã',
    icon: <Tag className="w-4 h-4" />,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  new_user: {
    label: 'Người mới',
    icon: <UserPlus className="w-4 h-4" />,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  member_tier: {
    label: 'Thành viên',
    icon: <Star className="w-4 h-4" />,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  combo: {
    label: 'Combo',
    icon: <Gift className="w-4 h-4" />,
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
};

const tierLabels: Record<string, string> = {
  bronze: '🥉 Hạng Đồng',
  silver: '🥈 Hạng Bạc',
  gold: '🥇 Hạng Vàng',
  platinum: '💎 Kim Cương',
};

function formatDiscount(v: PublicVoucherPromo): string {
  if (v.config.discountType === 'percentage') return `Giảm ${v.config.discountValue}%`;
  return `Giảm ${v.config.discountValue.toLocaleString('vi-VN')}đ`;
}

function VoucherCard({ voucher }: { voucher: PublicVoucherPromo }) {
  const [copied, setCopied] = useState(false);
  const conf = typeConfig[voucher.type] ?? typeConfig.voucher_code;
  const daysLeft = Math.ceil((new Date(voucher.endDate).getTime() - Date.now()) / 86_400_000);

  const handleCopy = async () => {
    if (!voucher.code) return;
    await navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    toast.success(`Đã copy mã "${voucher.code}"!`, { autoClose: 2000 });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-white rounded-2xl border-2 ${conf.border} overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
    >
      {/* Top colored strip */}
      <div className={`h-1.5 w-full ${conf.bg.replace('bg-', 'bg-gradient-to-r from-').replace('-50', '-300 to-' + conf.color.split('-')[1] + '-500')}`} />

      {/* Zigzag separator simulation */}
      <div className="flex">
        {/* Left portion */}
        <div className="flex-1 p-4">
          {/* Type badge */}
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold mb-3 ${conf.bg} ${conf.color}`}>
            {conf.icon}
            {conf.label}
          </div>

          <h3 className="text-sm font-bold text-slate-800 mb-1 leading-tight">{voucher.name}</h3>

          <p className="text-xl font-extrabold text-red-500 mb-1">{formatDiscount(voucher)}</p>

          {voucher.config.minOrderValue ? (
            <p className="text-xs text-slate-400">Đơn từ {voucher.config.minOrderValue.toLocaleString('vi-VN')}đ</p>
          ) : (
            <p className="text-xs text-slate-400">Không giới hạn đơn hàng</p>
          )}

          {voucher.type === 'member_tier' && voucher.config.targetMemberTier && (
            <p className="text-xs text-amber-600 font-medium mt-1">
              {tierLabels[voucher.config.targetMemberTier]}
            </p>
          )}

          {voucher.type === 'new_user' && (
            <p className="text-xs text-blue-600 font-medium mt-1">Dành cho tài khoản mới</p>
          )}

          <div className={`inline-flex items-center gap-1 mt-3 text-xs ${daysLeft <= 3 ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>
            <Clock className="w-3 h-3" />
            {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Hết hôm nay'}
          </div>
        </div>

        {/* Divider */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-px h-full border-l-2 border-dashed border-slate-200" />
        </div>

        {/* Right portion: code + copy */}
        <div className="w-28 flex flex-col items-center justify-center p-3 gap-2">
          {voucher.code ? (
            <>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Mã của bạn</p>
              <code className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg text-center break-all leading-tight">
                {voucher.code}
              </code>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100'
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Đã copy' : 'Copy'}
              </button>
            </>
          ) : (
            <>
              <Percent className="w-8 h-8 text-slate-300" />
              <p className="text-[10px] text-slate-400 text-center leading-tight">Tự động áp dụng</p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const PromoBanner = () => {
  const [vouchers, setVouchers] = useState<PublicVoucherPromo[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const perPage = 4;

  useEffect(() => {
    fetchPublicVouchers()
      .then((data) => setVouchers(data || []))
      .catch(() => setVouchers([]))
      .finally(() => setLoading(false));
  }, []);

  // Fallback static banner if no vouchers
  if (!loading && vouchers.length === 0) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-primary to-emerald-600 shadow-2xl">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-10 md:p-20">
              <div className="flex flex-col items-start gap-6">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                  <span className="text-white font-medium tracking-wider text-sm uppercase">Ưu đãi hấp dẫn</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Mua sắm thông minh <span className="text-accent">tiết kiệm hơn</span>
                </h2>
                <p className="text-white/80 text-lg max-w-md">
                  Đăng nhập để nhận voucher độc quyền và các ưu đãi dành riêng cho thành viên.
                </p>
              </div>
              <div className="relative h-64 md:h-full flex justify-center items-center">
                <img
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop"
                  alt="Fruit Box"
                  className="w-full max-w-sm object-cover rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-8 border-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const pages = Math.ceil(vouchers.length / perPage);
  const visible = vouchers.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50" id="vouchers">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-3 block">
            Dành riêng cho bạn
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">🎟️ Voucher & Ưu Đãi</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Các chương trình khuyến mãi đang hoạt động — sao chép mã và áp dụng ngay khi thanh toán!
          </p>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Voucher Grid */}
        {!loading && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {visible.map((v) => (
                  <VoucherCard key={v._id} voucher={v} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === page ? 'bg-primary w-6' : 'bg-slate-300'}`}
                  />
                ))}
                <button
                  onClick={() => setPage(p => Math.min(pages - 1, p + 1))}
                  disabled={page === pages - 1}
                  className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-sm text-slate-400 mt-6 flex items-center justify-center gap-2"
            >
              <Tag className="w-4 h-4 text-primary" />
              Nhập mã khi thanh toán để áp dụng giảm giá
            </motion.p>
          </>
        )}
      </div>
    </section>
  );
};

export default PromoBanner;
