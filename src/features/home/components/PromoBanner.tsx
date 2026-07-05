import { motion } from 'framer-motion';

const PromoBanner = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-primary to-emerald-600 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-10 md:p-20">
            <div className="flex flex-col items-start gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30"
              >
                <span className="text-white font-medium tracking-wider text-sm uppercase">Khuyến Mãi Giới Hạn</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                Nhận ngay <span className="text-accent">ƯU ĐÃI 30%</span> khi mua <br /> Combo Trái Cây Nhiệt Đới
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-lg md:text-xl max-w-md"
              >
                Thưởng thức hương vị nhiệt đới mùa hè cùng hộp trái cây cao cấp. Được hái tươi và giao tận tay bạn.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mt-4"
              >
                Nhận Ưu Đãi Ngay
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-64 md:h-full flex justify-center items-center"
            >
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop"
                alt="Tropical Fruit Box"
                className="w-full max-w-sm object-cover rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-8 border-white/10"
              />
              
              {/* Floating decorators */}
              <motion.img
                animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=150&auto=format&fit=crop"
                className="absolute top-0 right-0 w-24 h-24 rounded-full object-cover shadow-xl border-4 border-white/20"
                alt="Pineapple"
              />
              <motion.img
                animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                src="https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=150&auto=format&fit=crop"
                className="absolute bottom-0 left-0 w-28 h-28 rounded-full object-cover shadow-xl border-4 border-white/20"
                alt="Mango"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
