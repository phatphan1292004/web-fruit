import { useState, useEffect, useMemo } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiBarChart2, FiToggleLeft, FiToggleRight, FiPercent,
  FiTag, FiZap, FiClock, FiDollarSign, FiInfo, FiAlertTriangle, FiSave, FiCheckCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import { usePagination } from '../hooks/usePagination';
import { PAGE_SIZE } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import { fetchAdminProducts, type BackendProduct } from '../servers/products';
import {
  fetchAdminPromotions,
  createAdminPromotion,
  updateAdminPromotion,
  patchAdminPromotionStatus,
  deleteAdminPromotion,
  fetchPromotionStats,
  type FrontendPromotion,
  type PromotionStats
} from '../servers/promotions';

const typeLabels: Record<string, string> = {
  flash_sale: 'Flash Sale',
  combo: 'Combo giảm giá',
  voucher_code: 'Voucher mã nhập',
  new_user: 'Voucher người mới',
  member_tier: 'Voucher hạng thành viên'
};

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Bản nháp', color: 'text-slate-700', bg: 'bg-slate-100' },
  active: { label: 'Đang chạy', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  inactive: { label: 'Tạm dừng', color: 'text-amber-700', bg: 'bg-amber-50' },
  expired: { label: 'Đã hết hạn', color: 'text-red-700', bg: 'bg-red-50' }
};

const inputCls = 'w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all';
const labelCls = 'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5';

// ─── Reusable section card wrapper (Declared globally to avoid re-creation & focus loss on render) ───
const SectionCard = ({ title, icon, color, children }: { title: string; icon?: React.ReactNode; color: string; children: React.ReactNode }) => (
  <div className={`rounded-xl border overflow-hidden ${color === 'slate' ? 'border-slate-200' : color === 'blue' ? 'border-blue-200' : color === 'emerald' ? 'border-emerald-200' : 'border-orange-200'}`}>
    <div className={`px-5 py-3 border-b flex items-center gap-2 ${color === 'slate' ? 'bg-slate-50 border-slate-200' : color === 'blue' ? 'bg-blue-50 border-blue-100' : color === 'emerald' ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
      {icon && <span className={`text-base ${color === 'slate' ? 'text-slate-500' : color === 'blue' ? 'text-blue-500' : color === 'emerald' ? 'text-emerald-500' : 'text-orange-500'}`}>{icon}</span>}
      <span className={`text-sm font-bold ${color === 'slate' ? 'text-slate-700' : color === 'blue' ? 'text-blue-700' : color === 'emerald' ? 'text-emerald-700' : 'text-orange-700'}`}>{title}</span>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const PromotionManagementPage = () => {
  const [promotions, setPromotions] = useState<FrontendPromotion[]>([]);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [deleteTarget, setDeleteTarget] = useState<FrontendPromotion | null>(null);
  const [editTarget, setEditTarget] = useState<FrontendPromotion | null>(null);
  const [statsTarget, setStatsTarget] = useState<FrontendPromotion | null>(null);
  const [statsData, setStatsData] = useState<PromotionStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<FrontendPromotion['type']>('voucher_code');
  const [code, setCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [usageLimit, setUsageLimit] = useState<number | ''>('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed_amount' | 'fixed_price'>('percentage');
  const [discountValue, setDiscountValue] = useState<number | ''>('');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | ''>('');
  const [minOrderValue, setMinOrderValue] = useState<number | ''>('');
  const [limitPerAccount, setLimitPerAccount] = useState<number | ''>(1);
  const [targetMemberTier, setTargetMemberTier] = useState<'bronze' | 'silver' | 'gold' | 'platinum'>('bronze');
  const [selectedProducts, setSelectedProducts] = useState<Array<{ productId: string; customPrice: number }>>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [promoList, prodList] = await Promise.all([
          fetchAdminPromotions(),
          fetchAdminProducts()
        ]);
        setPromotions(promoList);
        setProducts(prodList);
      } catch (err) {
        console.error(err);
        toast.error('Không thể tải dữ liệu khuyến mãi.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFetchStats = async (promo: FrontendPromotion) => {
    try {
      setStatsTarget(promo);
      setStatsLoading(true);
      setStatsData(null);
      const data = await fetchPromotionStats(promo._id);
      setStatsData(data);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải thống kê chương trình.');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleToggleStatus = async (promo: FrontendPromotion) => {
    const nextStatus = promo.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await patchAdminPromotionStatus(promo._id, nextStatus);
      if (res) {
        setPromotions((prev) => prev.map((p) => p._id === promo._id ? { ...p, status: res.status } : p));
        toast.success('Đã cập nhật trạng thái chương trình thành công.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật trạng thái thất bại.');
    }
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteAdminPromotion(deleteTarget._id);
        setPromotions((prev) => prev.filter((p) => p._id !== deleteTarget._id));
        toast.success('Đã xóa chương trình khuyến mãi thành công.');
      } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Xóa chương trình thất bại.');
      } finally {
        setDeleteTarget(null);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    const payload: Partial<FrontendPromotion> = {
      name,
      description,
      type,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      usageLimit: usageLimit === '' ? undefined : Number(usageLimit),
      config: {
        discountType,
        discountValue: discountValue === '' ? 0 : Number(discountValue),
        maxDiscountAmount: maxDiscountAmount === '' ? undefined : Number(maxDiscountAmount),
        minOrderValue: minOrderValue === '' ? 0 : Number(minOrderValue),
        limitPerAccount: limitPerAccount === '' ? 1 : Number(limitPerAccount),
      }
    };

    if (type === 'voucher_code') {
      if (!code) { toast.error('Vui lòng điền mã voucher.'); return; }
      payload.code = code.toUpperCase().trim();
    }
    if (type === 'member_tier') payload.config!.targetMemberTier = targetMemberTier;
    if (type === 'flash_sale' || type === 'combo') {
      payload.config!.products = selectedProducts.map(p => ({ productId: p.productId, customPrice: p.customPrice, limitPerUser: 99 }));
    }

    try {
      if (editTarget) {
        const res = await updateAdminPromotion(editTarget._id, payload);
        if (res) {
          setPromotions((prev) => prev.map((p) => p._id === editTarget._id ? res : p));
          toast.success('Cập nhật chương trình thành công.');
        }
      } else {
        const res = await createAdminPromotion(payload);
        if (res) {
          setPromotions((prev) => [res, ...prev]);
          toast.success('Tạo chương trình mới thành công.');
        }
      }
      resetForm();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Lưu chương trình thất bại.');
    }
  };

  const resetForm = () => {
    setName(''); setDescription(''); setType('voucher_code'); setCode('');
    setStartDate(''); setEndDate(''); setUsageLimit('');
    setDiscountType('percentage'); setDiscountValue(''); setMaxDiscountAmount('');
    setMinOrderValue(''); setLimitPerAccount(1); setTargetMemberTier('bronze');
    setSelectedProducts([]); setShowAddModal(false); setEditTarget(null);
  };

  const openEdit = (promo: FrontendPromotion) => {
    setEditTarget(promo);
    setName(promo.name); setDescription(promo.description || '');
    setType(promo.type); setCode(promo.code || '');
    setStartDate(promo.startDate.slice(0, 16)); setEndDate(promo.endDate.slice(0, 16));
    setUsageLimit(promo.usageLimit ?? '');
    setDiscountType(promo.config.discountType || 'percentage');
    setDiscountValue(promo.config.discountValue);
    setMaxDiscountAmount(promo.config.maxDiscountAmount ?? '');
    setMinOrderValue(promo.config.minOrderValue ?? '');
    setLimitPerAccount(promo.config.limitPerAccount ?? 1);
    setTargetMemberTier(promo.config.targetMemberTier || 'bronze');
    setSelectedProducts(promo.config.products?.map(p => ({ productId: p.productId, customPrice: p.customPrice ?? 0 })) ?? []);
    setShowAddModal(true);
  };

  const filteredList = promotions.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'all' || p.type === typeFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const pagination = usePagination({ totalItems: filteredList.length, pageSize: PAGE_SIZE });
  const paginatedList = filteredList.slice(pagination.startIndex, pagination.endIndex);

  const columns = useMemo<Column<FrontendPromotion>[]>(() => [
    {
      key: 'name',
      label: 'Chương trình',
      render: (p) => (
        <div>
          <p className="font-bold text-slate-800">{p.name}</p>
          {p.code && <span className="inline-block mt-1 font-mono text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{p.code}</span>}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Loại hình',
      render: (p) => <span className="text-sm font-medium text-slate-600">{typeLabels[p.type]}</span>
    },
    {
      key: 'discount',
      label: 'Ưu đãi',
      render: (p) => (
        <span className="text-sm font-bold text-slate-700">
          {p.config.discountType === 'percentage'
            ? `Giảm ${p.config.discountValue}%`
            : `Giảm ${formatCurrency(p.config.discountValue)}`}
        </span>
      )
    },
    {
      key: 'duration',
      label: 'Thời hạn',
      render: (p) => (
        <div className="text-xs text-slate-500">
          <p>Bắt đầu: {new Date(p.startDate).toLocaleString('vi-VN')}</p>
          <p>Kết thúc: {new Date(p.endDate).toLocaleString('vi-VN')}</p>
        </div>
      )
    },
    {
      key: 'usage',
      label: 'Lượt sử dụng',
      render: (p) => (
        <div className="w-24">
          <p className="text-xs text-slate-500 text-right mb-1">
            {p.usedCount} / {p.usageLimit ?? '∞'}
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${p.usageLimit ? Math.min(100, (p.usedCount / p.usageLimit) * 100) : 100}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (p) => {
        const conf = statusLabels[p.status] || statusLabels.draft;
        return (
          <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${conf.color} ${conf.bg}`}>
            {conf.label}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Hành động',
      render: (p) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleToggleStatus(p)} title={p.status === 'active' ? 'Tạm dừng' : 'Bật hoạt động'} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            {p.status === 'active' ? <FiToggleRight className="text-emerald-500 text-xl" /> : <FiToggleLeft className="text-slate-400 text-xl" />}
          </button>
          <button onClick={() => handleFetchStats(p)} title="Thống kê hiệu quả" className="p-1.5 rounded-lg hover:bg-slate-100 text-indigo-500 transition-colors">
            <FiBarChart2 />
          </button>
          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <FiEdit2 />
          </button>
          <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-slate-100 text-red-500 transition-colors">
            <FiTrash2 />
          </button>
        </div>
      )
    }
  ], [promotions, typeLabels, statusLabels]);



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý khuyến mãi</h1>
          <p className="text-sm text-slate-500">Cấu hình Flash Sale, Combo, Voucher mã nhập và voucher tự động</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-emerald-100 hover:shadow-lg transition-all"
        >
          <FiPlus />
          Tạo khuyến mãi mới
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tổng chương trình', value: promotions.length, color: 'emerald' },
          { label: 'Đang chạy', value: promotions.filter(p => p.status === 'active').length, color: 'blue' },
          { label: 'Tạm dừng', value: promotions.filter(p => p.status === 'inactive').length, color: 'amber' },
          { label: 'Hết hạn', value: promotions.filter(p => p.status === 'expired').length, color: 'red' },
        ].map(card => (
          <div key={card.label} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-${card.color}-50 text-${card.color}-600 flex items-center justify-center text-xl`}>
              <FiPercent />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{card.label}</p>
              <h3 className="text-xl font-bold text-slate-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm tên hoặc mã khuyến mãi..." />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 outline-none">
            <option value="all">Tất cả loại hình</option>
            <option value="flash_sale">Flash Sale</option>
            <option value="combo">Combo giảm giá</option>
            <option value="voucher_code">Voucher mã nhập</option>
            <option value="new_user">Voucher người mới</option>
            <option value="member_tier">Voucher hạng thành viên</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 outline-none">
            <option value="all">Tất cả trạng thái</option>
            <option value="draft">Bản nháp</option>
            <option value="active">Đang chạy</option>
            <option value="inactive">Tạm dừng</option>
            <option value="expired">Đã hết hạn</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <DataTable<FrontendPromotion>
          columns={columns}
          data={paginatedList}
          keyExtractor={(p) => p._id}
          emptyMessage={loading ? 'Đang tải...' : 'Chưa có chương trình khuyến mãi nào.'}
        />
        <div className="px-4 pb-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={filteredList.length}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          ADD / EDIT MODAL — size xl, 2-column layout
      ═══════════════════════════════════════════════ */}
      <Modal
        isOpen={showAddModal}
        onClose={resetForm}
        title={editTarget ? 'Chỉnh sửa chương trình khuyến mãi' : 'Tạo chương trình khuyến mãi mới'}
        size="xl"
      >
        <form onSubmit={handleSave} className="space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ─── CỘT TRÁI: Thông tin cơ bản + Thời gian ─── */}
            <div className="space-y-5">

              {/* Section 1: Thông tin cơ bản */}
              <SectionCard title="Thông tin cơ bản" icon={<FiTag />} color="slate">
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Tên chương trình <span className="text-red-400 normal-case">*</span></label>
                    <input
                      type="text" required value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Flash Sale Hè Rực Rỡ 2025"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Loại chương trình <span className="text-red-400 normal-case">*</span></label>
                    <select
                      value={type} disabled={!!editTarget}
                      onChange={(e) => setType(e.target.value as FrontendPromotion['type'])}
                      className={`${inputCls} disabled:bg-slate-50 disabled:text-slate-400`}
                    >
                      <option value="voucher_code">Voucher mã nhập</option>
                      <option value="flash_sale">Flash Sale</option>
                      <option value="combo">Combo giảm giá</option>
                      <option value="new_user">Voucher người dùng mới</option>
                      <option value="member_tier">Voucher hạng thành viên</option>
                    </select>
                    {editTarget && (
                      <p className="text-xs text-amber-500 mt-1.5 flex items-center gap-1"><FiAlertTriangle className="text-xs" /> Không thể thay đổi loại khi đang chỉnh sửa.</p>
                    )}
                  </div>

                  {type === 'voucher_code' && (
                    <div>
                      <label className={labelCls}>Mã Code <span className="text-red-400 normal-case">*</span></label>
                      <input
                        type="text" required value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Ví dụ: SUMMER50"
                        className={`${inputCls} font-mono text-emerald-700 font-bold uppercase tracking-widest`}
                      />
                      <p className="text-xs text-slate-400 mt-1.5">Mã sẽ tự động được viết hoa khi khách nhập.</p>
                    </div>
                  )}

                  {type === 'member_tier' && (
                    <div>
                      <label className={labelCls}>Hạng thành viên áp dụng <span className="text-red-400 normal-case">*</span></label>
                      <select
                        value={targetMemberTier}
                        onChange={(e) => setTargetMemberTier(e.target.value as any)}
                        className={inputCls}
                      >
                        <option value="bronze">Hạng Đồng (Bronze)</option>
                        <option value="silver">Hạng Bạc (Silver)</option>
                        <option value="gold">Hạng Vàng (Gold)</option>
                        <option value="platinum">Hạng Kim Cương (Platinum)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className={labelCls}>Mô tả chi tiết</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Điều kiện áp dụng, lưu ý quan trọng..."
                      className={`${inputCls} h-20 resize-none`}
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Section 2: Thời gian & giới hạn */}
              <SectionCard title="Thời gian & Giới hạn" icon={<FiClock />} color="blue">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Bắt đầu <span className="text-red-400 normal-case">*</span></label>
                      <input
                        type="datetime-local" required value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Kết thúc <span className="text-red-400 normal-case">*</span></label>
                      <input
                        type="datetime-local" required value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Tổng phát hành</label>
                      <input
                        type="number" value={usageLimit}
                        onChange={(e) => setUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Vô hạn"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Số lần / tài khoản</label>
                      <input
                        type="number" value={limitPerAccount}
                        onChange={(e) => setLimitPerAccount(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ─── CỘT PHẢI: Cấu hình ưu đãi ─── */}
            <div className="space-y-5">

              {/* Voucher / New User / Member Tier discount config */}
              {(type === 'voucher_code' || type === 'new_user' || type === 'member_tier') && (
                <SectionCard key="voucher-config-card" title="Cấu hình ưu đãi" icon={<FiDollarSign />} color="emerald">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="discountTypeSelect" className={labelCls}>Cách thức giảm giá</label>
                        <select
                          id="discountTypeSelect"
                          value={discountType}
                          onChange={(e) => setDiscountType(e.target.value as any)}
                          className={inputCls}
                        >
                          <option value="percentage">Giảm theo % (phần trăm)</option>
                          <option value="fixed_amount">Giảm tiền cố định (đ)</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="discountValueInput" className={labelCls}>
                          Giá trị giảm {discountType === 'percentage' ? '(%)' : '(đ)'} <span className="text-red-400 normal-case">*</span>
                        </label>
                        <input
                          id="discountValueInput"
                          type="number" required min={0} value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder={discountType === 'percentage' ? 'Ví dụ: 20' : 'Ví dụ: 50000'}
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="maxDiscountInput" className={labelCls}>Giảm tối đa (đ)</label>
                        <input
                          id="maxDiscountInput"
                          type="number" value={maxDiscountAmount}
                          onChange={(e) => setMaxDiscountAmount(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Không giới hạn"
                          className={inputCls}
                        />
                        <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1"><FiInfo className="text-xs" /> Áp dụng khi giảm theo %</p>
                      </div>
                      <div>
                        <label htmlFor="minOrderInput" className={labelCls}>Đơn tối thiểu (đ)</label>
                        <input
                          id="minOrderInput"
                          type="number" value={minOrderValue}
                          onChange={(e) => setMinOrderValue(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="0 = không giới hạn"
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>
                </SectionCard>
              )}

              {/* Flash Sale / Combo: product list + discount */}
              {(type === 'flash_sale' || type === 'combo') && (
                <div className="rounded-xl border border-orange-200 overflow-hidden">
                  <div className="bg-orange-50 px-5 py-3 border-b border-orange-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-orange-700">Sản phẩm áp dụng</span>
                    <span className="flex items-center gap-1 text-xs text-orange-600 font-semibold bg-orange-100 px-2.5 py-0.5 rounded-full">
                      <FiCheckCircle className="text-xs" />{selectedProducts.length} đã chọn
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                      {products.length === 0 ? (
                        <p className="text-center text-slate-400 text-sm py-8">Đang tải sản phẩm...</p>
                      ) : products.map((p) => {
                        const isChecked = selectedProducts.some(sp => sp.productId === p._id);
                        const matched = selectedProducts.find(sp => sp.productId === p._id);
                        return (
                          <div
                            key={p._id}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                              isChecked ? 'border-orange-300 bg-orange-50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                            }`}
                          >
                            <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                              <input
                                type="checkbox" checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedProducts(prev => [...prev, { productId: p._id, customPrice: p.price }]);
                                  else setSelectedProducts(prev => prev.filter(sp => sp.productId !== p._id));
                                }}
                                className="w-4 h-4 rounded accent-orange-500 flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-700 truncate">{p.name}</p>
                                <p className="text-xs text-slate-400">{formatCurrency(p.price)}</p>
                              </div>
                            </label>
                            {isChecked && (
                              <input
                                type="number"
                                placeholder="Giá sale..."
                                value={matched?.customPrice === 0 ? '' : (matched?.customPrice ?? '')}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                                  setSelectedProducts(prev => prev.map(sp => sp.productId === p._id ? { ...sp, customPrice: val } : sp));
                                }}
                                className="ml-2 w-28 px-3 py-1.5 border border-orange-300 rounded-lg text-xs text-orange-700 font-semibold outline-none focus:ring-2 focus:ring-orange-100 flex-shrink-0"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {selectedProducts.length === 0 && (
                      <p className="text-xs text-orange-400 font-medium text-center mt-2 flex items-center justify-center gap-1"><FiAlertTriangle /> Vui lòng chọn ít nhất 1 sản phẩm.</p>
                    )}
                  </div>

                  {/* Discount config for flash_sale / combo */}
                  <div className="border-t border-orange-100 bg-orange-50/30 px-5 py-4 space-y-3">
                    <p className="text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1.5"><FiDollarSign />Cấu hình giảm giá</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Cách thức giảm</label>
                        <select
                          value={discountType}
                          onChange={(e) => setDiscountType(e.target.value as any)}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-orange-400"
                        >
                          <option value="percentage">Giảm theo %</option>
                          <option value="fixed_amount">Giảm tiền mặt (đ)</option>
                          <option value="fixed_price">Giá combo cố định</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Giá trị <span className="text-red-400 normal-case">*</span></label>
                        <input
                          type="number" required min={0} value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-orange-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Đơn tối thiểu (đ)</label>
                      <input
                        type="number" value={minOrderValue}
                        onChange={(e) => setMinOrderValue(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0 = không giới hạn"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* New user hint */}
              {type === 'new_user' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <p className="text-sm font-bold text-blue-800 mb-1.5 flex items-center gap-2"><FiInfo className="text-blue-500" />Voucher người dùng mới</p>
                  <p className="text-sm text-blue-600 leading-relaxed">
                    Voucher sẽ tự động phát cho khách hàng khi đăng ký tài khoản lần đầu. Không cần mã nhập tay, hệ thống tự xử lý.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <FiInfo className="text-slate-300" /> Trường có dấu <span className="text-red-400 font-bold">*</span> là bắt buộc
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button" onClick={resetForm}
                className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-7 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-100"
              >
                {editTarget ? <><FiSave />Lưu thay đổi</> : <><FiZap />Tạo chương trình</>}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Stats Modal */}
      <Modal isOpen={!!statsTarget} onClose={() => setStatsTarget(null)} title={`Hiệu suất: ${statsTarget?.name ?? ''}`} size="md">
        {statsLoading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Đang tải số liệu...</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <p className="text-xs text-slate-400 font-medium mb-1">Lượt sử dụng</p>
                <h4 className="text-2xl font-bold text-slate-800">{statsData?.usedCount ?? 0}</h4>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                <p className="text-xs text-red-400 font-medium mb-1">Đã chiết khấu</p>
                <h4 className="text-xl font-bold text-red-500">{formatCurrency(statsData?.totalDiscountedAmount ?? 0)}</h4>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                <p className="text-xs text-emerald-400 font-medium mb-1">Doanh thu tạo ra</p>
                <h4 className="text-xl font-bold text-emerald-600">{formatCurrency(statsData?.totalOrderValueGenerated ?? 0)}</h4>
              </div>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-emerald-800 mb-1">Chỉ số hoàn vốn (ROI)</p>
                <p className="text-xs text-emerald-600">Doanh thu / Chi phí giảm giá</p>
              </div>
              <h3 className="text-4xl font-extrabold text-emerald-700">{statsData?.roi ?? 0}<span className="text-xl">x</span></h3>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setStatsTarget(null)} className="px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors">
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa chương trình khuyến mãi"
        message={`Bạn có chắc chắn muốn xóa chương trình "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
      />
    </div>
  );
};

export default PromotionManagementPage;
