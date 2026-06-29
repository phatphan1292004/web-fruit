import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiSlash, FiCheckCircle, FiEye } from 'react-icons/fi';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import { usePagination } from '../hooks/usePagination';
import {
  fetchAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
  deleteAdminUser,
  type BackendUser
} from '../servers/users';
import { USER_STATUS_MAP, USER_ROLE_MAP, PAGE_SIZE } from '../utils/constants';
import { formatDate } from '../utils/formatters';

const UserManagementPage = () => {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<BackendUser | null>(null);
  const [editTarget, setEditTarget] = useState<BackendUser | null>(null);
  const [detailTarget, setDetailTarget] = useState<BackendUser | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const pagination = usePagination({ totalItems: filteredUsers.length, pageSize: PAGE_SIZE });
  const paginatedUsers = filteredUsers.slice(pagination.startIndex, pagination.endIndex);

  const handleDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteAdminUser(deleteTarget.firebaseUid);
        setUsers((prev) => prev.filter((u) => u.firebaseUid !== deleteTarget.firebaseUid));
        toast.success('Xóa người dùng thành công!');
      } catch (err) {
        console.error(err);
        toast.error('Xóa người dùng thất bại.');
      } finally {
        setDeleteTarget(null);
      }
    }
  };

  const handleToggleBan = async (user: BackendUser) => {
    try {
      const newActiveState = !user.active;
      const res = await updateAdminUserStatus(user.firebaseUid, newActiveState);
      if (res) {
        setUsers((prev) =>
          prev.map((u) => (u.firebaseUid === user.firebaseUid ? { ...u, active: res.active } : u))
        );
        toast.success(`${newActiveState ? 'Mở khóa' : 'Khóa'} người dùng thành công!`);
      } else {
        toast.error('Cập nhật trạng thái thất bại.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Đã xảy ra lỗi khi cập nhật trạng thái.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;

    const roleSelect = document.getElementById('edit-role') as HTMLSelectElement | null;
    const statusSelect = document.getElementById('edit-status') as HTMLSelectElement | null;

    const newRole = (roleSelect?.value as 'customer' | 'admin' | 'staff') || editTarget.role;
    const newActive = statusSelect?.value === 'active';

    try {
      let updatedUser = { ...editTarget };

      if (newRole !== editTarget.role) {
        const resRole = await updateAdminUserRole(editTarget.firebaseUid, newRole);
        if (resRole) {
          updatedUser = { ...updatedUser, role: resRole.role };
        }
      }

      if (newActive !== editTarget.active) {
        const resStatus = await updateAdminUserStatus(editTarget.firebaseUid, newActive);
        if (resStatus) {
          updatedUser = { ...updatedUser, active: resStatus.active };
        }
      }

      setUsers((prev) =>
        prev.map((u) => (u.firebaseUid === editTarget.firebaseUid ? updatedUser : u))
      );

      toast.success('Cập nhật thông tin người dùng thành công!');
      setEditTarget(null);
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật thông tin người dùng thất bại.');
    }
  };

  const columns: Column<BackendUser>[] = [
    {
      key: 'name',
      label: 'Người dùng',
      render: (user) => (
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`}
            alt={user.displayName}
            className="w-9 h-9 rounded-full bg-slate-100 object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-slate-700">{user.displayName}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Vai trò',
      render: (user) => <StatusBadge status={user.role} statusMap={USER_ROLE_MAP} />,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (user) => (
        <StatusBadge status={user.active ? 'active' : 'banned'} statusMap={USER_STATUS_MAP} />
      ),
    },
    {
      key: 'joinDate',
      label: 'Ngày tham gia',
      sortable: true,
      className: 'hidden lg:table-cell',
      render: (user) => (
        <span className="text-sm text-slate-600">
          {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (user) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDetailTarget(user);
            }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-emerald-500"
            title="Xem chi tiết"
          >
            <FiEye className="text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditTarget(user);
            }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-blue-500"
            title="Chỉnh sửa"
          >
            <FiEdit2 className="text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleBan(user);
            }}
            className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${
              !user.active ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-400 hover:text-amber-500'
            }`}
            title={!user.active ? 'Mở khóa' : 'Khóa'}
          >
            {!user.active ? <FiCheckCircle className="text-sm" /> : <FiSlash className="text-sm" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(user);
            }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-red-500"
            title="Xóa"
          >
            <FiTrash2 className="text-sm" />
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
          placeholder="Tìm kiếm người dùng..."
          onChange={setSearch}
          className="w-full sm:w-72"
        />
        <div className="flex items-center gap-2">
          {['all', 'customer', 'staff', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => {
                setRoleFilter(role);
                pagination.setPage(1);
              }}
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
          keyExtractor={(u) => u.firebaseUid}
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
        message={`Bạn có chắc chắn muốn xóa "${deleteTarget?.displayName}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
      />

      {/* Edit Modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Chỉnh sửa người dùng"
        size="md"
      >
        {editTarget && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={
                  editTarget.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${editTarget.displayName}`
                }
                alt={editTarget.displayName}
                className="w-14 h-14 rounded-full bg-slate-100 object-cover"
              />
              <div>
                <p className="font-semibold text-slate-700">{editTarget.displayName}</p>
                <p className="text-sm text-slate-400">{editTarget.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Vai trò</label>
                <select
                  id="edit-role"
                  defaultValue={editTarget.role}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 bg-white"
                >
                  <option value="customer">Khách hàng</option>
                  <option value="staff">Nhân viên</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Trạng thái</label>
                <select
                  id="edit-status"
                  defaultValue={editTarget.active ? 'active' : 'banned'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 bg-white"
                >
                  <option value="active">Hoạt động</option>
                  <option value="banned">Đã khóa</option>
                </select>
              </div>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Ngày tham gia: {editTarget.createdAt ? formatDate(editTarget.createdAt) : 'N/A'}</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!detailTarget} onClose={() => setDetailTarget(null)} title="Thông tin người dùng" size="md">
        {detailTarget && (
          <div className="space-y-6 text-slate-700">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={
                  detailTarget.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${detailTarget.displayName}`
                }
                alt={detailTarget.displayName}
                className="w-16 h-16 rounded-full bg-slate-100 object-cover shadow-sm"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-800">{detailTarget.displayName}</h3>
                <p className="text-sm text-slate-400">{detailTarget.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block mb-0.5 text-xs">Vai trò</span>
                  <StatusBadge status={detailTarget.role} statusMap={USER_ROLE_MAP} />
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 text-xs">Trạng thái</span>
                  <StatusBadge status={detailTarget.active ? 'active' : 'banned'} statusMap={USER_STATUS_MAP} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-slate-400 block mb-0.5 text-xs">Giới tính</span>
                  <span className="font-semibold text-slate-700">{detailTarget.gender || 'Chưa cập nhật'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 text-xs">Ngày sinh</span>
                  <span className="font-semibold text-slate-700">{detailTarget.birthDay || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">UID (Firebase):</span>
                  <span className="font-mono text-xs text-slate-600">{detailTarget.firebaseUid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mã người dùng (DB ID):</span>
                  <span className="font-mono text-xs text-slate-600">{detailTarget._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ngày tham gia:</span>
                  <span className="font-semibold text-slate-700">
                    {detailTarget.createdAt ? formatDate(detailTarget.createdAt) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDetailTarget(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagementPage;
