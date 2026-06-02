import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
const contactInfo = [
  {
    title: 'Địa chỉ cửa hàng',
    value: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    icon: 'map',
  },
  {
    title: 'Hotline',
    value: '0909 123 456',
    icon: 'phone',
  },
  {
    title: 'Email hỗ trợ',
    value: 'support@freshfruit.vn',
    icon: 'mail',
  },
  {
    title: 'Giờ hoạt động',
    value: '07:00 - 22:00 mỗi ngày',
    icon: 'clock',
  },
];

const icons = {
  map: FiMapPin,
  phone: FiPhone,
  mail: FiMail,
  clock: FiClock,
};

const ContactInfoCards = () => {
  return (
    <section className="px-4 md:px-8 py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {contactInfo.map((item, index) => {
          const Icon = icons[item.icon as keyof typeof icons];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="rounded-[2rem] bg-white/75 backdrop-blur-md p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] border border-white/60"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-orange-100 text-primary flex items-center justify-center mb-5">
                <Icon className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wider text-foreground/50">{item.title}</p>
              <p className="mt-2 text-lg font-bold text-foreground leading-relaxed">{item.value}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ContactInfoCards;
