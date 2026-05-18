import { FiFilter, FiStar } from 'react-icons/fi';
import type { PriceRange, FruitCategory } from './types';

const priceOptions: { id: PriceRange; label: string }[] = [
  { id: 'all', label: 'Tất cả giá' },
  { id: 'under-100', label: 'Dưới 100k' },
  { id: '100-300', label: '100k - 300k' },
  { id: '300-500', label: '300k - 500k' },
  { id: 'over-500', label: 'Trên 500k' },
];

const categoryOptions: FruitCategory[] = ['Trong nước', 'Nhập khẩu', 'Giỏ quà', 'Hữu cơ', 'Theo mùa'];

type FilterSidebarProps = {
  selectedPrices: PriceRange[];
  selectedCategories: FruitCategory[];
  selectedRating: number;
  onTogglePrice: (price: PriceRange) => void;
  onToggleCategory: (category: FruitCategory) => void;
  onSelectRating: (rating: number) => void;
  onReset: () => void;
};

const FilterSidebar = ({
  selectedPrices,
  selectedCategories,
  selectedRating,
  onTogglePrice,
  onToggleCategory,
  onSelectRating,
  onReset,
}: FilterSidebarProps) => {
  return (
    <aside className="lg:w-80 shrink-0">
      <div className="glass rounded-[2rem] p-6 sticky top-28 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <FiFilter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Bộ lọc</h3>
              <p className="text-sm text-foreground/60">Lọc sản phẩm theo nhu cầu</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-base font-bold text-foreground mb-3">Filter giá</h4>
            <div className="space-y-2">
              {priceOptions.map((option) => (
                <label key={option.id} className="flex items-center gap-3 cursor-pointer group text-[15px]">
                  <input
                    type="checkbox"
                    checked={selectedPrices.includes(option.id)}
                    onChange={() => onTogglePrice(option.id)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="font-medium text-foreground/85 group-hover:text-foreground transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-foreground mb-3">Loại trái cây</h4>
            <div className="space-y-2">
              {categoryOptions.map((category) => (
                <label key={category} className="flex items-center gap-3 cursor-pointer group text-[15px]">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => onToggleCategory(category)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="font-medium text-foreground/85 group-hover:text-foreground transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-foreground mb-3">Đánh giá sao</h4>
            <div className="space-y-2">
              <div className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-[15px] transition-all duration-300 ${selectedRating === 0 ? 'border-primary bg-primary text-white shadow-lg' : 'border-border/60 bg-white text-foreground'}`}>
                <span className="flex items-center gap-2 font-semibold">
                  <FiStar className={selectedRating === 0 ? 'text-white' : 'text-amber-500'} />
                  Nổi bật
                </span>
                <span className={`text-sm ${selectedRating === 0 ? 'text-white/90' : 'text-primary'}`}>
                  {selectedRating === 0 ? 'Đang chọn' : 'Bấm để lọc'}
                </span>
              </div>

              {[5, 4, 3].map((rating) => (
                <label
                  key={rating}
                  className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-[15px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${selectedRating === rating ? 'border-primary bg-primary/10 shadow-md' : 'border-border/60 bg-white'}`}
                >
                  <span className="flex items-center gap-2 font-medium text-foreground/85">
                    <FiStar className="text-amber-500" />
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === rating}
                      onChange={() => onSelectRating(rating)}
                      className="sr-only"
                    />
                    Từ {rating} sao trở lên
                  </span>
                  <span className="text-primary font-semibold">Chọn</span>
                </label>
              ))}

              <label
                className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-[15px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${selectedRating === 0 ? 'border-primary bg-primary/10 shadow-md' : 'border-border/60 bg-white'}`}
              >
                <span className="flex items-center gap-2 font-medium text-foreground/85">
                  <FiStar className="text-amber-500" />
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === 0}
                    onChange={() => onSelectRating(0)}
                    className="sr-only"
                  />
                  Tất cả đánh giá
                </span>
                <span className="text-primary font-semibold">Chọn</span>
              </label>
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full rounded-full border border-primary/20 bg-primary/5 text-primary py-3 font-semibold hover:bg-primary hover:text-white transition-all duration-300"
          >
            Reset filter
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
