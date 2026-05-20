import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMapPin, FiShoppingBag, FiClock } from 'react-icons/fi';

const stats = [
  { label: 'Khách hàng', value: 10000, suffix: '+', icon: FiUsers },
  { label: 'Đối tác nông trại', value: 50, suffix: '+', icon: FiMapPin },
  { label: 'Sản phẩm', value: 300, suffix: '+', icon: FiShoppingBag },
  { label: 'Năm hoạt động', value: 5, suffix: '', icon: FiClock },
];

const Counter = ({ value, suffix }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = window.setInterval(() => {
      current += increment;
      if (current >= value) {
        current = value;
        window.clearInterval(timer);
      }
      setCount(Math.floor(current));
    }, duration / steps);
    return () => window.clearInterval(timer);
  }, [value]);

  return <>{count.toLocaleString('vi-VN')}{suffix}</>;
};

const StatisticsSection = () => {
  return (
    <section className="px-4 md:px-8 py-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              whileHover={{ y: -5 }}
              className="rounded-[2.2rem] bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)] border border-border/60"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-foreground"><Counter value={item.value} suffix={item.suffix} /></p>
                  <p className="mt-2 text-sm uppercase tracking-wider text-foreground/50">{item.label}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <item.icon className="w-7 h-7" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
