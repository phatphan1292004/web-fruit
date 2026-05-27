import { FiHeart, FiShare2, FiShield, FiTruck, FiRefreshCw, FiStar, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import QuantitySelector from './QuantitySelector';
import type { ProductDetail } from './types';

type ProductInfoProps = {
  product: ProductDetail;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAddToCart: () => void;
  onAddToFavorite: () => void;
  isFavoriteLoading?: boolean;
  isFavoriteAdded?: boolean;
};

const ProductInfo = ({ product, quantity, onIncrease, onDecrease, onAddToCart, onAddToFavorite, isFavoriteLoading, isFavoriteAdded }: ProductInfoProps) => {
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wider text-primary font-semibold">{product.category}</p>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">{product.name}</h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/70">
          <div className="flex items-center gap-1">
            <FiStar className="text-amber-500" />
            <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
            <span>({product.reviewsCount} đánh giá)</span>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 font-semibold">{product.stockText}</span>
        </div>
      </div>

      <div className="rounded-4xl bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] border border-border/60 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <span className="text-3xl md:text-4xl font-bold text-primary">{product.price.toLocaleString('vi-VN')}đ</span>
          <span className="text-lg text-foreground/40 line-through">{product.oldPrice.toLocaleString('vi-VN')}đ</span>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-600 font-semibold">-{discount}%</span>
        </div>

        <p className="text-foreground/70 leading-relaxed">{product.shortDescription}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            ['Xuất xứ', product.origin],
            ['Khối lượng', product.weight],
            ['Đơn vị tính', product.unit],
            ['Hạn sử dụng', product.shelfLife],
            ['Bảo quản', product.storage],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-muted/40 px-4 py-3">
              <p className="text-foreground/50 text-xs uppercase tracking-wider">{label}</p>
              <p className="font-semibold text-foreground mt-1">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <QuantitySelector quantity={quantity} onDecrease={onDecrease} onIncrease={onIncrease} />
          <button
            type="button"
            onClick={onAddToCart}
            className="rounded-full bg-primary px-6 py-3.5 text-white font-semibold shadow-md hover:shadow-xl hover:bg-primary/90 transition-all duration-300"
          >
            Thêm vào giỏ hàng
          </button>
          <button className="rounded-full border border-border px-5 py-3.5 text-foreground hover:border-primary hover:text-primary transition-all duration-300">
            Mua ngay
          </button>
          <button
            type="button"
            onClick={onAddToFavorite}
            disabled={isFavoriteLoading}
            className={`rounded-full border px-4 py-3.5 transition-all duration-300 ${
              isFavoriteAdded
                ? 'border-rose-500 text-rose-500 bg-rose-50'
                : 'border-border text-foreground hover:border-primary hover:text-primary'
            } ${isFavoriteLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            aria-label="Them vao yeu thich"
          >
            <FiHeart />
          </button>
        </div>

        <div className="flex items-center gap-3 text-foreground/60">
          <button className="flex items-center gap-2 text-sm hover:text-primary transition-colors"><FiShare2 /> Chia sẻ</button>
          <span className="w-1 h-1 rounded-full bg-foreground/20"></span>
          <button className="flex items-center gap-2 text-sm hover:text-primary transition-colors"><FiClock /> Lưu xem sau</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: FiTruck, title: 'Giao nhanh', text: 'Giao trong ngày nội thành' },
          { icon: FiShield, title: 'Tươi mỗi ngày', text: 'Sản phẩm được tuyển chọn mới' },
          { icon: FiRefreshCw, title: 'Đổi trả nếu lỗi', text: 'Hỗ trợ đổi trả nhanh chóng' },
        ].map((item) => (
          <motion.div
            key={item.title}
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-white p-4 shadow-sm border border-border/60 flex items-start gap-3"
          >
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{item.title}</h4>
              <p className="text-sm text-foreground/60">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfo;
