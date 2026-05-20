import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="relative min-h-[78vh] overflow-hidden rounded-[3rem] bg-[url('https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center shadow-[0_20px_60px_rgba(16,185,129,0.18)]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/15" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-10 flex h-full min-h-[78vh] flex-col justify-center px-6 py-16 md:px-14 lg:px-20 text-white max-w-4xl"
          >
            <p className="mb-5 inline-flex w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md border border-white/15">
              Thương hiệu trái cây sạch, tươi mới và đáng tin cậy
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Mang Sự Tươi Mát Từ Thiên Nhiên Đến Mỗi Gia Đình
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed">
              Chúng tôi bắt đầu từ một niềm tin rất giản dị: trái cây ngon không chỉ nằm ở vị ngọt, mà còn ở sự an tâm khi bạn đặt chúng lên bàn ăn của người thân. Từ những khu vườn được chọn lọc kỹ lưỡng, đến từng hộp trái cây được đóng gói cẩn thận, mọi chi tiết đều hướng đến một trải nghiệm tươi mới, tinh tế và trọn vẹn hơn mỗi ngày.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300">
                Khám phá sản phẩm
                <FiArrowRight />
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-all duration-300">
                <FiPlay />
                Xem combo nổi bật
              </button>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="absolute right-6 top-16 hidden xl:block w-40 h-40 rounded-full bg-white/10 backdrop-blur-md border border-white/15 overflow-hidden shadow-2xl"
          >
            <img src="https://images.unsplash.com/photo-1560806887-1e4cd0b6fd6c?q=80&w=700&auto=format&fit=crop" alt="Trái cây" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
