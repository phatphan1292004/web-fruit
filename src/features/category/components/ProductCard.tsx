import { FiShoppingCart, FiStar, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { FruitProduct } from './types';
import { useCartStore } from '../../cart/store/cart-store';

type ProductCardProps = {
  product: FruitProduct;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const originalPrice = product.originalPrice ?? product.price;
  const discount = originalPrice > product.price ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group rounded-3xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden border border-border/50 text-slate-700"
    >
      <Link to={`/product/${product.slug}`} className="relative overflow-hidden block">
        <img
          src={product.image}
          alt={product.name}
          className="h-32 sm:h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex gap-1.5">
          <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] sm:text-xs font-semibold text-white shadow-md">
            {product.label}
          </span>
          {discount > 0 && (
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] sm:text-xs font-semibold text-foreground shadow-md">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-primary font-semibold mb-0.5">
            {product.category}
          </p>
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-xs sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[2rem] sm:min-h-0">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-foreground/70">
          <FiStar className="text-amber-500 w-3.5 h-3.5" />
          <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
          <span className="hidden sm:inline">({product.reviews} đánh giá)</span>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-sm sm:text-xl font-extrabold text-slate-800">
            {product.price.toLocaleString('vi-VN')}đ
          </span>
          {discount > 0 && (
            <span className="text-[10px] sm:text-sm text-foreground/50 line-through">
              {originalPrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1 sm:pt-2">
          <button
            type="button"
            onClick={() =>
              addItem({
                id: product.id,
                productId: product._id ?? String(product.id),
                name: product.name,
                description: product.category,
                price: product.price,
                image: product.image,
                badge: product.label,
              })
            }
            className="flex-1 rounded-full bg-primary text-white py-1.5 sm:py-3 text-[10px] sm:text-sm font-semibold flex items-center justify-center gap-1 hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <FiShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Thêm giỏ</span>
          </button>
          <button className="w-7 h-7 sm:w-12 sm:h-12 rounded-full border border-border/70 bg-muted/40 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary transition-all duration-300 shrink-0">
            <FiTag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
