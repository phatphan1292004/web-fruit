import { motion } from 'framer-motion';
import { FiCheckCircle, FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiPackage } from 'react-icons/fi';
import { whyChooseUs } from './mockData';

const iconMap = [FiCheckCircle, FiPackage, FiTruck, FiShield, FiRefreshCw, FiHeadphones];

const WhyChooseUs = () => {
  return (
    <section className="px-4 md:px-8 py-20">
      <div className="container mx-auto">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-3">Why Choose Us</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">Vì sao khách hàng yêu thích Morning Fruit?</h2>
          <p className="mt-4 text-foreground/70 leading-relaxed">
            Chúng tôi tin rằng một thương hiệu tốt không chỉ bán sản phẩm, mà còn tạo ra cảm giác yên tâm, thân thiện và đáng tin trong từng lần khách hàng lựa chọn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {whyChooseUs.map((item, index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="rounded-[2rem] bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] border border-border/60"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-orange-100 text-primary flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-3 text-foreground/70 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
