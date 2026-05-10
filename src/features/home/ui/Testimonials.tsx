import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Health Enthusiast',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    content: 'The quality of these organic fruits is unmatched! Every delivery is perfectly fresh, and you can truly taste the difference compared to regular supermarket produce. Highly recommended!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Chef',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    content: 'As a chef, I rely on the best ingredients. Morning Fruit consistently delivers top-tier, vibrant, and incredibly flavorful fruits that elevate my dishes. The tropical selection is fantastic.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Working Mom',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    content: 'The convenience of having premium fruits delivered straight to my door is a lifesaver. My kids love the sweet strawberries and apples. The packaging is always secure and eco-friendly.',
    rating: 4.5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = testimonials.length - 1;
      if (nextIndex >= testimonials.length) nextIndex = 0;
      return nextIndex;
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold tracking-wider uppercase text-sm mb-3"
          >
            Real Reviews
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-center text-foreground"
          >
            What Our Customers Say
          </motion.h2>
        </div>

        <div className="relative max-w-4xl mx-auto h-[400px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(_e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full px-4"
            >
              <div className="glass p-10 md:p-14 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl border border-white/40 max-w-3xl mx-auto">
                <Quote className="w-12 h-12 text-primary/20 absolute top-8 left-8" />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(testimonials[currentIndex].rating) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
                    />
                  ))}
                </div>

                <p className="text-xl md:text-2xl font-medium text-foreground/80 leading-relaxed mb-8 italic">
                  "{testimonials[currentIndex].content}"
                </p>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary">
                    <img
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover rounded-full border-2 border-white"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground">{testimonials[currentIndex].name}</h4>
                    <span className="text-sm text-foreground/60">{testimonials[currentIndex].role}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 md:-px-12 pointer-events-none z-20">
            <button
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors pointer-events-auto shadow-lg hidden md:flex"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors pointer-events-auto shadow-lg hidden md:flex"
              onClick={() => paginate(1)}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-primary' : 'w-2.5 bg-border hover:bg-primary/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
