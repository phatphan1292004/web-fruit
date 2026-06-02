import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { fetchHomeProducts, type HomeProduct } from '../servers/products';
import { useCartStore } from '../../cart/store/cart-store';

const categoryTabs = [
  { label: 'Tất cả', key: 'all' },
  { label: 'Trong nước', key: 'trai-cay-trong-nuoc' },
  { label: 'Nhập khẩu', key: 'trai-cay-nhap-khau' },
  { label: 'Giỏ quà', key: 'gio-qua-trai-cay' },
  { label: 'Hữu cơ', key: 'trai-cay-huu-co' },
  { label: 'Theo mùa', key: 'trai-cay-theo-mua' },
];

const formatVND = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

const ProductSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchHomeProducts(activeCategory === 'all' ? undefined : activeCategory);
        if (isActive) {
          setProducts(data);
          setPage(0);
        }
      } catch {
        if (isActive) setProducts([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };
    load();

    return () => {
      isActive = false;
    };
  }, [activeCategory]);

  const visibleProducts = useMemo(() => products.slice(page, page + 4), [products, page]);
  const canPrev = page > 0;
  const canNext = page + 4 < products.length;

  const handlePrev = () => setPage((prev) => Math.max(0, prev - 4));
  const handleNext = () => setPage((prev) => Math.min(Math.max(0, products.length - 4), prev + 4));

  return (
    <section className="py-24 bg-muted/10 relative" id="fruits">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center mb-14">
          <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-primary font-semibold tracking-wider uppercase text-sm mb-3">
            Trái cây tươi ngon & cao cấp
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-center mb-8">
            Sản Phẩm Nổi Bật
          </motion.h2>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-2 md:gap-4 p-1 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-border/50">
            {categoryTabs.map((category) => (
              <button key={category.key} onClick={() => setActiveCategory(category.key)} className={cn('px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300', activeCategory === category.key ? 'bg-primary text-white shadow-md' : 'text-foreground/70 hover:bg-white hover:text-foreground')}>
                {category.label}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-end gap-3 mb-6">
            <button onClick={handlePrev} disabled={!canPrev} className="w-9 h-9 rounded-full border border-border bg-white flex items-center justify-center shadow-sm hover:shadow-md hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-foreground disabled:hover:shadow-sm" aria-label="Sản phẩm trước">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNext} disabled={!canNext} className="w-9 h-9 rounded-full border border-border bg-white flex items-center justify-center shadow-sm hover:shadow-md hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-foreground disabled:hover:shadow-sm" aria-label="Sản phẩm tiếp theo">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`${activeCategory}-${page}`} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-4xl bg-white h-105 animate-pulse" />
              )) : visibleProducts.map((product) => {
                const discount = product.badge ? 'Hot' : 'New';
                return (
                  <motion.div key={product.id} whileHover={{ y: -6 }} className="group rounded-4xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden border border-border/60">
                    <Link to={`/product/${product.slug}`} className="relative overflow-hidden block">
                      <img src={product.image ?? undefined} alt={product.name} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {product.badge && <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-md">{product.badge}</span>}
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground shadow-md">{discount}</span>
                      </div>
                    </Link>

                    <div className="p-5 space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">{product.category}</p>
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{product.name}</h3>
                        </Link>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Star className="text-amber-500 w-4 h-4" />
                        <span className="font-semibold text-foreground">{(product.rating ?? 0).toFixed(1)}</span>
                        <span>đánh giá</span>
                      </div>

                      <div className="flex items-end gap-3">
                        <span className="text-xl font-bold text-foreground">{formatVND(product.price)}</span>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <Link to={`/product/${product.slug}`} className="flex-1 rounded-full bg-primary text-white py-3 font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-lg">
                          <ShoppingCart className="w-4 h-4" />
                          Xem chi tiết
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            addItem({
                              id: product.id,
                              productId: product._id ?? String(product.id),
                              name: product.name,
                              description: product.category,
                              price: product.price,
                              image: product.image ?? '',
                              badge: product.badge,
                            })
                          }
                          className="w-12 h-12 rounded-full border border-border/70 bg-muted/40 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary transition-all duration-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-16 text-center">
          <Link to="/category" className="inline-flex items-center justify-center border-2 border-primary text-primary px-10 py-3.5 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors duration-300">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
