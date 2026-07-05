import { FiTag } from 'react-icons/fi';
import type { VoucherItem } from './types';

type Props = { vouchers: VoucherItem[]; isLoading?: boolean };

const VoucherSection = ({ vouchers, isLoading }: Props) => {
  if (isLoading) {
    return (
      <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60 animate-pulse">
        <h3 className="text-2xl font-bold text-foreground mb-6">Voucher của tôi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[2rem] border border-dashed border-neutral-200 bg-neutral-50/50 p-5 space-y-3">
              <div className="h-6 w-24 bg-neutral-200 rounded" />
              <div className="h-4 w-40 bg-neutral-200/80 rounded" />
              <div className="h-4 w-32 bg-neutral-200/60 rounded" />
              <div className="h-10 w-28 bg-neutral-200/55 rounded-full mt-4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60">
      <h3 className="text-2xl font-bold text-foreground mb-6">Voucher của tôi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {vouchers.length === 0 ? (
          <div className="col-span-full text-center py-10 border border-dashed border-border/80 rounded-2xl text-foreground/40 font-semibold bg-neutral-50/20">
            Hiện tại chưa có voucher nào khả dụng.
          </div>
        ) : (
          vouchers.map((voucher) => {
            const targetId = voucher.id || (voucher as any)._id;
            return (
              <div key={targetId} className="rounded-[2rem] border border-dashed border-primary/30 bg-gradient-to-br from-white to-orange-50 p-5 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center gap-3 text-primary font-semibold mb-4"><FiTag /> {voucher.code}</div>
                <p className="text-sm text-foreground/70 font-semibold">Điều kiện: {voucher.condition}</p>
                <p className="text-sm text-foreground/75 mt-2 font-medium">Hạn sử dụng: {voucher.expiry}</p>
                <button className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/95 transition-all shadow-md hover:shadow-lg">Sử dụng ngay</button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default VoucherSection;
