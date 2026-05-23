import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa6';

const socialItems = [
  { name: 'Facebook', icon: FaFacebookF, gradient: 'from-blue-600 to-blue-400' },
  { name: 'Instagram', icon: FaInstagram, gradient: 'from-pink-500 to-orange-400' },
  { name: 'TikTok', icon: FaTiktok, gradient: 'from-slate-900 to-slate-600' },
  { name: 'YouTube', icon: FaYoutube, gradient: 'from-red-600 to-rose-500' },
];

const SocialMediaSection = () => {
  return (
    <section className="px-4 md:px-8 py-20 bg-muted/20">
      <div className="container mx-auto">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Social Media</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-foreground">Kết nối với chúng tôi</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {socialItems.map((item, index) => (
            <motion.a
              key={item.name}
              href="#"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`rounded-[2rem] bg-gradient-to-br ${item.gradient} p-[1px] shadow-[0_12px_35px_rgba(15,23,42,0.12)]`}
            >
              <div className="rounded-[calc(2rem-1px)] bg-white/95 p-6 h-full flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-md`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-foreground/45">Follow us</p>
                  <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
