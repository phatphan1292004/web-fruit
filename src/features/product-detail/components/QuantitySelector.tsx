import { FiMinus, FiPlus } from 'react-icons/fi';

type QuantitySelectorProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

const QuantitySelector = ({ quantity, onDecrease, onIncrease }: QuantitySelectorProps) => {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-white shadow-sm overflow-hidden">
      <button type="button" onClick={onDecrease} className="px-4 py-3 text-foreground hover:bg-muted transition-colors">
        <FiMinus />
      </button>
      <span className="min-w-12 px-4 py-3 text-center font-semibold text-foreground">{quantity}</span>
      <button type="button" onClick={onIncrease} className="px-4 py-3 text-foreground hover:bg-muted transition-colors">
        <FiPlus />
      </button>
    </div>
  );
};

export default QuantitySelector;
