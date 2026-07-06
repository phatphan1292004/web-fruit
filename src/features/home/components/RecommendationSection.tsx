import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchRecommendedProducts, type HomeProduct } from '../servers/products';
import { useCartStore } from '../../cart/store/cart-store';

const formatVND = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

const readCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const RecommendationSection = () => {
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIdx, setStartIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setLoading(true);
      try {
        const userId = readCookie('userId');
        const historyJson = localStorage.getItem('recentlyViewedSlugs');
        const historySlugs: string[] = historyJson ? JSON.parse(historyJson) : [];

        const data = await fetchRecommendedProducts(userId, historySlugs);
        if (isActive) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load recommended products:', err);
        if (isActive) setProducts([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  // Reset page index if visibleCount changes to avoid index overflow
  useEffect(() => {
    setStartIdx(0);
  }, [visibleCount]);

  // Only display the section if we have recommended products
  if (!loading && products.length === 0) {
    return null;
  }

  // Display up to 12 recommended products in the slider
  const sliderProducts = products.slice(0, 12);
  const visibleProducts = sliderProducts.slice(startIdx, startIdx + visibleCount);
  const canPrev = startIdx > 0;
  const canNext = startIdx + visibleCount < sliderProducts.length;

  const handlePrev = () => {
    setStartIdx((prev) => Math.max(0, prev - visibleCount));
  };

  const handleNext = () => {
    setStartIdx((prev) => Math.min(sliderProducts.length - visibleCount, prev + visibleCount));
  };

  return (
    <section className="py-20 bg-emerald-50/30 border-y border-emerald-100/50 relative overflow-hidden" id="recommendations">
      <div className="container mx-auto px-4 md:px-8 relative">
        <div className="flex flex-col items-center mb-10">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2">
            Gợi ý dành riêng cho bạn
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800">
            Có Phải Bạn Đang Tìm?
          </h2>
          <div className="h-1 w-20 bg-primary mt-3 rounded-full"></div>
        </div>

        {/* Slider wrapper without extra padding, matching ProductSection grid exactly */}
        <div className="relative">
          {/* Prev Button - shifted outside container to prevent overlap on larger screens */}
          {canPrev && (
            <button
              onClick={handlePrev}
              className="absolute -left-2 sm:-left-8 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-emerald-100 rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-emerald-50 transition-all duration-300"
              aria-label="Slide truoc"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {loading
              ? Array.from({ length: visibleCount }).map((_, index) => (
                  <div key={index} className="rounded-2xl bg-white h-80 sm:h-105 animate-pulse border border-border/50" />
                ))
              : visibleProducts.map((product) => {
                  const originalPrice = product.originalPrice ?? product.price;
                  const discountPercent = originalPrice > product.price ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;
                  return (
                    <div
                      key={product.id}
                      className="group rounded-3xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] overflow-hidden border border-border/50 text-slate-700 transition-all duration-300 hover:shadow-[0_15px_35px_rgba(15,23,42,0.08)]"
                    >
                      <Link to={`/product/${product.slug}`} className="relative overflow-hidden block">
                        <img
                          src={product.image ?? undefined}
                          alt={product.name}
                          className="h-32 sm:h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex gap-1.5">
                          {product.badge && (
                            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] sm:text-xs font-semibold text-white shadow-md">
                              {product.badge}
                            </span>
                          )}
                          {discountPercent > 0 && (
                            <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] sm:text-xs font-semibold text-foreground shadow-md">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
                        <div>
                          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-600 font-semibold mb-0.5">
                            {product.category}
                          </p>
                          <Link to={`/product/${product.slug}`}>
                            <h3 className="text-xs sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[2rem] sm:min-h-0">
                              {product.name}
                            </h3>
                          </Link>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                          <Star className="text-amber-500 w-3.5 h-3.5 fill-amber-500" />
                          <span className="font-semibold text-foreground">
                            {(product.rating ?? 0).toFixed(1)}
                          </span>
                          <span className="hidden sm:inline">đánh giá</span>
                        </div>

                        <div className="flex items-end gap-2">
                          <span className="text-sm sm:text-xl font-extrabold text-slate-800">
                            {formatVND(product.price)}
                          </span>
                          {discountPercent > 0 && (
                            <span className="text-[10px] sm:text-sm text-foreground/50 line-through">
                              {formatVND(originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-1 sm:pt-2">
                          <Link
                            to={`/product/${product.slug}`}
                            className="flex-1 rounded-full bg-primary text-white py-1.5 sm:py-3 text-[10px] sm:text-sm font-semibold flex items-center justify-center gap-1 hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-lg"
                          >
                            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Chi tiết</span>
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
                            className="w-7 h-7 sm:w-12 sm:h-12 rounded-full border border-border/70 bg-muted/40 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary transition-all duration-300 shrink-0"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>

          {/* Next Button - shifted outside container to prevent overlap on larger screens */}
          {canNext && (
            <button
              onClick={handleNext}
              className="absolute -right-2 sm:-right-8 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-emerald-100 rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-emerald-50 transition-all duration-300"
              aria-label="Slide tiep"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dots pagination */}
        {!loading && sliderProducts.length > visibleCount && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(sliderProducts.length / visibleCount) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStartIdx(i * visibleCount)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  Math.floor(startIdx / visibleCount) === i
                    ? 'bg-primary w-6'
                    : 'bg-emerald-200 w-2 hover:bg-emerald-300'
                }`}
                aria-label={`Slide trang ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendationSection;
