import { FiEdit3, FiTrash2, FiPlus } from 'react-icons/fi';
import type { AddressItem } from './types';

type Props = { addresses: AddressItem[] };

const AddressSection = ({ addresses }: Props) => (
  <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-2xl font-bold text-foreground">Địa chỉ giao hàng</h3>
      <button className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors"><FiPlus /> Thêm địa chỉ</button>
    </div>
    <div className="space-y-4">
      {addresses.map((address) => (
        <div key={address.id} className="rounded-2xl border border-border/60 p-4 hover:shadow-md transition-all">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-foreground">{address.label}</h4>
                {address.isDefault && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Mặc định</span>}
              </div>
              <p className="mt-2 text-sm text-foreground/70">{address.address}</p>
            </div>
            <div className="flex gap-2 text-foreground/60">
              <button className="rounded-full border border-border p-2 hover:text-primary hover:border-primary transition-colors"><FiEdit3 /></button>
              <button className="rounded-full border border-border p-2 hover:text-rose-500 hover:border-rose-300 transition-colors"><FiTrash2 /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default AddressSection;
