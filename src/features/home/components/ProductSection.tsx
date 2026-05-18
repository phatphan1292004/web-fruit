import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Plus } from 'lucide-react';
import { cn } from '../../../lib/utils';

const categories = ['Tất cả', 'Nhập khẩu', 'Nhiệt đới', 'Bán chạy', 'Hữu cơ'];

const products = [
  {
    id: 1,
    name: 'Dâu tây Nhật cao cấp',
    category: 'Nhập khẩu',
    price: 24.99,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop',
    badge: 'Bán chạy',
  },
  {
    id: 2,
    name: 'Bơ Hass hữu cơ',
    category: 'Hữu cơ',
    price: 8.5,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Xoài Thái tươi',
    category: 'Nhiệt đới',
    price: 12.0,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop',
    badge: 'Theo mùa',
  },
  {
    id: 4,
    name: 'Anh đào ngọt',
    category: 'Nhập khẩu',
    price: 18.99,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=500&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'Thanh long hữu cơ',
    category: 'Nhiệt đới',
    price: 9.99,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1527310562375-a8f15724a2f0?w=500&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Táo Fuji đóng gói',
    category: 'Bán chạy',
    price: 15.0,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fd6c?w=500&auto=format&fit=crop',
  },
  {
    id: 7,
    name: 'Việt quất tươi',
    category: 'Hữu cơ',
    price: 14.5,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&auto=format&fit=crop',
    badge: 'Hữu cơ',
  },
  {
    id: 8,
    name: 'Kiwi cao cấp',
    category: 'Nhập khẩu',
    price: 11.2,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&auto=format&fit=crop',
  },
];

const ProductSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = products.filter(
    (product) => activeCategory === 'Tất cả' || product.category === activeCategory || (activeCategory === 'Bán chạy' && product.badge === 'Bán chạy')
  );

  return (
    <section className="py-24 bg-muted/10 relative" id="fruits">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold tracking-wider uppercase text-sm mb-3"
          >
            Tươi ngon & cao cấp
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-center mb-10"
          >
            Trái cây nổi bật của chúng tôi
          </motion.h2>

          {/* Filter Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 md:gap-4 p-1 bg-white/50 backdrop-blur-md rounded-full shadow-sm border border-border/50"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
                  activeCategory === category
                    ? 'bg-primary text-white shadow-md'
                    : 'text-foreground/70 hover:bg-white hover:text-foreground'
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 flex flex-col relative border border-border/40"
              >
                {/* Badges */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {product.badge}
                  </div>
                )}
                
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-muted/20 p-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 z-0"></div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700 ease-in-out relative z-10 mix-blend-multiply"
                  />
                  {/* Quick Add Button overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center backdrop-blur-[2px]">
                     <button className="bg-white text-primary w-12 h-12 rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-primary hover:text-white">
                        <ShoppingCart className="w-5 h-5" />
                     </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-semibold text-foreground/80">{product.rating}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{product.name}</h3>
                  <span className="text-sm text-foreground/50 mb-4">{product.category}</span>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                    <button className="bg-foreground text-background p-2.5 rounded-full hover:bg-primary transition-colors group/btn relative overflow-hidden">
                      <Plus className="w-5 h-5 relative z-10" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        <div className="mt-16 text-center">
           <button className="border-2 border-primary text-primary px-10 py-3.5 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors duration-300">
             Xem tất cả sản phẩm
           </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
