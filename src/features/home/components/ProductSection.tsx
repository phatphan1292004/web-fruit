import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

const categories = ['Tất cả', 'Nhập khẩu', 'Nhiệt đới', 'Bán chạy', 'Hữu cơ'];

const products = [
  {
    id: 1,
    name: 'Dâu tây Nhật Bản cao cấp',
    category: 'Nhập khẩu',
    price: 249000,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop',
    badge: 'Bán chạy',
  },
  {
    id: 2,
    name: 'Bơ Hass hữu cơ',
    category: 'Hữu cơ',
    price: 85000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Xoài Thái tươi ngon',
    category: 'Nhiệt đới',
    price: 120000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop',
    badge: 'Theo mùa',
  },
  {
    id: 4,
    name: 'Cherry ngọt nhập khẩu',
    category: 'Nhập khẩu',
    price: 189000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=500&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'Thanh long ruột đỏ hữu cơ',
    category: 'Nhiệt đới',
    price: 99000,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1527310562375-a8f15724a2f0?w=500&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Táo Fuji giòn ngọt',
    category: 'Bán chạy',
    price: 150000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fd6c?w=500&auto=format&fit=crop',
  },
  {
    id: 7,
    name: 'Việt quất tươi',
    category: 'Hữu cơ',
    price: 145000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&auto=format&fit=crop',
    badge: 'Hữu cơ',
  },
  {
    id: 8,
    name: 'Kiwi vàng cao cấp',
    category: 'Nhập khẩu',
    price: 112000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&auto=format&fit=crop',
  },
];

const formatVND = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

const ProductSection = () => {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [page, setPage] = useState(0);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          activeCategory === 'Tất cả' ||
          product.category === activeCategory ||
          (activeCategory === 'Bán chạy' && product.badge === 'Bán chạy')
      ),
    [activeCategory]
  );

  const visibleProducts = useMemo(() => filteredProducts.slice(page, page + 4), [filteredProducts, page]);

  const canPrev = page > 0;
  const canNext = page + 4 < filteredProducts.length;

  const handlePrev = () => setPage((prev) => Math.max(0, prev - 4));
  const handleNext = () => setPage((prev) => Math.min(Math.max(0, filteredProducts.length - 4), prev + 4));

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
            {categories.map((category) => (
              <button key={category} onClick={() => { setActiveCategory(category); setPage(0); }} className={cn('px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300', activeCategory === category ? 'bg-primary text-white shadow-md' : 'text-foreground/70 hover:bg-white hover:text-foreground')}>
                {category}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <button onClick={handlePrev} disabled={!canPrev} className="w-11 h-11 rounded-full border border-border bg-white flex items-center justify-center shadow-sm hover:shadow-md hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-foreground disabled:hover:shadow-sm" aria-label="Sản phẩm trước">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNext} disabled={!canNext} className="w-11 h-11 rounded-full border border-border bg-white flex items-center justify-center shadow-sm hover:shadow-md hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-foreground disabled:hover:shadow-sm" aria-label="Sản phẩm tiếp theo">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`${activeCategory}-${page}`} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {visibleProducts.map((product) => {
                const discount = product.badge ? 'Hot' : 'New';
                return (
                  <motion.div key={product.id} whileHover={{ y: -6 }} className="group rounded-[2rem] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden border border-border/60">
                    <Link to={`/product/${product.id}`} className="relative overflow-hidden block">
                      <img src={product.image} alt={product.name} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {product.badge && <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-md">{product.badge}</span>}
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground shadow-md">{discount}</span>
                      </div>
                    </Link>

                    <div className="p-5 space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">{product.category}</p>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{product.name}</h3>
                        </Link>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Star className="text-amber-500 w-4 h-4" />
                        <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
                        <span>đánh giá</span>
                      </div>

                      <div className="flex items-end gap-3">
                        <span className="text-xl font-bold text-foreground">{formatVND(product.price)}</span>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <Link to={`/product/${product.id}`} className="flex-1 rounded-full bg-primary text-white py-3 font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-lg">
                          <ShoppingCart className="w-4 h-4" />
                          Xem chi tiết
                        </Link>
                        <button className="w-12 h-12 rounded-full border border-border/70 bg-muted/40 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary transition-all duration-300">
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
