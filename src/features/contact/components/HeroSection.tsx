import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="px-4 md:px-8 pt-28 pb-12">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[3rem] min-h-[420px] bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/15" />
          <div className="relative z-10 h-full min-h-[420px] flex flex-col justify-end p-8 md:p-14 text-white">
            <div className="mb-4 text-sm text-white/80 flex items-center gap-2">
              <a href="/" className="hover:text-white">Home</a>
              <span>/</span>
              <span className="text-primary-foreground font-semibold">Liên hệ</span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight"
            >
              Liên Hệ Với Chúng Tôi
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 max-w-2xl text-base md:text-lg text-white/88 leading-relaxed"
            >
              Mỗi phản hồi của bạn đều là động lực để chúng tôi mang đến những sản phẩm tươi ngon và dịch vụ tốt hơn mỗi ngày.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a href="#contact-form" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white shadow-md hover:shadow-lg hover:bg-primary/90 transition-all duration-300">
                Gửi liên hệ ngay
                <FiArrowRight />
              </a>
              <a href="#faq" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-all duration-300">
                Xem câu hỏi thường gặp
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
