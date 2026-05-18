import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import type { ProductReview, ProductDetail } from './types';

type ReviewSectionProps = {
  product: ProductDetail;
  reviews: ProductReview[];
};

const ReviewSection = ({ product, reviews }: ReviewSectionProps) => {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const average = product.rating;
  const ratingCount = [5, 4, 3, 2, 1].map((star) => ({ star, percent: Math.max(10, 100 - (5 - star) * 18) }));

  return (
    <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)] border border-border/60 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <div className="rounded-[1.5rem] bg-emerald-50 p-6 border border-emerald-100">
          <p className="text-sm text-foreground/60">Đánh giá trung bình</p>
          <div className="mt-2 flex items-end gap-3">
            <span className="text-5xl font-bold text-foreground">{average.toFixed(1)}</span>
            <div className="pb-2 text-amber-500 flex items-center gap-1">
              <FiStar /> <FiStar /> <FiStar /> <FiStar /> <FiStar />
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
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[1.5rem] border border-border/60 bg-muted/20 p-5"
            >
              <div className="flex items-start gap-4">
                <img src={review.avatar} alt={review.name} className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-semibold text-foreground">{review.name}</h4>
                    <span className="text-xs text-foreground/50">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 my-1">
                    {Array.from({ length: review.rating }).map((_, idx) => <FiStar key={idx} />)}
                  </div>
                  <p className="text-sm text-foreground/75 leading-relaxed">{review.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-muted/20 p-6 border border-border/60 space-y-4">
        <h3 className="text-xl font-bold text-foreground">Viết đánh giá của bạn</h3>
        <div className="flex items-center gap-2 text-amber-500">
          {Array.from({ length: 5 }).map((_, idx) => (
            <button key={idx} type="button" onClick={() => setRating(idx + 1)}>
              <FiStar className={idx < rating ? 'fill-current' : ''} />
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên của bạn" className="rounded-full border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
          <input placeholder="Email của bạn" className="rounded-full border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} placeholder="Chia sẻ cảm nhận của bạn" className="w-full rounded-[1.5rem] border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        <button className="rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors">Gửi đánh giá</button>
      </div>
    </div>
  );
};

export default ReviewSection;
