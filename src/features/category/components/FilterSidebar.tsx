import { useEffect, useState } from 'react';
import { FiFilter, FiStar } from 'react-icons/fi';
import type { FruitCategory } from './types';
import { fruitCategoryOptions, getFruitCategorySlug } from './constants';

const pricePresets = [
  { label: 'Dưới 100k', min: 0, max: 100000 },
  { label: '100k - 300k', min: 100000, max: 300000 },
  { label: '300k - 500k', min: 300000, max: 500000 },
  { label: 'Trên 500k', min: 500000, max: undefined },
];

type FilterSidebarProps = {
  minPrice: number | '';
  maxPrice: number | '';
  selectedRating: number;
  selectedCategorySlug?: string;
  onApplyPriceRange: (min: number | '', max: number | '') => void;
  onNavigateCategory: (category: FruitCategory) => void;
  onSelectRating: (rating: number) => void;
  onReset: () => void;
};

const FilterSidebar = ({
  minPrice,
  maxPrice,
  selectedRating,
  selectedCategorySlug,
  onApplyPriceRange,
  onNavigateCategory,
  onSelectRating,
  onReset,
}: FilterSidebarProps) => {
  const [minVal, setMinVal] = useState<string>('');
  const [maxVal, setMaxVal] = useState<string>('');

  useEffect(() => {
    setMinVal(minPrice === '' || minPrice === 0 ? '' : String(minPrice));
    setMaxVal(maxPrice === '' ? '' : String(maxPrice));
  }, [minPrice, maxPrice]);

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const min = minVal === '' ? '' : Math.max(0, Number(minVal));
    const max = maxVal === '' ? '' : Math.max(0, Number(maxVal));
    
    // Simple validation: swap if min > max and both are not empty
    if (min !== '' && max !== '' && min > max) {
      onApplyPriceRange(max, min);
      setMinVal(String(max));
      setMaxVal(String(min));
    } else {
      onApplyPriceRange(min, max);
    }
  };

  const handlePresetClick = (min: number, max: number | undefined) => {
    onApplyPriceRange(min || '', max || '');
  };

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
          {/* 1. Loại trái cây (Category) - Top */}
          <div>
            <h4 className="text-base font-bold text-foreground mb-3">Loại trái cây</h4>
            <div className="space-y-2">
              {fruitCategoryOptions.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => onNavigateCategory(category)}
                  className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-[15px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${selectedCategorySlug === getFruitCategorySlug(category) ? 'border-primary bg-primary/10 shadow-md' : 'border-border/60 bg-white'}`}
                >
                  <span className="font-medium text-foreground/85">
                    {category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Khoảng giá (Price Range) - Middle */}
          <div>
            <h4 className="text-base font-bold text-foreground mb-3">Khoảng giá (VND)</h4>
            <form onSubmit={handleApply} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={minVal}
                    onChange={(e) => setMinVal(e.target.value)}
                    className="w-full rounded-2xl border border-border/60 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-primary transition-all duration-350"
                  />
                </div>
                <span className="text-foreground/40">—</span>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Đến"
                    value={maxVal}
                    onChange={(e) => setMaxVal(e.target.value)}
                    className="w-full rounded-2xl border border-border/60 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-primary transition-all duration-350"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-primary text-white py-2.5 font-bold hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Áp dụng
              </button>
            </form>

            {/* Price Presets */}
            <div className="flex flex-wrap gap-2 mt-3">
              {pricePresets.map((preset) => {
                const isActive =
                  ((preset.min === 0 && (minPrice === '' || minPrice === 0)) || preset.min === minPrice) &&
                  ((preset.max === undefined && maxPrice === '') || preset.max === maxPrice);
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePresetClick(preset.min, preset.max)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all duration-300 ${
                      isActive
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-border/60 bg-white text-foreground/75 hover:border-primary/50'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Đánh giá sao (Rating) - Bottom */}
          <div>
            <h4 className="text-base font-bold text-foreground mb-3">Đánh giá sao</h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onSelectRating(0)}
                className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-[15px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${selectedRating === 0 ? 'border-primary bg-primary text-white shadow-lg' : 'border-border/60 bg-white text-foreground'}`}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <FiStar className={selectedRating === 0 ? 'text-white' : 'text-amber-500'} />
                  Nổi bật
                </span>
                <span className={`text-sm ${selectedRating === 0 ? 'text-white/90' : 'text-primary'}`}>
                  {selectedRating === 0 ? 'Đang chọn' : 'Bấm để lọc'}
                </span>
              </button>

              {[5, 4, 3].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onSelectRating(rating)}
                  className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-[15px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${selectedRating === rating ? 'border-primary bg-primary/10 shadow-md' : 'border-border/60 bg-white'}`}
                >
                  <span className="flex items-center gap-2 font-medium text-foreground/85">
                    <FiStar className="text-amber-500" />
                    Từ {rating} sao trở lên
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset button */}
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
