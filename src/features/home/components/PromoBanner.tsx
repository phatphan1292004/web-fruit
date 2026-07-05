import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap, FiGift, FiTruck, FiPercent } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { fetchPublicVouchers } from '../../admin/servers/promotions';

const PromoBanner = () => {
  const [promoCount, setPromoCount] = useState(0);

  const readCookie = (name: string) => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  };

  useEffect(() => {
    const firebaseUid = readCookie('userId') ?? undefined;
    fetchPublicVouchers(firebaseUid)
      .then((data) => {
        if (data) setPromoCount(data.length);
      })
      .catch(() => setPromoCount(0));
  }, []);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50" id="vouchers">
      <div className="container mx-auto px-4 md:px-8">
        <Link to="/promotions" className="block group">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-primary via-emerald-600 to-teal-700 shadow-2xl transition-all duration-500 group-hover:shadow-[0_30px_60px_rgba(16,185,129,0.25)] group-hover:-translate-y-1 cursor-pointer border border-white/10"
          >
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
            
            {/* Main content grid */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 md:p-16 lg:p-20">
              
              {/* Left Column: Info & Action */}
              <div className="lg:col-span-7 flex flex-col items-start gap-5 sm:gap-7">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white shadow-sm">
                  <FiZap className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span className="font-semibold text-xs md:text-sm tracking-wider uppercase">
                    Cổng Ưu Đãi Thành Viên
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                  Săn Voucher Ngay <br />
                  <span className="text-amber-300">Mua Sắm Tiết Kiệm Hơn!</span>
                </h2>

                <p className="text-white/80 text-sm md:text-lg max-w-xl leading-relaxed">
                  Thu thập ngay hàng loạt mã giảm giá phí vận chuyển (Freeship) toàn quốc và các voucher ưu đãi chiết khấu trực tiếp trên đơn hàng của bạn. Click ngay để khám phá ví voucher ưu tú dành riêng cho hôm nay.
                </p>

                {promoCount > 0 && (
                  <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white/90 text-xs font-bold tracking-wide">
                    🔥 Hiện đang có <span className="text-amber-300 text-sm font-extrabold">{promoCount}</span> chương trình khuyến mãi hoạt động!
                  </div>
                )}

                <div className="flex items-center gap-2 text-white font-bold bg-white/20 backdrop-blur-md px-6 py-3.5 sm:px-8 sm:py-4 rounded-full text-sm sm:text-base border border-white/20 shadow-md group-hover:bg-white group-hover:text-primary transition-all duration-300 mt-2">
                  Nhận mã giảm giá ngay
                  <FiArrowRight className="w-4 h-4 sm:w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>

              {/* Right Column: Teaser / Floating Voucher Cards */}
              <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full flex justify-center items-center mt-6 lg:mt-0">
                <div className="relative w-full max-w-sm h-full flex justify-center items-center">
                  
                  {/* Floating Mock Card 1: Freeship */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="absolute z-20 -left-4 top-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3.5 w-60 rotate-[-4deg] transition-all group-hover:scale-105"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FiTruck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">FREESHIP</p>
                      <p className="text-sm font-extrabold text-slate-800">Miễn phí vận chuyển</p>
                      <p className="text-[10px] text-slate-400 font-medium">Đơn hàng từ 0đ</p>
                    </div>
                  </motion.div>

                  {/* Floating Mock Card 2: Discount */}
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute z-10 -right-4 bottom-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3.5 w-60 rotate-[6deg] transition-all group-hover:scale-105"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FiPercent className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">MÃ GIẢM GIÁ</p>
                      <p className="text-sm font-extrabold text-slate-800">Giảm thêm 10%</p>
                      <p className="text-[10px] text-slate-400 font-medium">Áp dụng toàn bộ menu</p>
                    </div>
                  </motion.div>

                  {/* Decorative background gift box icon */}
                  <div className="w-48 h-48 rounded-full bg-white/10 blur-xl flex items-center justify-center text-white/15">
                    <FiGift className="w-24 h-24 stroke-[1]" />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
};

export default PromoBanner;
