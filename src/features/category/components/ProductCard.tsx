import { FiShoppingCart, FiStar, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import type { FruitProduct } from './types';

type ProductCardProps = {
  product: FruitProduct;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group rounded-[2rem] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden border border-border/60"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-md">
            {product.label}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground shadow-md">
            -{discount}%
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
            {product.category}
          </p>
          <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <FiStar className="text-amber-500" />
          <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
          <span>({product.reviews} đánh giá)</span>
        </div>

        <div className="flex items-end gap-3">
          <span className="text-xl font-bold text-foreground">
            {product.price.toLocaleString('vi-VN')}đ
          </span>
          <span className="text-sm text-foreground/50 line-through">
            {product.originalPrice.toLocaleString('vi-VN')}đ
          </span>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button className="flex-1 rounded-full bg-primary text-white py-3 font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-lg">
            <FiShoppingCart className="w-4 h-4" />
            Thêm vào giỏ
          </button>
          <button className="w-12 h-12 rounded-full border border-border/70 bg-muted/40 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary transition-all duration-300">
            <FiTag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
