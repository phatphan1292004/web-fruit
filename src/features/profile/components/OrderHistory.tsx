import { motion } from 'framer-motion';
import type { ProfileOrder } from './types';

type Props = { orders: ProfileOrder[] };

const statusClass = (status: ProfileOrder['status']) => {
  switch (status) {
    case 'Đang giao': return 'bg-amber-100 text-amber-700';
    case 'Hoàn thành': return 'bg-emerald-100 text-emerald-700';
    case 'Đã hủy': return 'bg-rose-100 text-rose-700';
    default: return 'bg-blue-100 text-blue-700';
  }
};

const OrderHistory = ({ orders }: Props) => (
  <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60">
    <h3 className="text-2xl font-bold text-foreground mb-6">Đơn hàng gần đây</h3>
    <div className="space-y-3">
      {orders.map((order, index) => (
        <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ x: 4 }} className="grid grid-cols-1 md:grid-cols-[140px_120px_1fr_140px_120px] gap-3 items-center rounded-2xl border border-border/60 px-4 py-4 hover:shadow-md transition-all">
          <div className="font-semibold text-foreground">{order.id}</div>
          <div className="text-sm text-foreground/60">{order.date}</div>
          <div className="text-sm text-foreground/80">{order.items}</div>
          <div className="font-semibold text-foreground">{order.total.toLocaleString('vi-VN')}đ</div>
          <div><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(order.status)}`}>{order.status}</span></div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default OrderHistory;
