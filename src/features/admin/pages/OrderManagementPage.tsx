import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { usePagination } from '../hooks/usePagination';
import { PAGE_SIZE } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
  deleteAdminOrder,
  type BackendOrder
} from '../servers/orders';

const orderStatusTabs: { key: string; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'shipping', label: 'Đang giao' },
  { key: 'completed', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
];

const OrderManagementPage = () => {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BackendOrder | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        toast.error('Không thể tải danh sách đơn hàng.');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.phone.includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pagination = usePagination({ totalItems: filteredOrders.length, pageSize: PAGE_SIZE });
  const paginatedOrders = filteredOrders.slice(pagination.startIndex, pagination.endIndex);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await updateAdminOrderStatus(orderId, newStatus);
      if (res) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: res.status } : o))
        );
        toast.success('Cập nhật trạng thái đơn hàng thành công!');
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => prev ? { ...prev, status: res.status } : null);
        }
      } else {
        toast.error('Cập nhật trạng thái thất bại.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Đã xảy ra lỗi khi cập nhật trạng thái.');
    }
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteAdminOrder(deleteTarget._id);
        setOrders((prev) => prev.filter((o) => o._id !== deleteTarget._id));
        toast.success('Xóa đơn hàng thành công!');
      } catch (err) {
        console.error(err);
        toast.error('Xóa đơn hàng thất bại.');
      } finally {
        setDeleteTarget(null);
      }
    }
  };

  const statusCounts = orderStatusTabs.map((tab) => ({
    ...tab,
    count: tab.key === 'all' ? orders.length : orders.filter((o) => o.status === tab.key).length,
  }));

  const columns: Column<BackendOrder>[] = [
    {
      key: 'id',
      label: 'Mã đơn',
      render: (o) => (
        <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">
          {o._id.substring(o._id.length - 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'customer',
      label: 'Khách hàng',
      render: (o) => (
        <div>
          <p className="text-sm font-medium text-slate-700">{o.customer?.name}</p>
          <p className="text-xs text-slate-400">{o.customer?.phone}</p>
        </div>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Thanh toán',
      className: 'hidden md:table-cell',
      render: (o) => <span className="text-sm text-slate-600">{o.paymentMethod}</span>,
    },
    {
      key: 'total',
      label: 'Tổng tiền',
      sortable: true,
      render: (o) => <span className="text-sm font-semibold text-emerald-600">{formatCurrency(o.total)}</span>,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (o) => (
        <select
          value={o.status}
          onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
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
      key: 'createdAt',
      label: 'Ngày đặt',
      sortable: true,
      className: 'hidden lg:table-cell',
      render: (o) => <span className="text-sm text-slate-500">{formatDate(o.createdAt)}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: (o) => (
        <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedOrder(o)}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Chi tiết
          </button>
          <button
            onClick={() => setDeleteTarget(o)}
            className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors p-1"
            title="Xóa đơn hàng"
          >
            Xóa
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

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
          keyExtractor={(o) => o._id}
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
        title={`Chi tiết đơn hàng #${selectedOrder?._id.substring(selectedOrder._id.length - 8).toUpperCase()}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-5">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs text-slate-400 mb-1">Khách hàng</p>
                <p className="text-sm font-semibold text-slate-700">{selectedOrder.customer?.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedOrder.customer?.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Giao hàng</p>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedOrder.address}</p>
                {selectedOrder.note && (
                  <p className="text-xs text-amber-600 mt-1">📝 Ghi chú: {selectedOrder.note}</p>
                )}
              </div>
            </div>

            {/* Status & Method */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Trạng thái đơn</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                  className="text-xs font-medium px-2 py-1 rounded-lg border border-slate-200 outline-none focus:border-emerald-300 bg-white cursor-pointer"
                >
                  {orderStatusTabs.filter((t) => t.key !== 'all').map((t) => (
                    <option key={t.key} value={t.key}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Phương thức TT</p>
                <span className="text-sm font-medium text-slate-600">{selectedOrder.paymentMethod}</span>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Ngày đặt</p>
                <span className="text-sm font-medium text-slate-600">{formatDate(selectedOrder.createdAt)}</span>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sản phẩm</p>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {selectedOrder.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{item.name}</p>
                      <p className="text-xs text-slate-400">
                        {formatCurrency(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Tạm tính</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Phí vận chuyển</span>
                <span>+{formatCurrency(selectedOrder.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Giảm giá</span>
                <span>-{formatCurrency(selectedOrder.discount)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700">Tổng thanh toán</span>
                <span className="text-xl font-bold text-emerald-600">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa đơn hàng"
        message={`Bạn có chắc chắn muốn xóa đơn hàng của "${deleteTarget?.customer?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
      />
    </div>
  );
};

export default OrderManagementPage;
