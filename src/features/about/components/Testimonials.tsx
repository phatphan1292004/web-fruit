import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
const reviewItems = [
  {
    name: 'Nguyễn Thanh Hà',
    avatar: 'https://i.pravatar.cc/160?img=48',
    rating: 5,
    content: 'Tôi cảm nhận rõ sự chỉn chu trong từng hộp trái cây. Từ chất lượng đến cách đóng gói đều rất đẹp và đáng tin cậy.',
  },
  {
    name: 'Lê Hoàng Nam',
    avatar: 'https://i.pravatar.cc/160?img=12',
    rating: 5,
    content: 'Điều tôi thích nhất là vị trái cây tươi tự nhiên và cách thương hiệu kể câu chuyện rất chân thật, không phô trương.',
  },
];

const Testimonials = () => {
  return (
    <section className="px-4 md:px-8 py-20">
      <div className="container mx-auto">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-3">Customer Voices</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">Khách hàng nói gì về chúng tôi?</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reviewItems.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
              className="rounded-[2.2rem] bg-white/80 backdrop-blur-md p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)] border border-white/60"
            >
              <div className="flex items-center gap-4 mb-5">
                <img src={review.avatar} alt={review.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md" />
                <div>
                  <h3 className="text-lg font-bold text-foreground">{review.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-amber-500">
                    {Array.from({ length: review.rating }).map((_, starIndex) => <FiStar key={starIndex} />)}
                  </div>
                </div>
              </div>
              <p className="text-foreground/70 leading-relaxed italic">“{review.content}”</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
