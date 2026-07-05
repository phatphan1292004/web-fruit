import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Plus } from 'lucide-react';
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

  const visibleProducts = useMemo(() => products.slice(0, 8), [products]);

  return (
    <section className="py-24 bg-muted/10 relative" id="fruits">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center mb-14">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-3">
            Trái cây tươi ngon & cao cấp
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
            Sản Phẩm Nổi Bật
          </h2>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-1 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-border/50">
            {categoryTabs.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={cn(
                  'px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
                  activeCategory === category.key
                    ? 'bg-primary text-white shadow-md'
                    : 'text-foreground/70 hover:bg-white hover:text-foreground'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="rounded-2xl bg-white h-80 sm:h-105 animate-pulse" />
                ))
              : visibleProducts.map((product) => {
                  const discount = product.badge ? 'Hot' : 'New';
                  return (
                    <div
                      key={product.id}
                      className="group rounded-3xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden border border-border/50 text-slate-700"
                    >
                      <Link to={`/product/${product.slug}`} className="relative overflow-hidden block">
                        <img
                          src={product.image ?? undefined}
                          alt={product.name}
                          className="h-32 sm:h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex gap-1.5">
                          {product.badge && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] sm:text-xs font-semibold text-white shadow-md">
                              {product.badge}
                            </span>
                          )}
                          <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] sm:text-xs font-semibold text-foreground shadow-md">
                            {discount}
                          </span>
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
                          <Star className="text-amber-500 w-3.5 h-3.5" />
                          <span className="font-semibold text-foreground">
                            {(product.rating ?? 0).toFixed(1)}
                          </span>
                          <span className="hidden sm:inline">đánh giá</span>
                        </div>

                        <div className="flex items-end gap-3">
                          <span className="text-sm sm:text-xl font-extrabold text-slate-800">
                            {formatVND(product.price)}
                          </span>
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
        </div>

        <div className="mt-16 text-center">
          <Link to={activeCategory === 'all' ? '/category' : `/category/${activeCategory}`} className="inline-flex items-center justify-center border-2 border-primary text-primary px-10 py-3.5 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-300">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
