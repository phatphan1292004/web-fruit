import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Truck, ShieldCheck } from 'lucide-react';

const stats = [
  { icon: ShieldCheck, text: '100% Organic', color: 'text-primary' },
  { icon: Truck, text: 'Fast Delivery', color: 'text-secondary' },
  { icon: Leaf, text: 'Fresh Everyday', color: 'text-accent' },
];

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-background to-muted/30">
      {/* Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="flex flex-col gap-6 pt-10 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm w-fit"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-medium text-foreground/80">Fresh from our farm to your table</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight"
          >
            Nourish Your Body <br /> With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Premium Fruits
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-foreground/70 max-w-lg leading-relaxed"
          >
            Experience the purest taste of nature with our hand-picked, 100% organic fruits delivered fresh to your doorstep every day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button className="bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group">
              Shop Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white text-foreground border border-border px-8 py-4 rounded-full font-semibold text-lg shadow-sm hover:shadow-md hover:bg-muted transition-all duration-300">
              Explore Menu
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 pt-8 border-t border-border mt-4"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <span className="font-medium text-sm text-foreground/80">{stat.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[500px] lg:h-[700px] flex items-center justify-center"
        >
          {/* Main Hero Image */}
          <div className="relative w-full h-full max-w-lg flex items-center justify-center z-10">
            {/* Placeholder for actual fruit bowl image */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full aspect-square rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 glass flex items-center justify-center p-8 relative"
            >
               <img 
                 src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1000&auto=format&fit=crop" 
                 alt="Fresh Fruits" 
                 className="w-full h-full object-cover rounded-full shadow-2xl"
               />
               
               {/* Floating elements */}
               <motion.div 
                 animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                 transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                 className="absolute -top-10 -right-4 w-24 h-24 bg-white rounded-full glass flex items-center justify-center shadow-xl p-2"
               >
                 <img src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200&auto=format&fit=crop" alt="Pineapple" className="w-full h-full object-cover rounded-full" />
               </motion.div>

               <motion.div 
                 animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
                 transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                 className="absolute bottom-10 -left-10 w-32 h-32 bg-white rounded-full glass flex items-center justify-center shadow-xl p-2"
               >
                 <img src="https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&auto=format&fit=crop" alt="Mango" className="w-full h-full object-cover rounded-full" />
               </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
