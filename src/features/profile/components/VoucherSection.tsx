import { useState } from 'react';
import { FiTag, FiAward, FiUserPlus, FiGift, FiClock, FiCheck, FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';
import type { VoucherItem } from './types';

const tierLabels: Record<string, string> = {
  bronze: 'Đồng (Bronze)',
  silver: 'Bạc (Silver)',
  gold: 'Vàng (Gold)',
  platinum: 'Kim cương (Platinum)'
};

const tierColors: Record<string, string> = {
  bronze: 'bg-amber-50 text-amber-800 border-amber-200',
  silver: 'bg-slate-100 text-slate-800 border-slate-200',
  gold: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  platinum: 'bg-purple-100 text-purple-800 border-purple-200'
};

const voucherTypeConfig: Record<string, { label: string; icon: React.ReactNode; bg: string; color: string; border: string }> = {
  new_user: {
    label: 'Chào người mới',
    icon: <FiUserPlus className="w-3.5 h-3.5" />,
    bg: 'bg-blue-50',
    color: 'text-blue-700',
    border: 'border-blue-200'
  },
  member_tier: {
    label: 'Hạng thành viên',
    icon: <FiAward className="w-3.5 h-3.5" />,
    bg: 'bg-amber-50',
    color: 'text-amber-700',
    border: 'border-amber-200'
  },
  voucher_code: {
    label: 'Mã voucher',
    icon: <FiTag className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-50',
    color: 'text-emerald-700',
    border: 'border-emerald-200'
  },
  combo: {
    label: 'Combo ưu đãi',
    icon: <FiGift className="w-3.5 h-3.5" />,
    bg: 'bg-purple-50',
    color: 'text-purple-700',
    border: 'border-purple-200'
  }
};

type Props = { vouchers: VoucherItem[]; isLoading?: boolean; tier?: string };

const VoucherSection = ({ vouchers, isLoading, tier }: Props) => {
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const handleCopyCode = (code: string, id: string | number) => {
    if (!code || code === 'Ví Voucher') return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Đã sao chép mã: ${code}`, { autoClose: 1500 });
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60 animate-pulse">
        <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-4">
          <div className="h-7 w-48 bg-neutral-200 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl border border-neutral-200 bg-neutral-50/50 p-5 space-y-3">
              <div className="h-6 w-24 bg-neutral-200 rounded" />
              <div className="h-4 w-40 bg-neutral-200/80 rounded" />
              <div className="h-4 w-32 bg-neutral-200/60 rounded" />
              <div className="h-10 w-full bg-neutral-200/55 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Kho Voucher của tôi</h3>
          <p className="text-xs text-slate-400 mt-1">Nơi lưu trữ các ưu đãi của người mới, thành viên và các mã giảm giá bạn sở hữu.</p>
        </div>
        {tier && (
          <span className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold border rounded-full ${tierColors[tier] || 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <FiAward /> Hạng: {tierLabels[tier] || tier}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {vouchers.length === 0 ? (
          <div className="col-span-full text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-semibold bg-slate-50/30">
            <FiTag className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            Bạn chưa sở hữu voucher nào.
          </div>
        ) : (
          vouchers.map((voucher) => {
            const targetId = voucher.id;
            const conf = voucherTypeConfig[voucher.type || 'voucher_code'] || voucherTypeConfig.voucher_code;
            const isCopyable = voucher.code && voucher.code !== 'Ví Voucher';

            return (
              <div
                key={targetId}
                className={`relative rounded-3xl border-2 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 ${conf.border} flex flex-col justify-between`}
              >
                {/* Left decorative color bar */}
                <div className={`absolute top-0 bottom-0 left-0 w-2 ${conf.bg.replace('bg-', 'bg-')}`} style={{ backgroundColor: `var(--${conf.color.split('-')[1]}-500)` }} />

                <div className="p-5 pl-7 flex-1 space-y-4">
                  {/* Top line: badge + code */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${conf.bg} ${conf.color}`}>
                      {conf.icon}
                      {conf.label}
                    </span>
                    {voucher.code && (
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                        {voucher.code}
                      </span>
                    )}
                  </div>

                  {/* Title / Name & Discount */}
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{voucher.name || 'Chương trình ưu đãi'}</h4>
                    <p className="text-2xl font-extrabold text-red-500 mt-1">{voucher.discountInfo || 'Đang giảm giá'}</p>
                  </div>

                  {/* Condition & Expiry */}
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <p className="font-medium text-slate-600">Điều kiện: {voucher.condition}</p>
                    <p className="flex items-center gap-1">
                      <FiClock className="text-slate-400" /> Hạn dùng: {voucher.expiry}
                    </p>
                  </div>
                </div>

                {/* Footer copy button or dynamic label */}
                <div className="px-5 pb-5 pl-7 pt-2 border-t border-slate-50 bg-slate-50/50 flex items-center justify-end">
                  {isCopyable ? (
                    <button
                      onClick={() => handleCopyCode(voucher.code, targetId)}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                        copiedId === targetId
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 shadow-sm'
                      }`}
                    >
                      {copiedId === targetId ? (
                        <>
                          <FiCheck className="w-3.5 h-3.5" /> Đã copy mã
                        </>
                      ) : (
                        <>
                          <FiCopy className="w-3.5 h-3.5" /> Sao chép mã
                        </>
                      )}
                    </button>
                  ) : (
                    <span className={`w-full text-center py-2 rounded-xl text-xs font-extrabold border bg-white ${conf.bg} ${conf.color} ${conf.border}`}>
                      Tự động áp dụng tại thanh toán
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default VoucherSection;
