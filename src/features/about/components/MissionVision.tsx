import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiHeart, FiSun } from 'react-icons/fi';

const MissionVision = () => {
  const cards = [
    {
      title: 'Sứ mệnh',
      icon: FiTarget,
      text: 'Mang đến nguồn trái cây sạch, tươi ngon mỗi ngày để bữa ăn của mỗi gia đình luôn trọn vẹn sự an tâm và niềm vui.',
    },
    {
      title: 'Tầm nhìn',
      icon: FiEye,
      text: 'Trở thành thương hiệu trái cây premium được yêu thích hàng đầu, nơi khách hàng nghĩ đến đầu tiên khi muốn tìm sự tươi mới và chất lượng.',
    },
    {
      title: 'Giá trị cốt lõi',
      icon: FiHeart,
      list: ['Tươi mới', 'Chất lượng', 'Tận tâm', 'Minh bạch', 'Sức khỏe khách hàng'],
    },
  ];

  return (
    <section className="px-4 md:px-8 py-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="rounded-[2.2rem] bg-white/70 backdrop-blur-md p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)] border border-white/60"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <card.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{card.title}</h3>
              {'text' in card ? (
                <p className="text-foreground/70 leading-relaxed">{card.text}</p>
              ) : (
                <ul className="space-y-3 text-foreground/70">
                  {card.list.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <FiSun className="text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
