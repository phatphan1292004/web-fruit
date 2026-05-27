import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiGrid, FiList } from 'react-icons/fi';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';
import { usePagination } from '../hooks/usePagination';
import { mockProducts, productCategories, type AdminProduct } from '../mock/products';
import { PAGE_SIZE } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

const ProductManagementPage = () => {
  const [products, setProducts] = useState<AdminProduct[]>(mockProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tất cả');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [editTarget, setEditTarget] = useState<AdminProduct | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'Tất cả' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const pagination = usePagination({ totalItems: filteredProducts.length, pageSize: viewMode === 'grid' ? 12 : PAGE_SIZE });
  const paginatedProducts = filteredProducts.slice(pagination.startIndex, pagination.endIndex);

  const handleDelete = () => {
    if (deleteTarget) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const toggleVisibility = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isVisible: !p.isVisible } : p))
    );
  };

  const columns: Column<AdminProduct>[] = [
    {
      key: 'name',
      label: 'Sản phẩm',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <p className="text-sm font-semibold text-slate-700">{p.name}</p>
            <p className="text-xs text-slate-400">{p.category}</p>
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
          {p.originalPrice > p.price && (
            <p className="text-xs text-slate-400 line-through">{formatCurrency(p.originalPrice)}</p>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      label: 'Kho',
      sortable: true,
      className: 'hidden md:table-cell',
      render: (p) => (
        <span className={`text-sm font-medium ${p.stock <= 20 ? 'text-red-500' : 'text-slate-600'}`}>
          {p.stock} {p.unit}
        </span>
      ),
    },
    {
      key: 'sold',
      label: 'Đã bán',
      sortable: true,
      className: 'hidden lg:table-cell',
      render: (p) => <span className="text-sm text-slate-600">{p.sold}</span>,
    },
    {
      key: 'rating',
      label: 'Đánh giá',
      className: 'hidden lg:table-cell',
      render: (p) => <StarRating rating={Math.round(p.rating)} size="sm" showValue />,
    },
    {
      key: 'actions',
      label: '',
      render: (p) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); toggleVisibility(p.id); }}
            className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${
              p.isVisible ? 'text-emerald-500' : 'text-slate-300'
            }`}
            title={p.isVisible ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
          >
            {p.isVisible ? <FiEye className="text-sm" /> : <FiEyeOff className="text-sm" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setEditTarget(p); }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-blue-500"
          >
            <FiEdit2 className="text-sm" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-red-500"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      ),
    },
  ];

  const ProductForm = ({ product }: { product?: AdminProduct }) => (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Tên sản phẩm</label>
        <input
          type="text"
          defaultValue={product?.name || ''}
          placeholder="Nhập tên sản phẩm..."
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Giá bán</label>
          <input
            type="number"
            defaultValue={product?.price || ''}
            placeholder="0"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Giá gốc</label>
          <input
            type="number"
            defaultValue={product?.originalPrice || ''}
            placeholder="0"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Danh mục</label>
          <select
            defaultValue={product?.category || ''}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          >
            {productCategories.filter((c) => c !== 'Tất cả').map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Đơn vị</label>
          <input
            type="text"
            defaultValue={product?.unit || ''}
            placeholder="kg, hộp, trái..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Tồn kho</label>
        <input
          type="number"
          defaultValue={product?.stock || ''}
          placeholder="0"
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Mô tả</label>
        <textarea
          defaultValue={product?.description || ''}
          placeholder="Mô tả sản phẩm..."
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 resize-none"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Hình ảnh</label>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-emerald-300 transition-colors cursor-pointer">
          {product?.image ? (
            <img src={product.image} alt={product.name} className="w-24 h-24 rounded-xl object-cover mx-auto mb-2" />
          ) : (
            <div className="text-slate-400 text-sm">
              <FiPlus className="text-2xl mx-auto mb-1" />
              <p>Kéo thả hoặc click để tải ảnh</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={() => { setEditTarget(null); setShowAddModal(false); }}
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={() => { setEditTarget(null); setShowAddModal(false); }}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
        >
          {product ? 'Cập nhật' : 'Thêm sản phẩm'}
        </button>
      </div>
    </div>
  );

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
        {productCategories.map((cat) => (
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
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow ${
                  !product.isVisible ? 'opacity-60' : ''
                }`}
              >
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                  {!product.isVisible && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">Đã ẩn</span>
                    </div>
                  )}
                  {product.stock <= 20 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Sắp hết
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-slate-700 truncate">{product.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{product.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-sm font-bold text-emerald-600">{formatCurrency(product.price)}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-xs text-slate-400 line-through">{formatCurrency(product.originalPrice)}</p>
                      )}
                    </div>
                    <StarRating rating={Math.round(product.rating)} size="sm" />
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                    <span className="text-xs text-slate-400">Kho: {product.stock} • Bán: {product.sold}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleVisibility(product.id)}
                        className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                          product.isVisible ? 'text-emerald-500' : 'text-slate-300'
                        }`}
                      >
                        {product.isVisible ? <FiEye className="text-xs" /> : <FiEyeOff className="text-xs" />}
                      </button>
                      <button
                        onClick={() => setEditTarget(product)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
                      >
                        <FiEdit2 className="text-xs" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-red-500"
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
              keyExtractor={(p) => p.id}
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
    </div>
  );
};

export default ProductManagementPage;
