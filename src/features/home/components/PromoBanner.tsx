import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTruck, FiPercent, FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { fetchPublicVouchers, type PublicVoucherPromo } from '../../admin/servers/promotions';

const bgImages = [
  '/images/promo_fruits.png',
  '/images/promo_citrus.png',
  '/images/promo_berries.png',
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const PromoBanner = () => {
  const [vouchers, setVouchers] = useState<PublicVoucherPromo[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicVouchers()
      .then((data) => {
        setVouchers(data || []);
      })
      .catch(() => setVouchers([]))
      .finally(() => setLoading(false));
  }, []);

  // Auto play rotation every 6 seconds
  useEffect(() => {
    const slideCount = vouchers.length > 0 ? vouchers.length : 2; // fallback slides count is 2
    if (slideCount <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 6000);
    return () => clearInterval(timer);
  }, [vouchers.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const slideCount = vouchers.length > 0 ? vouchers.length : 2;
    if (slideCount <= 1) return;
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const slideCount = vouchers.length > 0 ? vouchers.length : 2;
    if (slideCount <= 1) return;
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  if (loading) {
    return (
      <section className="py-6 relative overflow-hidden bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="h-64 sm:h-72 md:h-80 w-full bg-slate-100 rounded-[2.5rem] animate-pulse" />
        </div>
      </section>
    );
  }

  // Fallback banners if no active database vouchers
  const fallbackSlides = [
    {
      _id: 'default_ship',
      name: 'Siêu Ưu Đãi Vận Chuyển Toàn Quốc',
      description: 'Nhận ngay mã miễn phí vận chuyển lên tới 15.000đ cho tất cả đơn hàng hữu cơ từ 0đ tại cửa hàng.',
      isShipping: true,
      badgeText: 'Freeship Vận Chuyển',
      icon: <FiTruck className="w-4 h-4 text-sky-400" />,
    },
    {
      _id: 'default_discount',
      name: 'Quà Tặng Thành Viên Mới Đăng Ký',
      description: 'Nhận ngay mã voucher giảm trực tiếp 10% giá trị hóa đơn khi đăng ký tài khoản mua sắm mới hôm nay.',
      isShipping: false,
      badgeText: 'Ưu Đãi Đăng Ký Mới',
      icon: <FiPercent className="w-4 h-4 text-emerald-400" />,
    }
  ];

  const activeSlides = vouchers.length > 0 ? vouchers : fallbackSlides;
  const activeVoucher = activeSlides[currentSlide % activeSlides.length];
  
  const isShipping = activeVoucher.name.toLowerCase().includes('ship') || 
                      activeVoucher.name.toLowerCase().includes('vận chuyển') ||
                      ('description' in activeVoucher && (activeVoucher.description?.toLowerCase().includes('ship') || activeVoucher.description?.toLowerCase().includes('vận chuyển')));

  const theme = isShipping
    ? {
        icon: <FiTruck className="w-4 h-4 text-sky-300" />,
        badgeText: 'Freeship Vận Chuyển',
      }
    : {
        icon: <FiPercent className="w-4 h-4 text-emerald-300" />,
        badgeText: 'Ưu Đãi Đặc Biệt',
      };

  return (
    <section className="py-6 relative overflow-hidden bg-background" id="vouchers">
      <div className="container mx-auto px-4 md:px-8 relative">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-emerald-950 shadow-2xl h-64 sm:h-72 md:h-80">
          
          {/* Background image & gradient blend */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-35 pointer-events-none transition-all duration-700"
            style={{ backgroundImage: `url('${bgImages[currentSlide % bgImages.length]}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-emerald-900/90 to-teal-950/95 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/30 via-transparent to-white/10 pointer-events-none" />

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="absolute inset-0 z-10"
            >
              {/* Clickable slide content */}
              <Link to="/promotions" className="flex flex-col justify-center h-full w-full p-8 sm:p-12 md:p-14 text-white group/slide">
                <div className="flex flex-col items-start gap-3 md:gap-4 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-white/10 backdrop-blur-md border border-white/20 text-amber-300">
                    {theme.icon}
                    {theme.badgeText}
                  </div>
                  
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight group-hover/slide:text-amber-300 transition-colors duration-300">
                    {activeVoucher.name}
                  </h2>
                  
                  <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 font-medium">
                    {('description' in activeVoucher ? activeVoucher.description : '') || 'Chương trình khuyến mãi đặc quyền dành cho khách hàng. Click ngay để xem chi tiết mã ưu đãi!'}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2 text-white font-bold bg-white/10 group-hover/slide:bg-white group-hover/slide:text-primary transition-all duration-300 border border-white/20 px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-md">
                    Khám phá voucher ngay
                    <FiArrowRight className="w-4 h-4 group-hover/slide:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Slider Left Arrow */}
          {activeSlides.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-105 active:scale-95 transition-all z-20"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Slider Right Arrow */}
          {activeSlides.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-105 active:scale-95 transition-all z-20"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Navigation dots */}
          {activeSlides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-amber-300 w-5' : 'bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
