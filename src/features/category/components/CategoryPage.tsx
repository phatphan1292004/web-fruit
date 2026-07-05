import { useEffect, useMemo, useState, startTransition } from 'react';
import { FiChevronDown, FiSearch, FiFilter } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../../components/layout/Header';
import FilterSidebar from './FilterSidebar';
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import { categoryMap, fruitProducts } from './constants';
import type { FruitCategory, SortOption, FruitProduct } from './types';
import { fetchCategoryProducts, fetchProductsByCategory } from '../servers/products';
import { getFruitCategorySlug } from './constants';


const sortProducts = (products: FruitProduct[], sort: SortOption) => {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'bestseller':
      return sorted.sort((a, b) => b.bestseller - a.bestseller);
    case 'newest':
      return sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    default:
      return sorted;
  }
};

const sortOptions: { id: SortOption; label: string }[] = [
  { id: 'featured', label: 'Nổi bật' },
  { id: 'price-asc', label: 'Giá tăng dần' },
  { id: 'price-desc', label: 'Giá giảm dần' },
  { id: 'bestseller', label: 'Bán chạy' },
  { id: 'newest', label: 'Mới nhất' },
];

const normalizeText = (value: string | undefined) =>
  (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const CategoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categorySlug } = useParams();
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedCategories, setSelectedCategories] = useState<FruitCategory[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sort, setSort] = useState<SortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [featuredHover, setFeaturedHover] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [products, setProducts] = useState<FruitProduct[]>([]);
  const [isSwitchingCategory, setIsSwitchingCategory] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const searchQuery = new URLSearchParams(location.search).get('search')?.trim() ?? '';

  const pageSize = 8;
  const activeCategoryName = categorySlug ? categoryMap[categorySlug as keyof typeof categoryMap] : '';

  useEffect(() => {
    const load = async () => {
      setIsSwitchingCategory(true);
      try {
        const searchTerm = searchQuery || undefined;
        if (categorySlug) {
          setProducts(await fetchProductsByCategory(categorySlug, searchTerm));
        } else {
          setProducts(await fetchCategoryProducts({ search: searchTerm }));
        }
      } catch {
        if (categorySlug && activeCategoryName) {
          setProducts(fruitProducts.filter((item) => normalizeText(item.category) === normalizeText(activeCategoryName)));
        } else {
          setProducts(fruitProducts);
        }
      } finally {
        startTransition(() => setIsSwitchingCategory(false));
      }
    };
    load();
  }, [categorySlug, activeCategoryName, searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (minPrice !== '') {
      result = result.filter((product) => product.price >= minPrice);
    }
    if (maxPrice !== '') {
      result = result.filter((product) => product.price <= maxPrice);
    }

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.some((category) => normalizeText(product.category) === normalizeText(category) || normalizeText(product.category).includes(normalizeText(category)))
      );
    }

    if (selectedRating > 0) {
      result = result.filter((product) => product.rating >= selectedRating);
    }

    if (featuredHover) {
      result = result.filter((product) => product.label === 'Hot');
    }

    return sortProducts(result, sort);
  }, [minPrice, maxPrice, selectedCategories, selectedRating, sort, featuredHover, products]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize), [filteredProducts, safePage]);

  const handleApplyPriceRange = (min: number | '', max: number | '') => {
    setCurrentPage(1);
    setMinPrice(min);
    setMaxPrice(max);
  };

  const toggleCategory = (category: FruitCategory) => {
    setCurrentPage(1);
    navigate(`/category/${getFruitCategorySlug(category)}`, { replace: true });
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategories([]);
    setSelectedRating(0);
    setSort('featured');
    setFeaturedHover(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-orange-50">
      <Header />
      <section className="pt-28 pb-12 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] min-h-70 bg-[url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center shadow-[0_20px_60px_rgba(16,185,129,0.15)]">
            <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/30 to-black/10" />
            <div className="relative z-10 p-8 md:p-14 flex flex-col justify-end h-full min-h-70 text-white">
              <div className="flex items-center gap-2 text-sm text-white/85 mb-4">
                <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                <span>/</span>
                <span className="text-primary-foreground font-semibold">{activeCategoryName || 'Danh mục trái cây'}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl">{activeCategoryName || 'Danh Mục Trái Cây'}</h1>
              <p className="mt-4 max-w-2xl text-white/85 text-base md:text-lg">
                {activeCategoryName
                  ? `Đang hiển thị các sản phẩm thuộc danh mục ${activeCategoryName.toLowerCase()}.`
                  : 'Khám phá bộ sưu tập trái cây premium tươi ngon, chọn lọc kỹ lưỡng với trải nghiệm mua sắm hiện đại và tiện lợi.'}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="pb-16 px-4 md:px-8">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar minPrice={minPrice} maxPrice={maxPrice} selectedRating={selectedRating} selectedCategorySlug={categorySlug} onApplyPriceRange={handleApplyPriceRange} onNavigateCategory={toggleCategory} onSelectRating={setSelectedRating} onReset={resetFilters} />
          </div>

          {/* Mobile Filter Sidebar Drawer */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <>
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="fixed inset-0 bg-black z-[990] lg:hidden"
                />
                {/* Drawer Panel */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[999] shadow-2xl p-6 overflow-y-auto lg:hidden text-slate-700"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <span className="text-lg font-bold text-slate-800">Bộ lọc</span>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <FilterSidebar
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    selectedRating={selectedRating}
                    selectedCategorySlug={categorySlug}
                    onApplyPriceRange={(min, max) => { handleApplyPriceRange(min, max); setIsMobileFilterOpen(false); }}
                    onNavigateCategory={(cat) => { toggleCategory(cat); setIsMobileFilterOpen(false); }}
                    onSelectRating={(rat) => { setSelectedRating(rat); setIsMobileFilterOpen(false); }}
                    onReset={() => { resetFilters(); setIsMobileFilterOpen(false); }}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <div className="glass relative z-30 rounded-4xl p-4 md:p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-foreground/60">Tìm thấy {filteredProducts.length} sản phẩm</p>
                <h2 className="text-2xl font-bold text-foreground">Sản phẩm nổi bật</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-3 rounded-full border border-border bg-white px-4 py-3 flex-1 sm:min-w-80">
                  <FiSearch className="text-foreground/40" />
                  <input
                    value={searchQuery}
                    onChange={(e) => navigate(e.target.value.trim() ? `/category?search=${encodeURIComponent(e.target.value)}` : '/category', { replace: true })}
                    placeholder="Tìm trái cây, combo, giỏ quà..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-slate-700 outline-none shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <FiFilter className="text-slate-500" />
                  <span>Bộ lọc</span>
                </button>
                <div className="relative z-20" onMouseEnter={() => setSortMenuOpen(true)} onMouseLeave={() => setSortMenuOpen(false)}>
                  <button type="button" className="flex items-center gap-3 rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-foreground outline-none shadow-sm hover:shadow-md transition-all duration-300">
                    {sortOptions.find((item) => item.id === sort)?.label}
                    <FiChevronDown className="text-foreground/40" />
                  </button>
                  {sortMenuOpen && (
                    <div className="absolute right-0 top-full pt-2 w-56 z-50">
                      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
                        {sortOptions.map((option) => (
                          <button key={option.id} type="button" onClick={() => { setSort(option.id); setSortMenuOpen(false); }} className={`w-full px-4 py-3 text-left text-sm transition-colors ${sort === option.id ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white text-foreground'}`}>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isSwitchingCategory ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="rounded-3xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden border border-border/50 p-3 sm:p-5 space-y-4 animate-pulse">
                    <div className="bg-slate-200/60 h-32 sm:h-56 w-full rounded-2xl" />
                    <div className="space-y-2">
                      <div className="bg-slate-200/60 h-3 w-16 rounded" />
                      <div className="bg-slate-200/60 h-5 w-full rounded" />
                      <div className="bg-slate-200/60 h-5 w-2/3 rounded" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="bg-slate-200/60 h-4 w-4 rounded-full" />
                      <div className="bg-slate-200/60 h-3 w-20 rounded" />
                    </div>
                    <div className="bg-slate-200/60 h-6 w-24 rounded" />
                    <div className="flex gap-2 pt-1 sm:pt-2">
                      <div className="bg-slate-200/60 h-8 sm:h-12 flex-1 rounded-full" />
                      <div className="bg-slate-200/60 h-8 sm:h-12 w-8 sm:w-12 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid products={paginatedProducts} />
            )}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPrev={() => setCurrentPage((prev) => Math.max(1, prev - 1))} onNext={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
