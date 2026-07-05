import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiPlus, FiZap, FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import { Star } from 'lucide-react';
import { useCartStore } from '../../cart/store/cart-store';
import {
  fetchPublicFlashSales,
  type PublicFlashSale,
  type PublicFlashSaleProduct,
} from '../../admin/servers/promotions';

const formatVND = (v: number) => `${v.toLocaleString('vi-VN')}đ`;

function CountdownTimer({ endDate }: { endDate: string }) {
  const calc = () => {
    const diff = Math.max(0, new Date(endDate).getTime() - Date.now());
    return {
      h: Math.floor(diff / 3_600_000),
      m: Math.floor((diff % 3_600_000) / 60_000),
      s: Math.floor((diff % 60_000) / 1_000),
    };
  };

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-1.5">
      <FiClock className="text-red-300 text-sm" />
      {[pad(time.h), pad(time.m), pad(time.s)].map((unit, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-white/20 text-white font-mono font-bold text-sm px-2 py-0.5 rounded-md min-w-[2rem] text-center">
            {unit}
          </span>
          {i < 2 && <span className="text-white/70 font-bold text-sm">:</span>}
        </span>
      ))}
    </div>
  );
}

function FlashSaleCard({ product }: { product: PublicFlashSaleProduct }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group rounded-3xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden border border-border/50 text-slate-700 hover:shadow-[0_16px_40px_rgba(239,68,68,0.12)] transition-all duration-300">
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="relative overflow-hidden block">
        <img
          src={product.image}
          alt={product.name}
          className="h-32 sm:h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex gap-1.5">
          <span className="rounded-full bg-red-500 px-2 py-0.5 text-[9px] sm:text-xs font-bold text-white shadow-md">
            -{product.discountPercent}%
          </span>
          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] sm:text-xs font-bold text-white shadow-md">
            FLASH
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
        <div>
          {product.category && (
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-red-500 font-semibold mb-0.5">
              {product.category}
            </p>
          )}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-xs sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-red-500 transition-colors line-clamp-2 min-h-[2rem] sm:min-h-0">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating placeholder */}
        <div className="flex items-center gap-1.5 text-xs text-foreground/70">
          <Star className="text-amber-500 w-3.5 h-3.5 fill-amber-500" />
          <span className="font-semibold text-foreground">4.8</span>
          <span className="hidden sm:inline">đánh giá</span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2">
          <span className="text-sm sm:text-xl font-extrabold text-red-600">
            {formatVND(product.salePrice)}
          </span>
          <span className="text-xs sm:text-sm text-slate-400 line-through">
            {formatVND(product.originalPrice)}
          </span>
        </div>

        {/* Action buttons — identical layout to ProductSection */}
        <div className="flex items-center gap-2 pt-1 sm:pt-2">
          <Link
            to={`/product/${product.slug}`}
            className="flex-1 rounded-full bg-red-500 text-white py-1.5 sm:py-3 text-[10px] sm:text-sm font-semibold flex items-center justify-center gap-1 hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <FiShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Chi tiết</span>
          </Link>
          <button
            type="button"
            onClick={() =>
              addItem({
                id: parseInt(product.productId) || 0,
                productId: product.productId,
                name: product.name,
                description: product.category ?? '',
                price: product.salePrice,
                image: product.image,
                badge: 'Sale',
              })
            }
            className="w-7 h-7 sm:w-12 sm:h-12 rounded-full border border-border/70 bg-muted/40 flex items-center justify-center text-foreground/70 hover:text-red-500 hover:border-red-500 transition-all duration-300 shrink-0"
          >
            <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const FlashSaleSection = () => {
  const [flashSales, setFlashSales] = useState<PublicFlashSale[]>([]);
  const [activeSale, setActiveSale] = useState(0);
  const [startIdx, setStartIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const visibleCount = 4;

  useEffect(() => {
    fetchPublicFlashSales()
      .then((data) => setFlashSales(data || []))
      .catch(() => setFlashSales([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-red-50/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-3xl bg-white h-80 sm:h-105 animate-pulse border border-red-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (flashSales.length === 0) return null;

  const sale = flashSales[activeSale];
  const products = sale?.products ?? [];
  const visibleProducts = products.slice(startIdx, startIdx + visibleCount);
  const canPrev = startIdx > 0;
  const canNext = startIdx + visibleCount < products.length;

  return (
    <section className="py-16 bg-gradient-to-b from-red-50/40 to-white relative" id="flash-sale">
      <div className="container mx-auto px-4 md:px-8">

        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            {/* Icon block */}
            <div className="bg-red-500 p-2.5 rounded-2xl shadow-lg shadow-red-100">
              <FiZap className="text-white text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Flash Sale
                </h2>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">HOT</span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{sale?.name}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Countdown */}
            <div className="bg-red-500 px-4 py-2 rounded-xl flex items-center gap-2 shadow-md shadow-red-100">
              <span className="text-white text-xs font-semibold whitespace-nowrap">Kết thúc sau:</span>
              <CountdownTimer endDate={sale?.endDate ?? ''} />
            </div>

            {/* Tab switcher for multiple flash sales */}
            {flashSales.length > 1 && (
              <div className="flex gap-2">
                {flashSales.map((fs, i) => (
                  <button
                    key={fs._id}
                    onClick={() => { setActiveSale(i); setStartIdx(0); }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                      i === activeSale
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-red-300'
                    }`}
                  >
                    {fs.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Product Grid with Nav ─── */}
        <div className="relative">
          {canPrev && (
            <button
              onClick={() => setStartIdx(i => Math.max(0, i - visibleCount))}
              className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-red-200 rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-all"
            >
              <FiChevronLeft className="text-xl" />
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={startIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8"
            >
              {visibleProducts.map((product) => (
                <FlashSaleCard key={product.productId} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>

          {canNext && (
            <button
              onClick={() => setStartIdx(i => Math.min(products.length - visibleCount, i + visibleCount))}
              className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-red-200 rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-all"
            >
              <FiChevronRight className="text-xl" />
            </button>
          )}
        </div>

        {/* ─── Dots pagination ─── */}
        {products.length > visibleCount && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(products.length / visibleCount) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStartIdx(i * visibleCount)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  Math.floor(startIdx / visibleCount) === i
                    ? 'bg-red-500 w-6'
                    : 'bg-red-200 w-2 hover:bg-red-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FlashSaleSection;
