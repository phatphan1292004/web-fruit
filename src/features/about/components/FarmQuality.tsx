import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

const steps = [
  { title: 'Tuyển chọn', text: 'Chọn lọc những trái cây đạt chuẩn về độ chín, hình thức và hương vị.' },
  { title: 'Kiểm tra', text: 'Đánh giá chất lượng và nguồn gốc trước khi đưa vào hệ thống.' },
  { title: 'Bảo quản', text: 'Giữ đúng điều kiện nhiệt độ để trái cây luôn tươi mới.' },
  { title: 'Đóng gói', text: 'Đóng gói cẩn thận, đẹp mắt và phù hợp với từng loại trái cây.' },
  { title: 'Giao hàng', text: 'Vận chuyển nhanh để giữ trọn vị ngon và độ tươi khi đến tay khách hàng.' },
];

const FarmQuality = () => {
  return (
    <section className="px-4 md:px-8 py-20 bg-muted/20">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-5"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Farm & Quality</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">Chất lượng không chỉ là lời hứa, mà là quy trình</h2>
          <p className="text-foreground/70 leading-relaxed">
            Để giữ được độ tươi ngon tự nhiên, chúng tôi theo dõi từng khâu từ nông trại đến đóng gói. Mỗi bước đều được chuẩn hóa để đảm bảo sản phẩm khi đến tay khách hàng vẫn giữ được vẻ đẹp, hương vị và giá trị dinh dưỡng tốt nhất.
          </p>

          <div className="space-y-4 pt-2">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-4 items-start rounded-[1.5rem] bg-white p-5 shadow-sm border border-border/60">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white font-bold">{index + 1}</span>
                <div>
                  <h3 className="font-bold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-foreground/65 leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 gap-4"
        >
          <img src="https://images.unsplash.com/photo-1592921870789-04563d55041c?q=80&w=900&auto=format&fit=crop" alt="Nông trại" className="rounded-[2rem] h-64 w-full object-cover shadow-lg" />
          <img src="https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=900&auto=format&fit=crop" alt="Đóng gói" className="rounded-[2rem] h-64 w-full object-cover shadow-lg mt-10" />
          <img src="https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=900&auto=format&fit=crop" alt="Vận chuyển" className="rounded-[2rem] h-64 w-full object-cover shadow-lg" />
          <div className="rounded-[2rem] bg-white p-6 shadow-lg border border-border/60 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <FiCheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Kiểm soát chất lượng nghiêm ngặt</h3>
              <p className="mt-3 text-foreground/70 leading-relaxed">
                Chúng tôi không chỉ kiểm tra sản phẩm bằng mắt nhìn, mà còn theo dõi nhiệt độ, độ ẩm và thời gian vận chuyển để giữ được sự tươi ngon tự nhiên.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FarmQuality;
