import { useState } from 'react';
import { motion } from 'framer-motion';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { usePagination } from '../hooks/usePagination';
import { mockOrders, type AdminOrder, type OrderStatus } from '../mock/orders';
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP, DELIVERY_STATUS_MAP, PAGE_SIZE } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';

const orderStatusTabs: { key: string; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'shipped', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
];

const OrderManagementPage = () => {
  const [orders, setOrders] = useState<AdminOrder[]>(mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const pagination = usePagination({ totalItems: filteredOrders.length, pageSize: PAGE_SIZE });
  const paginatedOrders = filteredOrders.slice(pagination.startIndex, pagination.endIndex);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  const statusCounts = orderStatusTabs.map((tab) => ({
    ...tab,
    count: tab.key === 'all' ? orders.length : orders.filter((o) => o.orderStatus === tab.key).length,
  }));

  const columns: Column<AdminOrder>[] = [
    {
      key: 'id',
      label: 'Mã đơn',
      render: (o) => <span className="text-sm font-semibold text-slate-700">{o.id}</span>,
    },
    {
      key: 'customer',
      label: 'Khách hàng',
      render: (o) => (
        <div>
          <p className="text-sm font-medium text-slate-700">{o.customer}</p>
          <p className="text-xs text-slate-400">{o.phone}</p>
        </div>
      ),
    },
    {
      key: 'total',
      label: 'Tổng tiền',
      sortable: true,
      render: (o) => <span className="text-sm font-semibold text-emerald-600">{formatCurrency(o.total)}</span>,
    },
    {
      key: 'orderStatus',
      label: 'Trạng thái',
      render: (o) => (
        <select
          value={o.orderStatus}
          onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-medium px-2 py-1 rounded-lg border border-slate-200 outline-none focus:border-emerald-300 bg-white cursor-pointer"
        >
          {orderStatusTabs.filter((t) => t.key !== 'all').map((t) => (
            <option key={t.key} value={t.key}>{t.label}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Thanh toán',
      className: 'hidden md:table-cell',
      render: (o) => <StatusBadge status={o.paymentStatus} statusMap={PAYMENT_STATUS_MAP} />,
    },
    {
      key: 'date',
      label: 'Ngày đặt',
      sortable: true,
      className: 'hidden lg:table-cell',
      render: (o) => <span className="text-sm text-slate-500">{formatDate(o.date)}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: (o) => (
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Chi tiết
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
      >
        <SearchInput
          placeholder="Tìm mã đơn, khách hàng..."
          onChange={setSearch}
          className="w-full sm:w-72"
        />
      </motion.div>

      {/* Status Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {statusCounts.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setStatusFilter(tab.key); pagination.setPage(1); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              statusFilter === tab.key
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              statusFilter === tab.key ? 'bg-white/20' : 'bg-slate-100'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <DataTable
          columns={columns}
          data={paginatedOrders}
          keyExtractor={(o) => o.id}
          onRowClick={(o) => setSelectedOrder(o)}
        />
        <div className="px-4 pb-3">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={filteredOrders.length}
          />
        </div>
      </motion.div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Chi tiết đơn hàng ${selectedOrder?.id || ''}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-5">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs text-slate-400 mb-1">Khách hàng</p>
                <p className="text-sm font-semibold text-slate-700">{selectedOrder.customer}</p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedOrder.email}</p>
                <p className="text-xs text-slate-400">{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Giao hàng</p>
                <p className="text-sm text-slate-600">{selectedOrder.address}</p>
                {selectedOrder.note && (
                  <p className="text-xs text-amber-600 mt-1">📝 {selectedOrder.note}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-wrap gap-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Đơn hàng</p>
                <StatusBadge status={selectedOrder.orderStatus} statusMap={ORDER_STATUS_MAP} />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Thanh toán</p>
                <StatusBadge status={selectedOrder.paymentStatus} statusMap={PAYMENT_STATUS_MAP} />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Vận chuyển</p>
                <StatusBadge status={selectedOrder.deliveryStatus} statusMap={DELIVERY_STATUS_MAP} />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Phương thức</p>
                <span className="text-sm font-medium text-slate-600">{selectedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sản phẩm</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{item.name}</p>
                      <p className="text-xs text-slate-400">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">Tổng thanh toán</span>
              <span className="text-xl font-bold text-emerald-600">{formatCurrency(selectedOrder.total)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagementPage;
