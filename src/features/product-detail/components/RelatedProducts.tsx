import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import type { FruitProduct } from '../../category/components/types';
import { useCartStore } from '../../cart/store/cart-store';

type RelatedProductsProps = {
  products: FruitProduct[];
};

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wider text-primary font-semibold">Sản phẩm liên quan</p>
          <h2 className="text-3xl font-bold text-foreground mt-1">Có thể bạn cũng thích</h2>
        </div>
        <Link to="/category" className="text-sm font-semibold text-primary hover:underline">Xem tất cả</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <motion.article
            key={product.id}
            whileHover={{ y: -6 }}
            className="group rounded-3xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden border border-border/50 text-slate-700"
          >
            <Link to={`/product/${product.slug}`} className="relative overflow-hidden block">
              <img src={product.image} alt={product.name} className="h-32 sm:h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 rounded-full bg-primary px-2 py-0.5 text-[9px] sm:text-xs font-semibold text-white">
                {product.label}
              </div>
            </Link>
            <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-3">
              <Link to={`/product/${product.slug}`} className="block">
                <h3 className="text-xs sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[2rem] sm:min-h-0">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                <FiStar className="text-amber-500 w-3.5 h-3.5" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-sm sm:text-lg font-extrabold text-slate-800">{(product.price).toLocaleString('vi-VN')}đ</span>
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
                  className="rounded-full bg-primary text-white p-2 sm:p-3 hover:bg-primary/95 hover:scale-105 transition-all duration-300 shadow-sm shrink-0"
                  aria-label="Them vao gio hang"
                >
                  <FiShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
