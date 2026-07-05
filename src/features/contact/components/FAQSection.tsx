import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
const faqItems = [
  {
    question: 'Thời gian giao hàng bao lâu?',
    answer: 'Thông thường đơn hàng được xử lý trong ngày và giao trong 2 - 4 giờ tại nội thành, tùy thời điểm đặt hàng và khu vực nhận hàng.',
  },
  {
    question: 'Có hỗ trợ đổi trả không?',
    answer: 'Có. Nếu sản phẩm không đạt chất lượng cam kết, chúng tôi hỗ trợ đổi trả nhanh chóng để đảm bảo trải nghiệm của bạn luôn trọn vẹn.',
  },
  {
    question: 'Trái cây có nhập khẩu chính ngạch không?',
    answer: 'Chúng tôi ưu tiên nguồn hàng rõ ràng, minh bạch xuất xứ và hợp tác với những nhà cung cấp uy tín trong và ngoài nước.',
  },
  {
    question: 'Có giao hàng trong ngày không?',
    answer: 'Có. Với các khu vực hỗ trợ, đơn hàng có thể giao trong ngày nếu được xác nhận trước khung giờ xử lý đơn của chúng tôi.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="px-4 md:px-8 py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Hỏi đáp</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-foreground">Câu hỏi thường gặp</h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const open = openIndex === index;
            return (
              <motion.button
                key={item.question}
                type="button"
                onClick={() => setOpenIndex(open ? -1 : index)}
                whileHover={{ y: -2 }}
                className="w-full rounded-[1.75rem] bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.06)] border border-border/60"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-lg font-semibold text-foreground">{item.question}</span>
                  <FiChevronDown className={`shrink-0 text-primary transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-foreground/70 leading-relaxed">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
