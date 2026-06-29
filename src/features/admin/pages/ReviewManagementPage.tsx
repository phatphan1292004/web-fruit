import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiEye, FiEyeOff, FiMessageCircle, FiSend } from 'react-icons/fi';
import SearchInput from '../components/SearchInput';
import StarRating from '../components/StarRating';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';
import { PAGE_SIZE } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import {
  fetchAdminReviews,
  updateAdminReview,
  deleteAdminReview,
  type BackendReview
} from '../servers/reviews';

interface AdminReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
  isHidden: boolean;
  reply: string;
}

const mapBackendReviewToAdmin = (r: BackendReview): AdminReview => {
  const productObj = typeof r.productId === 'object' ? r.productId : null;
  const productName = productObj?.name ?? 'Sản phẩm';
  const productImage = productObj?.gallery?.[0] ?? productObj?.image ?? 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=80&h=80&fit=crop';

  return {
    id: r._id,
    userId: r.firebaseUid,
    userName: r.displayName,
    userAvatar: r.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.displayName}`,
    productId: productObj?._id ?? String(r.productId ?? ''),
    productName,
    productImage,
    rating: r.rating,
    comment: r.comment,
    date: r.createdAt,
    isHidden: r.isHidden,
    reply: r.reply || '',
  };
};

const ratingFilters = [
  { key: 'all', label: 'Tất cả' },
  { key: '5', label: '5 ⭐' },
  { key: '4', label: '4 ⭐' },
  { key: '3', label: '3 ⭐' },
  { key: '2', label: '2 ⭐' },
  { key: '1', label: '1 ⭐' },
];

const ReviewManagementPage = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminReviews();
        setReviews(data.map(mapBackendReviewToAdmin));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    const matchSearch =
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    const matchRating = ratingFilter === 'all' || r.rating === parseInt(ratingFilter);
    return matchSearch && matchRating;
  });

  const pagination = usePagination({ totalItems: filteredReviews.length, pageSize: PAGE_SIZE });
  const paginatedReviews = filteredReviews.slice(pagination.startIndex, pagination.endIndex);

  useEffect(() => {
    pagination.setPage(1);
  }, [search, ratingFilter]);

  const handleDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteAdminReview(deleteTarget.id);
        setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      } catch (err) {
        console.error(err);
      } finally {
        setDeleteTarget(null);
      }
    }
  };

  const toggleHidden = async (id: string) => {
    const review = reviews.find((r) => r.id === id);
    if (!review) return;
    try {
      const updated = await updateAdminReview(id, { isHidden: !review.isHidden });
      if (updated) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? mapBackendReviewToAdmin(updated) : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (id: string) => {
    if (replyText.trim()) {
      try {
        const updated = await updateAdminReview(id, { reply: replyText.trim() });
        if (updated) {
          setReviews((prev) =>
            prev.map((r) => (r.id === id ? mapBackendReviewToAdmin(updated) : r))
          );
          setReplyingTo(null);
          setReplyText('');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
          <p className="text-2xl font-bold text-slate-800">{reviews.length}</p>
          <p className="text-xs text-slate-400">Tổng đánh giá</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
          <p className="text-2xl font-bold text-amber-500">{avgRating}</p>
          <p className="text-xs text-slate-400">Điểm trung bình</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
          <p className="text-2xl font-bold text-emerald-500">{reviews.filter((r) => r.rating >= 4).length}</p>
          <p className="text-xs text-slate-400">Đánh giá tốt</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
          <p className="text-2xl font-bold text-red-500">{reviews.filter((r) => r.isHidden).length}</p>
          <p className="text-xs text-slate-400">Đã ẩn</p>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
      >
        <SearchInput
          placeholder="Tìm sản phẩm, người dùng..."
          onChange={setSearch}
          className="w-full sm:w-72"
        />
        <div className="flex gap-2 overflow-x-auto">
          {ratingFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setRatingFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                ratingFilter === f.key
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {paginatedReviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -2 }}
            className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-shadow hover:shadow-md ${
              review.isHidden ? 'opacity-60' : ''
            }`}
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full bg-slate-100" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{review.userName}</p>
                    <p className="text-xs text-slate-400">{formatDate(review.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleHidden(review.id)}
                    className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                      review.isHidden ? 'text-slate-300' : 'text-emerald-500'
                    }`}
                    title={review.isHidden ? 'Hiện' : 'Ẩn'}
                  >
                    {review.isHidden ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(review)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-red-500"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Product */}
              <div className="flex items-center gap-2 mb-3 p-2 bg-slate-50 rounded-lg">
                <img src={review.productImage} alt={review.productName} className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-xs font-medium text-slate-600 truncate">{review.productName}</span>
              </div>

              {/* Rating & Comment */}
              <StarRating rating={review.rating} size="sm" />
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{review.comment}</p>

              {/* Reply */}
              {review.reply && (
                <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">🏪 Phản hồi từ shop</p>
                  <p className="text-sm text-emerald-800">{review.reply}</p>
                </div>
              )}

              {/* Reply Input */}
              {replyingTo === review.id ? (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Nhập phản hồi..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                    onKeyDown={(e) => e.key === 'Enter' && handleReply(review.id)}
                    autoFocus
                  />
                  <button
                    onClick={() => handleReply(review.id)}
                    className="p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
                  >
                    <FiSend className="text-sm" />
                  </button>
                </div>
              ) : (
                !review.reply && (
                  <button
                    onClick={() => { setReplyingTo(review.id); setReplyText(''); }}
                    className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                  >
                    <FiMessageCircle className="text-sm" />
                    Trả lời
                  </button>
                )
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm">Không tìm thấy đánh giá nào</p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-end bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.setPage}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={filteredReviews.length}
        />
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa đánh giá"
        message={`Bạn có chắc chắn muốn xóa đánh giá của "${deleteTarget?.userName}"?`}
        confirmText="Xóa"
      />
    </div>
  );
};

export default ReviewManagementPage;
