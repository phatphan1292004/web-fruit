import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import type { WishlistItem } from './types';

type Props = { items: WishlistItem[]; isLoading?: boolean };

const WishlistSection = ({ items, isLoading }: Props) => (
  <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-border/60">
    <h3 className="text-2xl font-bold text-foreground mb-6">Sản phẩm yêu thích</h3>
    {isLoading ? (
      <div className="rounded-2xl border border-dashed border-border/70 bg-muted/10 px-6 py-10 text-center text-sm text-foreground/60">
        Đang tải sản phẩm yêu thích...
      </div>
    ) : items.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-border/70 bg-muted/10 px-6 py-10 text-center text-sm text-foreground/60">
        Chưa có sản phẩm yêu thích.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {items.map((item) => (
          <motion.div key={item.id} whileHover={{ y: -6 }} className="group overflow-hidden rounded-[2rem] border border-border/60 bg-muted/20 shadow-sm">
            <img src={item.image} alt={item.name} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="p-4 space-y-3">
              <h4 className="font-semibold text-foreground">{item.name}</h4>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <FiStar className="text-amber-500" /> {item.rating}
              </div>
              <p className="font-bold text-primary">{item.price.toLocaleString('vi-VN')}đ</p>
              <div className="flex gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                  <FiShoppingCart /> Add to cart
                </button>
                <button className="rounded-full border border-border px-4 py-3 text-rose-500 hover:bg-rose-50 transition-colors">
                  <FiHeart />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </section>
);

export default WishlistSection;
