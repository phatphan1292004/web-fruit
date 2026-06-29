import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import type { WishlistItem } from './types';
import { useCartStore } from '../../cart/store/cart-store';

type Props = { items: WishlistItem[]; isLoading?: boolean };

const WishlistSection = ({ items, isLoading }: Props) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
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
            <motion.div key={item.id} whileHover={{ y: -6 }} className="group overflow-hidden rounded-[2rem] border border-border/60 bg-muted/20 shadow-sm flex flex-col justify-between">
              <div>
                <Link to={`/product/${item.slug}`} className="block relative overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </Link>
                <div className="p-4 space-y-2">
                  <Link to={`/product/${item.slug}`} className="block">
                    <h4 className="font-semibold text-slate-800 leading-snug group-hover:text-primary transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <FiStar className="text-amber-500" /> {item.rating.toFixed(1)}
                  </div>
                  <p className="font-bold text-primary">{item.price.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: item.id,
                        productId: item._id ?? String(item.id),
                        name: item.name,
                        description: 'Trái cây yêu thích',
                        price: item.price,
                        image: item.image,
                      })
                    }
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-3 py-2.5 text-xs font-semibold text-white hover:bg-primary/95 transition-all shadow-sm"
                  >
                    <FiShoppingCart /> Mua ngay
                  </button>
                  <button className="rounded-full border border-border px-3 py-2.5 text-rose-500 hover:bg-rose-50 transition-colors">
                    <FiHeart className="fill-current" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default WishlistSection;
