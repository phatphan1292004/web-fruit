import { useEffect, useMemo, useState, startTransition } from 'react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import FilterSidebar from './FilterSidebar';
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import { categoryMap, fruitProducts } from './constants';
import type { FruitCategory, PriceRange, SortOption, FruitProduct } from './types';
import { fetchCategoryProducts, fetchProductsByCategory } from '../servers/products';
import { getFruitCategorySlug } from './constants';

const getPriceMatch = (price: number, range: PriceRange) => {
  if (range === 'all') return true;
  if (range === 'under-100') return price < 100000;
  if (range === '100-300') return price >= 100000 && price <= 300000;
  if (range === '300-500') return price > 300000 && price <= 500000;
  return price > 500000;
};

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
  const [selectedPrices, setSelectedPrices] = useState<PriceRange[]>(['all']);
  const [selectedCategories, setSelectedCategories] = useState<FruitCategory[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sort, setSort] = useState<SortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [featuredHover, setFeaturedHover] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [products, setProducts] = useState<FruitProduct[]>(fruitProducts);
  const [isSwitchingCategory, setIsSwitchingCategory] = useState(false);
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

    if (!selectedPrices.includes('all')) {
      result = result.filter((product) => selectedPrices.some((range) => getPriceMatch(product.price, range)));
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
  }, [selectedPrices, selectedCategories, selectedRating, sort, featuredHover, products]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize), [filteredProducts, safePage]);

  const togglePrice = (price: PriceRange) => {
    setCurrentPage(1);
    setSelectedPrices((prev) => {
      if (price === 'all') return ['all'];
      const next = prev.filter((item) => item !== 'all');
      return next.includes(price) ? next.filter((item) => item !== price) : [...next, price];
    });
  };

  const toggleCategory = (category: FruitCategory) => {
    setCurrentPage(1);
    navigate(`/category/${getFruitCategorySlug(category)}`, { replace: true });
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setSelectedPrices(['all']);
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
          <FilterSidebar selectedPrices={selectedPrices} selectedRating={selectedRating} selectedCategorySlug={categorySlug} onTogglePrice={togglePrice} onNavigateCategory={toggleCategory} onSelectRating={setSelectedRating} onReset={resetFilters} />
          <div className="space-y-6">
            <div className="glass rounded-4xl p-4 md:p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                <div className="relative" onMouseEnter={() => setSortMenuOpen(true)} onMouseLeave={() => setSortMenuOpen(false)}>
                  <button type="button" className="flex items-center gap-3 rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-foreground outline-none shadow-sm hover:shadow-md transition-all duration-300">
                    {sortOptions.find((item) => item.id === sort)?.label}
                    <FiChevronDown className="text-foreground/40" />
                  </button>
                  {sortMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-white shadow-xl z-30">
                      {sortOptions.map((option) => (
                        <button key={option.id} type="button" onClick={() => { setSort(option.id); setSortMenuOpen(false); }} className={`w-full px-4 py-3 text-left text-sm transition-colors ${sort === option.id ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white text-foreground'}`}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={isSwitchingCategory ? 'opacity-70 transition-opacity duration-200' : 'opacity-100 transition-opacity duration-200'}>
              <ProductGrid products={paginatedProducts} />
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPrev={() => setCurrentPage((prev) => Math.max(1, prev - 1))} onNext={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
