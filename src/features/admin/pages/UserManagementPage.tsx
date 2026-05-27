import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiSlash, FiCheckCircle } from 'react-icons/fi';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import { usePagination } from '../hooks/usePagination';
import { mockUsers, type AdminUser } from '../mock/users';
import { USER_STATUS_MAP, USER_ROLE_MAP, PAGE_SIZE } from '../utils/constants';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';

const UserManagementPage = () => {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const pagination = usePagination({ totalItems: filteredUsers.length, pageSize: PAGE_SIZE });
  const paginatedUsers = filteredUsers.slice(pagination.startIndex, pagination.endIndex);

  const handleDelete = () => {
    if (deleteTarget) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleToggleBan = (user: AdminUser) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' }
          : u
      )
    );
  };

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      label: 'Người dùng',
      render: (user) => (
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full bg-slate-100" />
          <div>
            <p className="text-sm font-semibold text-slate-700">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Số điện thoại',
      className: 'hidden md:table-cell',
      render: (user) => <span className="text-sm text-slate-600">{user.phone}</span>,
    },
    {
      key: 'role',
      label: 'Vai trò',
      render: (user) => <StatusBadge status={user.role} statusMap={USER_ROLE_MAP} />,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (user) => <StatusBadge status={user.status} statusMap={USER_STATUS_MAP} />,
    },
    {
      key: 'totalOrders',
      label: 'Đơn hàng',
      sortable: true,
      className: 'hidden lg:table-cell',
      render: (user) => <span className="text-sm text-slate-600">{formatNumber(user.totalOrders)}</span>,
    },
    {
      key: 'totalSpent',
      label: 'Chi tiêu',
      sortable: true,
      className: 'hidden lg:table-cell',
      render: (user) => <span className="text-sm font-medium text-slate-700">{formatCurrency(user.totalSpent)}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: (user) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setEditTarget(user); }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-blue-500"
            title="Chỉnh sửa"
          >
            <FiEdit2 className="text-sm" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleBan(user); }}
            className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${
              user.status === 'banned' ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-400 hover:text-amber-500'
            }`}
            title={user.status === 'banned' ? 'Mở khóa' : 'Khóa'}
          >
            {user.status === 'banned' ? <FiCheckCircle className="text-sm" /> : <FiSlash className="text-sm" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(user); }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-red-500"
            title="Xóa"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
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
          placeholder="Tìm kiếm người dùng..."
          onChange={setSearch}
          className="w-full sm:w-72"
        />
        <div className="flex items-center gap-2">
          {['all', 'customer', 'staff', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => { setRoleFilter(role); pagination.setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                roleFilter === role
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {role === 'all' ? 'Tất cả' : USER_ROLE_MAP[role]?.label || role}
            </button>
          ))}
        </div>
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
          data={paginatedUsers}
          keyExtractor={(u) => u.id}
        />
        <div className="px-4 pb-3">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={filteredUsers.length}
          />
        </div>
      </motion.div>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
      />

      {/* Edit Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Chỉnh sửa người dùng" size="md">
        {editTarget && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img src={editTarget.avatar} alt={editTarget.name} className="w-14 h-14 rounded-full bg-slate-100" />
              <div>
                <p className="font-semibold text-slate-700">{editTarget.name}</p>
                <p className="text-sm text-slate-400">{editTarget.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Họ tên</label>
                <input
                  type="text"
                  defaultValue={editTarget.name}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Số điện thoại</label>
                <input
                  type="text"
                  defaultValue={editTarget.phone}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Vai trò</label>
                <select
                  defaultValue={editTarget.role}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="customer">Khách hàng</option>
                  <option value="staff">Nhân viên</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Trạng thái</label>
                <select
                  defaultValue={editTarget.status}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="active">Hoạt động</option>
                  <option value="banned">Đã khóa</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Ngày tham gia: {formatDate(editTarget.joinDate)}</p>
              <p>Tổng đơn hàng: {formatNumber(editTarget.totalOrders)}</p>
              <p>Tổng chi tiêu: {formatCurrency(editTarget.totalSpent)}</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => setEditTarget(null)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagementPage;
