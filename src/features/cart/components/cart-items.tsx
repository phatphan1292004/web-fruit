import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { CartItem } from './types';

type CartItemsProps = {
  items: CartItem[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
  formatCurrency: (value: number) => string;
};

const CartItems = ({ items, onIncrease, onDecrease, onRemove, formatCurrency }: CartItemsProps) => {
  return (
    <div className="glass rounded-3xl border border-border/60 p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="hidden md:grid grid-cols-[minmax(0,1fr)_160px_140px_56px] items-center gap-6 text-sm font-semibold text-foreground/60 border-b border-border/60 pb-4 px-5 md:px-6 -mx-5 md:-mx-6">
        <span>Sản phẩm</span>
        <span className="text-center">Số lượng</span>
        <span className="text-right">Giá</span>
        <span className="sr-only">Xóa</span>
      </div>

      <div className="flex flex-col gap-5 mt-6">
        {items.length === 0 ? (
          <div className="py-10 text-center text-foreground/60">
            Giỏ hàng của bạn đang trống.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:grid md:grid-cols-[minmax(0,1fr)_160px_140px_56px] gap-4 md:items-center border border-border/50 rounded-3xl p-4 md:p-6 bg-white/60 text-slate-700"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-muted/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  {item.badge && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full w-fit block mb-1">
                      {item.badge}
                    </span>
                  )}
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate">{item.name}</h3>
                  <p className="text-xs text-slate-400 truncate">{item.description}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-1 md:hidden">Đơn giá: {formatCurrency(item.price)}</p>
                </div>
              </div>

              {/* Controls and Price on mobile */}
              <div className="flex items-center justify-between gap-4 border-t border-slate-100/60 pt-3 md:border-t-0 md:pt-0">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    className={cn(
                      'w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:bg-muted transition-colors',
                      item.quantity === 1 && 'opacity-40 cursor-not-allowed'
                    )}
                    onClick={() => onDecrease(item.id)}
                    disabled={item.quantity === 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                  <button
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:bg-muted transition-colors"
                    onClick={() => onIncrease(item.id)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Price and Delete */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 md:hidden font-medium">Tổng cộng</p>
                    <span className="text-sm sm:text-base font-bold text-slate-800">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                  <button
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors md:hidden"
                    onClick={() => onRemove(item.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Desktop-only delete */}
              <div className="hidden md:flex items-center justify-end">
                <button
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartItems;
