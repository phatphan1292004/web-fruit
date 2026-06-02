import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { ProductReview, ProductDetail } from './types';
import { createReview } from '../servers';

type ReviewSectionProps = {
  product: ProductDetail;
  reviews: ProductReview[];
  onReviewSubmitted: () => void;
};

const readCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const ReviewSection = ({ product, reviews, onReviewSubmitted }: ReviewSectionProps) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = readCookie('userId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      navigate('/login');
      return;
    }

    if (!product._id) {
      setError('Sản phẩm không hợp lệ hoặc chưa được tải.');
      return;
    }

    if (!comment.trim()) {
      setError('Vui lòng nhập nội dung đánh giá.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createReview({
        productId: product._id,
        firebaseUid: userId,
        rating,
        comment: comment.trim(),
      });
      setComment('');
      setRating(5);
      onReviewSubmitted();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const average = product.rating || 0;
  const totalReviews = reviews.length;
  
  // Calculate star percentages dynamically based on actual reviews
  const ratingCount = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, percent: Math.max(0, percent) };
  });

  return (
    <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)] border border-border/60 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <div className="rounded-[1.5rem] bg-emerald-50 p-6 border border-emerald-100">
          <p className="text-sm text-foreground/60">Đánh giá trung bình</p>
          <div className="mt-2 flex items-end gap-3">
            <span className="text-5xl font-bold text-foreground">{average.toFixed(1)}</span>
            <div className="pb-2 text-amber-500 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <FiStar key={idx} className={idx < Math.round(average) ? 'fill-current' : ''} />
              ))}
            </div>
          </div>
          <p className="text-sm text-foreground/60 mt-2">Dựa trên {product.reviewsCount} lượt đánh giá</p>

          <div className="mt-6 space-y-3">
            {ratingCount.map(({ star, percent }) => (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-8 text-foreground/70">{star}★</span>
                <div className="h-2 flex-1 rounded-full bg-white overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                </div>
                <span className="text-xs text-foreground/45 w-8 text-right">{Math.round(percent)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <p className="text-foreground/50">Chưa có đánh giá nào cho sản phẩm này.</p>
              <p className="text-xs text-foreground/40 mt-1">Hãy là người đầu tiên chia sẻ cảm nhận!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-[1.5rem] border border-border/60 bg-muted/20 p-5"
              >
                <div className="flex items-start gap-4">
                  <img src={review.avatar} alt={review.name} className="h-12 w-12 rounded-full object-cover border border-border" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="font-semibold text-foreground">{review.name}</h4>
                      <span className="text-xs text-foreground/50">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 my-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <FiStar key={idx} className={idx < review.rating ? 'fill-current' : ''} />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/75 leading-relaxed">{review.content}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {!userId ? (
        <div className="rounded-[1.5rem] bg-muted/10 p-8 border border-border/40 text-center space-y-4">
          <h3 className="text-xl font-bold text-foreground">Bạn muốn đánh giá sản phẩm?</h3>
          <p className="text-sm text-foreground/60 max-w-md mx-auto">
            Vui lòng đăng nhập vào tài khoản của bạn để gửi phản hồi và chia sẻ trải nghiệm về sản phẩm.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="rounded-full bg-primary px-8 py-3 text-white font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            Đăng nhập ngay
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-[1.5rem] bg-muted/20 p-6 border border-border/60 space-y-4">
          <h3 className="text-xl font-bold text-foreground">Viết đánh giá của bạn</h3>
          <div className="flex items-center gap-2 text-amber-500 text-lg">
            {Array.from({ length: 5 }).map((_, idx) => (
              <button key={idx} type="button" onClick={() => setRating(idx + 1)}>
                <FiStar className={idx < rating ? 'fill-current' : ''} />
              </button>
            ))}
          </div>
          
          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-100">{error}</p>
          )}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Chia sẻ cảm nhận của bạn về chất lượng sản phẩm..."
            className="w-full rounded-[1.5rem] border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            disabled={isSubmitting}
          />
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewSection;
