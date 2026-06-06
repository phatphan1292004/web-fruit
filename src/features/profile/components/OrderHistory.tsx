import { motion } from 'framer-motion';
import type { ProfileOrder } from './types';

type Props = { orders: ProfileOrder[]; onOpen?: (orderId: string) => void };

const statusClass = (status: ProfileOrder['status']) => {
  switch (status) {
    case 'Đang giao': return 'bg-amber-50 text-amber-700 border-amber-200/60';
    case 'Hoàn thành': return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    case 'Đã hủy': return 'bg-rose-50 text-rose-700 border-rose-200/60';
    default: return 'bg-blue-50 text-blue-700 border-blue-200/60';
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Chưa có';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

const OrderHistory = ({ orders, onOpen }: Props) => {
  return (
    <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60">
      <h3 className="text-2xl font-bold text-foreground mb-6">Đơn hàng gần đây</h3>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="h-16 w-16 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-neutral-700 mb-1">Chưa có đơn hàng nào</h4>
          <p className="text-sm text-neutral-500 max-w-xs">
            Bạn chưa thực hiện giao dịch nào. Hãy bắt đầu mua sắm để nhận các ưu đãi hấp dẫn!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 md:-mx-8">
          <div className="inline-block min-w-full align-middle px-6 md:px-8">
            <div className="overflow-hidden border border-neutral-200/60 rounded-2xl">
              <table className="min-w-full divide-y divide-neutral-200/60">
                <thead className="bg-neutral-50/75">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      ID Đơn hàng
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Địa chỉ giao hàng
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      PTTT
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/40 bg-white">
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onOpen?.(order.id)}
                      className="cursor-pointer hover:bg-neutral-50/50 transition-colors duration-150"
                    >
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-neutral-900">
                        <span className="font-mono text-xs text-neutral-600 bg-neutral-100/80 px-2.5 py-1 rounded-lg border border-neutral-200/40">
                          #{order.id}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-500 font-medium">
                        {formatDate(order.date)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <div className="font-semibold text-neutral-800">
                          {order.customer?.name || 'Chưa cập nhật'}
                        </div>
                        {order.customer?.phone && (
                          <div className="text-xs text-neutral-500 font-medium">
                            {order.customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600 max-w-[220px] truncate" title={order.address}>
                        {order.address || 'Chưa cập nhật'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <span className="px-2 py-1 rounded-lg bg-neutral-50 text-neutral-600 border border-neutral-200/40 text-xs font-semibold">
                          {order.paymentMethod || 'COD'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-emerald-600">
                        {order.total.toLocaleString('vi-VN')}₫
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${statusClass(order.status)}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${order.status === 'Hoàn thành' ? 'bg-emerald-500' :
                            order.status === 'Đang giao' ? 'bg-amber-500' :
                              order.status === 'Đã hủy' ? 'bg-rose-500' : 'bg-blue-500'
                            }`} />
                          {order.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen?.(order.id);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-colors"
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderHistory;
