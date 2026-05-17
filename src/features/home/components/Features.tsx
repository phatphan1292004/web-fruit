import { motion, type Variants } from 'framer-motion';
import { Leaf, Award, Truck, Heart } from 'lucide-react';
import { cn } from '../../../lib/utils';

const features = [
  {
    icon: Leaf,
    title: 'Fresh Daily',
    description: 'Our fruits are harvested daily to ensure maximum freshness and taste.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Award,
    title: 'Farm Quality',
    description: 'We partner with the best organic farms to guarantee premium quality.',
    color: 'bg-secondary/10 text-secondary',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Same-day delivery service to bring the freshness straight to your door.',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: Heart,
    title: 'Healthy & Organic',
    description: '100% organic products with no artificial chemicals or preservatives.',
    color: 'bg-destructive/10 text-destructive',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const Features = () => {
  return (
    <section className="py-20 bg-background relative z-20">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-3xl flex flex-col items-center text-center group transition-all duration-300 hover:shadow-2xl"
            >
              <div className={cn('w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6', feature.color)}>
                <feature.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-foreground/70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
