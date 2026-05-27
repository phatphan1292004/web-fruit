import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiEye, FiEyeOff, FiMessageCircle, FiSend } from 'react-icons/fi';
import SearchInput from '../components/SearchInput';
import StarRating from '../components/StarRating';
import ConfirmDialog from '../components/ConfirmDialog';
import { mockReviews, type AdminReview } from '../mock/reviews';
import { formatDate } from '../utils/formatters';

const ratingFilters = [
  { key: 'all', label: 'Tất cả' },
  { key: '5', label: '5 ⭐' },
  { key: '4', label: '4 ⭐' },
  { key: '3', label: '3 ⭐' },
  { key: '2', label: '2 ⭐' },
  { key: '1', label: '1 ⭐' },
];

const ReviewManagementPage = () => {
  const [reviews, setReviews] = useState<AdminReview[]>(mockReviews);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredReviews = reviews.filter((r) => {
    const matchSearch =
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    const matchRating = ratingFilter === 'all' || r.rating === parseInt(ratingFilter);
    return matchSearch && matchRating;
  });

  const handleDelete = () => {
    if (deleteTarget) {
      setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const toggleHidden = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isHidden: !r.isHidden } : r))
    );
  };

  const handleReply = (id: string) => {
    if (replyText.trim()) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, reply: replyText.trim() } : r))
      );
      setReplyingTo(null);
      setReplyText('');
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

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
        {filteredReviews.map((review, idx) => (
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
