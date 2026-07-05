import { motion } from 'framer-motion';
import { FiHeart, FiShield, FiTruck } from 'react-icons/fi';

const timeline = [
  { year: '2020', text: 'Khởi đầu từ mong muốn mang thực phẩm sạch, tươi và an toàn đến gần hơn với mọi gia đình.' },
  { year: '2022', text: 'Mở rộng hợp tác với các nông trại uy tín trong nước và những đối tác nhập khẩu chọn lọc.' },
  { year: '2026', text: 'Trở thành lựa chọn quen thuộc của những khách hàng yêu trái cây premium và lối sống xanh.' },
];

const StorySection = () => {
  return (
    <section className="px-4 md:px-8 py-20">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-[3rem] shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
        >
          <img src="https://images.unsplash.com/photo-1521939513418-08f1b4f9d3d8?q=80&w=1400&auto=format&fit=crop" alt="Nông trại trái cây" className="h-[560px] w-full object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-6"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Câu chuyện của chúng tôi</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Một hành trình bắt đầu từ tình yêu với thực phẩm sạch
          </h2>
          <p className="text-foreground/70 leading-relaxed text-base md:text-lg">
            Morning Fruit không sinh ra để bán thật nhiều sản phẩm. Chúng tôi được hình thành từ một câu hỏi rất đời thường nhưng quan trọng: làm sao để mỗi gia đình đều có thể thưởng thức trái cây tươi ngon, đẹp mắt và an toàn với cảm giác yên tâm tuyệt đối? Từ câu hỏi ấy, thương hiệu từng bước xây dựng một hành trình nghiêm túc hơn với chất lượng, sự minh bạch và trải nghiệm khách hàng.
          </p>
          <p className="text-foreground/70 leading-relaxed text-base md:text-lg">
            Chúng tôi làm việc cùng các nông trại uy tín trong nước và những nguồn cung nhập khẩu chính ngạch để lựa chọn ra từng mẻ trái cây đạt chuẩn. Mỗi trái cây đến tay khách hàng đều trải qua quá trình kiểm tra cẩn thận, bảo quản đúng cách và đóng gói chỉn chu. Bởi với chúng tôi, một món quà từ thiên nhiên xứng đáng được trân trọng ở từng chi tiết nhỏ nhất.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {[
              { icon: FiHeart, title: 'Tận tâm', text: 'Đặt trải nghiệm khách hàng lên trước tiên' },
              { icon: FiShield, title: 'An toàn', text: 'Minh bạch nguồn gốc và chất lượng' },
              { icon: FiTruck, title: 'Tươi mới', text: 'Tối ưu giao nhận để giữ trọn vị ngon' },
            ].map((item) => (
              <div key={item.title} className="rounded-[2rem] bg-white p-5 shadow-sm border border-border/60">
                <item.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-foreground/60">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[2rem] bg-white/70 backdrop-blur-md p-5 border border-border/60 shadow-sm">
            <div className="space-y-4">
              {timeline.map((item) => (
                <div key={item.year} className="flex gap-4 items-start">
                  <span className="inline-flex min-w-16 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">{item.year}</span>
                  <p className="text-foreground/70 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StorySection;
