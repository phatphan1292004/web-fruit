import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const CTASection = () => {
  return (
    <section className="px-4 md:px-8 py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-300 px-6 py-14 md:px-12 md:py-16 text-white shadow-[0_20px_60px_rgba(16,185,129,0.25)]"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Bắt Đầu Hành Trình Sống Xanh Cùng Chúng Tôi
              </h2>
              <p className="mt-4 text-white/90 leading-relaxed text-base md:text-lg">
                Nếu bạn đang tìm một thương hiệu trái cây vừa đẹp mắt, vừa an tâm về chất lượng, Morning Fruit luôn sẵn sàng đồng hành. Mỗi đơn hàng không chỉ là một lần mua sắm — mà là một lời mời bước gần hơn tới lối sống lành mạnh, tươi mới và dễ chịu hơn.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="/category" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-primary shadow-md hover:shadow-lg transition-all duration-300">
                Mua sắm ngay
                <FiArrowRight />
              </a>
              <a href="/category" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-all duration-300">
                Xem sản phẩm nổi bật
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
