import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi';

const GoogleMapSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      className="rounded-[2.5rem] bg-white p-4 md:p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] border border-border/60"
    >
      <div className="overflow-hidden rounded-[2rem] shadow-sm border border-border/60">
        <iframe
          title="Fresh Fruit Store Location"
          src="https://www.google.com/maps?q=123%20Nguyễn%20Huệ,%20Quận%201,%20TP.HCM&output=embed"
          className="h-[360px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: FiMapPin, title: 'Chi nhánh chính', value: '123 Nguyễn Huệ, Quận 1, TP.HCM' },
          { icon: FiPhone, title: 'Hotline hỗ trợ', value: '0909 123 456' },
          { icon: FiMail, title: 'Email liên hệ', value: 'support@freshfruit.vn' },
        ].map((item) => (
          <div key={item.title} className="rounded-[1.5rem] bg-emerald-50 p-4 border border-emerald-100">
            <item.icon className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs uppercase tracking-wider text-foreground/45">{item.title}</p>
            <p className="mt-1 font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[1.5rem] bg-orange-50 p-5 border border-orange-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Hướng dẫn liên hệ nhanh</h3>
          <p className="mt-1 text-sm text-foreground/65">Gọi hotline để được tư vấn sản phẩm, đặt quà tặng hoặc hỗ trợ đơn hàng trong thời gian ngắn nhất.</p>
        </div>
        <a href="tel:0909123456" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-white shadow-sm hover:shadow-md transition-all duration-300">
          Gọi ngay
          <FiArrowRight />
        </a>
      </div>
    </motion.section>
  );
};

export default GoogleMapSection;
