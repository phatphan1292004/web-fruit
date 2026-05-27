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
              className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_160px_140px_56px] gap-6 md:items-center border border-border/50 rounded-3xl p-5 md:p-6 bg-white/60"
            >
              <div className="flex items-center gap-5 flex-1">
                <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-2">
                  {item.badge && (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                      {item.badge}
                    </span>
                  )}
                  <h3 className="text-base md:text-lg font-bold text-foreground">{item.name}</h3>
                  <p className="text-sm text-foreground/60">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-center gap-3">
                <button
                  className={cn(
                    'w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:bg-muted transition-colors',
                    item.quantity === 1 && 'opacity-40 cursor-not-allowed'
                  )}
                  onClick={() => onDecrease(item.id)}
                  disabled={item.quantity === 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-semibold text-foreground">{item.quantity}</span>
                <button
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:bg-muted transition-colors"
                  onClick={() => onIncrease(item.id)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4">
                <span className="text-lg font-bold text-foreground md:text-right">
                  {formatCurrency(item.price * item.quantity)}
                </span>
                <button
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors md:hidden"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

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
