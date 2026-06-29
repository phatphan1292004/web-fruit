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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.article
            key={product.id}
            whileHover={{ y: -6 }}
            className="group rounded-[2rem] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden border border-border/60"
          >
            <Link to={`/product/${product.slug}`} className="relative overflow-hidden block">
              <img src={product.image} alt={product.name} className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                {product.label}
              </div>
            </Link>
            <div className="p-5 space-y-3">
              <Link to={`/product/${product.slug}`} className="block">
                <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <FiStar className="text-amber-500" /> {product.rating.toFixed(1)}
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-foreground">{product.price.toLocaleString('vi-VN')}đ</span>
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
                  className="rounded-full bg-primary text-white p-3 hover:bg-primary/95 hover:scale-105 transition-all duration-300 shadow-sm"
                >
                  <FiShoppingCart />
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
