import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiGrid, FiList, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';
import { usePagination } from '../hooks/usePagination';
import { PAGE_SIZE } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import {
  fetchAdminProducts,
  fetchAdminCategories,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  type BackendProduct,
  type BackendCategory
} from '../servers/products';

const ProductManagementPage = () => {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tất cả');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deleteTarget, setDeleteTarget] = useState<BackendProduct | null>(null);
  const [editTarget, setEditTarget] = useState<BackendProduct | null>(null);
  const [detailTarget, setDetailTarget] = useState<BackendProduct | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [prodList, catList] = await Promise.all([
          fetchAdminProducts(),
          fetchAdminCategories()
        ]);
        setProducts(prodList);
        setCategories(catList);
      } catch (err) {
        console.error(err);
        toast.error('Không thể tải dữ liệu từ máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const catName = typeof p.categoryId === 'object' ? p.categoryId.name : '';
    const matchCategory = categoryFilter === 'Tất cả' || catName === categoryFilter;
    return matchSearch && matchCategory;
  });

  const pagination = usePagination({ totalItems: filteredProducts.length, pageSize: viewMode === 'grid' ? 12 : PAGE_SIZE });
  const paginatedProducts = filteredProducts.slice(pagination.startIndex, pagination.endIndex);

  const handleDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteAdminProduct(deleteTarget._id);
        setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
        toast.success(`Đã xóa sản phẩm "${deleteTarget.name}" thành công.`);
      } catch (err) {
        console.error(err);
        toast.error('Xóa sản phẩm thất bại.');
      } finally {
        setDeleteTarget(null);
      }
    }
  };

  const columns: Column<BackendProduct>[] = [
    {
      key: 'name',
      label: 'Sản phẩm',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.gallery?.[0] || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=300&fit=crop'} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <p className="text-sm font-semibold text-slate-700">{p.name}</p>
            <p className="text-xs text-slate-400">
              {typeof p.categoryId === 'object' ? p.categoryId.name : ''}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Giá',
      sortable: true,
      render: (p) => (
        <div>
          <p className="text-sm font-semibold text-emerald-600">{formatCurrency(p.price)}</p>
          {p.oldPrice > p.price && (
            <p className="text-xs text-slate-400 line-through">{formatCurrency(p.oldPrice)}</p>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      label: 'Trạng thái kho',
      sortable: true,
      className: 'hidden md:table-cell',
      render: (p) => (
        <span className="text-sm text-slate-600 font-medium">
          {p.stockText}
        </span>
      ),
    },
    {
      key: 'reviewsCount',
      label: 'Số đánh giá',
      sortable: true,
      className: 'hidden lg:table-cell',
      render: (p) => <span className="text-sm text-slate-600">{p.reviewsCount}</span>,
    },
    {
      key: 'rating',
      label: 'Đánh giá',
      className: 'hidden lg:table-cell',
      render: (p) => <StarRating rating={Math.round(p.rating || 0)} size="sm" showValue />,
    },
    {
      key: 'actions',
      label: '',
      render: (p) => (
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); setDetailTarget(p); }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-emerald-500"
            title="Xem chi tiết"
          >
            <FiEye className="text-sm" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setEditTarget(p); }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-blue-500"
            title="Chỉnh sửa"
          >
            <FiEdit2 className="text-sm" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-red-500"
            title="Xóa"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      ),
    },
  ];

  const ProductForm = ({ product }: { product?: BackendProduct }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      categoryId: typeof product?.categoryId === 'object' ? product.categoryId._id : (product?.categoryId || ''),
      price: product?.price || 0,
      oldPrice: product?.oldPrice || 0,
      badges: product?.badges?.join(', ') || '',
      stockText: product?.stockText || 'Còn hàng',
      origin: product?.origin || 'Việt Nam',
      weight: product?.weight || '1kg',
      unit: product?.unit || 'kg',
      shelfLife: product?.shelfLife || '3-5 ngày',
      storage: product?.storage || 'Ngăn mát tủ lạnh',
      shortDescription: product?.shortDescription || '',
      description: product?.description || '',
      gallery: product?.gallery?.join('\n') || '',
      nutrition: product?.nutrition?.join(', ') || '',
      storageTips: product?.storageTips?.join('\n') || '',
      rating: product?.rating || 5,
      reviewsCount: product?.reviewsCount || 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim()) {
        toast.error('Vui lòng nhập tên sản phẩm.');
        return;
      }
      if (!formData.categoryId) {
        toast.error('Vui lòng chọn danh mục.');
        return;
      }

      const payload = {
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        price: Number(formData.price) || 0,
        oldPrice: Number(formData.oldPrice) || 0,
        badges: formData.badges.split(',').map(s => s.trim()).filter(Boolean),
        stockText: formData.stockText.trim(),
        origin: formData.origin.trim(),
        weight: formData.weight.trim(),
        unit: formData.unit.trim(),
        shelfLife: formData.shelfLife.trim(),
        storage: formData.storage.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        gallery: formData.gallery.split('\n').map(s => s.trim()).filter(Boolean),
        nutrition: formData.nutrition.split(',').map(s => s.trim()).filter(Boolean),
        storageTips: formData.storageTips.split('\n').map(s => s.trim()).filter(Boolean),
        rating: Number(formData.rating) || 5,
        reviewsCount: Number(formData.reviewsCount) || 0
      };

      try {
        if (product) {
          const res = await updateAdminProduct(product._id, payload);
          if (res) {
            const updatedList = await fetchAdminProducts();
            setProducts(updatedList);
            toast.success('Cập nhật sản phẩm thành công!');
            setEditTarget(null);
          } else {
            toast.error('Cập nhật sản phẩm thất bại.');
          }
        } else {
          const res = await createAdminProduct(payload);
          if (res) {
            const updatedList = await fetchAdminProducts();
            setProducts(updatedList);
            toast.success('Thêm sản phẩm thành công!');
            setShowAddModal(false);
          } else {
            toast.error('Thêm sản phẩm thất bại.');
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Đã xảy ra lỗi khi lưu sản phẩm.');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Tên sản phẩm *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nhập tên sản phẩm..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Danh mục *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 bg-white"
              required
            >
              <option value="">Chọn danh mục...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Giá bán *</label>
            <input
              type="number"
              value={formData.price || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              placeholder="0"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Giá gốc *</label>
            <input
              type="number"
              value={formData.oldPrice || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, oldPrice: Number(e.target.value) }))}
              placeholder="0"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Xuất xứ *</label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
              placeholder="Việt Nam, Mỹ..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Khối lượng *</label>
            <input
              type="text"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              placeholder="1kg, 500g..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Đơn vị *</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              placeholder="kg, hộp, túi..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Hạn sử dụng *</label>
            <input
              type="text"
              value={formData.shelfLife}
              onChange={(e) => setFormData(prev => ({ ...prev, shelfLife: e.target.value }))}
              placeholder="3-5 ngày, 1 tháng..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Cách bảo quản *</label>
            <input
              type="text"
              value={formData.storage}
              onChange={(e) => setFormData(prev => ({ ...prev, storage: e.target.value }))}
              placeholder="Ngăn mát tủ lạnh..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Trạng thái kho *</label>
            <input
              type="text"
              value={formData.stockText}
              onChange={(e) => setFormData(prev => ({ ...prev, stockText: e.target.value }))}
              placeholder="Còn hàng, Hết hàng..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Nhãn (cách nhau bằng dấu phẩy)</label>
            <input
              type="text"
              value={formData.badges}
              onChange={(e) => setFormData(prev => ({ ...prev, badges: e.target.value }))}
              placeholder="Hot, Sale, New..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Đánh giá (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
              placeholder="5"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Số lượt đánh giá</label>
            <input
              type="number"
              value={formData.reviewsCount}
              onChange={(e) => setFormData(prev => ({ ...prev, reviewsCount: Number(e.target.value) }))}
              placeholder="0"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Mô tả ngắn *</label>
          <textarea
            value={formData.shortDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
            placeholder="Mô tả ngắn về sản phẩm..."
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 resize-none"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Mô tả chi tiết *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Mô tả chi tiết sản phẩm..."
            rows={4}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 resize-none"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Danh sách URL hình ảnh (mỗi ảnh một dòng) *</label>
          <textarea
            value={formData.gallery}
            onChange={(e) => setFormData(prev => ({ ...prev, gallery: e.target.value }))}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            rows={3}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 font-mono"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Giá trị dinh dưỡng (cách nhau bằng dấu phẩy)</label>
          <input
            type="text"
            value={formData.nutrition}
            onChange={(e) => setFormData(prev => ({ ...prev, nutrition: e.target.value }))}
            placeholder="Vitamin C, Kali, Chất xơ..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Mẹo bảo quản (mỗi dòng một mẹo)</label>
          <textarea
            value={formData.storageTips}
            onChange={(e) => setFormData(prev => ({ ...prev, storageTips: e.target.value }))}
            placeholder="Nên bọc màng thực phẩm...&#10;Tránh ánh nắng trực tiếp..."
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-2">
          <button
            type="button"
            onClick={() => { setEditTarget(null); setShowAddModal(false); }}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
          >
            {product ? 'Cập nhật' : 'Thêm sản phẩm'}
          </button>
        </div>
      </form>
    );
  };

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
          placeholder="Tìm kiếm sản phẩm..."
          onChange={setSearch}
          className="w-full sm:w-72"
        />
        <div className="flex items-center gap-2">
          <div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <FiGrid className="text-sm" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <FiList className="text-sm" />
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
          >
            <FiPlus className="text-sm" />
            Thêm sản phẩm
          </button>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {['Tất cả', ...categories.map((c) => c.name)].map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategoryFilter(cat); pagination.setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {paginatedProducts.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img src={product.gallery?.[0] || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=300&fit=crop'} alt={product.name} className="w-full h-40 object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-slate-700 truncate">{product.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {typeof product.categoryId === 'object' ? product.categoryId.name : ''}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-sm font-bold text-emerald-600">{formatCurrency(product.price)}</p>
                      {product.oldPrice > product.price && (
                        <p className="text-xs text-slate-400 line-through">{formatCurrency(product.oldPrice)}</p>
                      )}
                    </div>
                    <StarRating rating={Math.round(product.rating || 0)} size="sm" />
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                    <span className="text-xs text-slate-400">Kho: {product.stockText}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailTarget(product)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-emerald-500"
                        title="Xem chi tiết"
                      >
                        <FiEye className="text-xs" />
                      </button>
                      <button
                        onClick={() => setEditTarget(product)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-blue-500"
                        title="Chỉnh sửa"
                      >
                        <FiEdit2 className="text-xs" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-red-500"
                        title="Xóa"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <DataTable
              columns={columns}
              data={paginatedProducts}
              keyExtractor={(p) => p._id}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.setPage}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalItems={filteredProducts.length}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
      />

      {/* Edit Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Chỉnh sửa sản phẩm" size="lg">
        {editTarget && <ProductForm product={editTarget} />}
      </Modal>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Thêm sản phẩm mới" size="lg">
        <ProductForm />
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!detailTarget} onClose={() => setDetailTarget(null)} title="Chi tiết sản phẩm" size="lg">
        {detailTarget && (
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image Gallery */}
              <div className="space-y-3">
                <img
                  src={detailTarget.gallery?.[0] || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&h=500&fit=crop'}
                  alt={detailTarget.name}
                  className="w-full h-64 object-cover rounded-2xl border border-slate-100 shadow-sm"
                />
                <div className="grid grid-cols-3 gap-2">
                  {detailTarget.gallery?.slice(1, 4).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${detailTarget.name} ${idx + 1}`}
                      className="w-full h-20 object-cover rounded-xl border border-slate-100 shadow-sm"
                    />
                  ))}
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {typeof detailTarget.categoryId === 'object' ? detailTarget.categoryId.name : 'Danh mục'}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 mt-2">{detailTarget.name}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-emerald-600">
                    {formatCurrency(detailTarget.price)}
                  </span>
                  {detailTarget.oldPrice > detailTarget.price && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatCurrency(detailTarget.oldPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(detailTarget.rating || 0)} size="sm" showValue />
                  <span className="text-xs text-slate-400">({detailTarget.reviewsCount} đánh giá)</span>
                </div>

                <div className="border-t border-b border-slate-50 py-3 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Xuất xứ:</span>
                    <span className="font-medium text-slate-700">{detailTarget.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trọng lượng / Quy cách:</span>
                    <span className="font-medium text-slate-700">{detailTarget.weight} / {detailTarget.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hạn sử dụng:</span>
                    <span className="font-medium text-slate-700">{detailTarget.shelfLife}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trạng thái kho:</span>
                    <span className="font-medium text-emerald-600">{detailTarget.stockText}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Detailed Specs */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Mô tả ngắn</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{detailTarget.shortDescription}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Mô tả chi tiết</h4>
                <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap">{detailTarget.description}</p>
              </div>

              {detailTarget.nutrition && detailTarget.nutrition.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">Giá trị dinh dưỡng</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {detailTarget.nutrition.map((item, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {detailTarget.storageTips && detailTarget.storageTips.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">Mẹo bảo quản</h4>
                  <ul className="list-disc list-inside text-sm text-slate-500 space-y-1 mt-1">
                    {detailTarget.storageTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
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

export default ProductManagementPage;
