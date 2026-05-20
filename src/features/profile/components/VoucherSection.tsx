import { FiTag } from 'react-icons/fi';
import type { VoucherItem } from './types';

type Props = { vouchers: VoucherItem[] };

const VoucherSection = ({ vouchers }: Props) => (
  <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60">
    <h3 className="text-2xl font-bold text-foreground mb-6">Voucher của tôi</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {vouchers.map((voucher) => (
        <div key={voucher.id} className="rounded-[2rem] border border-dashed border-primary/30 bg-gradient-to-br from-white to-orange-50 p-5 shadow-sm">
          <div className="flex items-center gap-3 text-primary font-semibold mb-4"><FiTag /> {voucher.code}</div>
          <p className="text-sm text-foreground/70">Điều kiện: {voucher.condition}</p>
          <p className="text-sm text-foreground/70 mt-2">Hạn sử dụng: {voucher.expiry}</p>
          <button className="mt-5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">Sử dụng ngay</button>
        </div>
      ))}
    </div>
  </section>
);

export default VoucherSection;
