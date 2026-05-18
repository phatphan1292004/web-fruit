import { CreditCard, ShoppingCart, Truck } from 'lucide-react';
import { cn } from '../../../lib/utils';

type CartStepsProps = {
  currentStep: 1 | 2 | 3;
};

const steps = [
  { id: 1, label: 'Giỏ hàng', icon: ShoppingCart },
  { id: 2, label: 'Giao hàng', icon: Truck },
  { id: 3, label: 'Thanh toán', icon: CreditCard },
];

const CartSteps = ({ currentStep }: CartStepsProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-3 flex-1">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center border transition-colors',
                    isActive && 'bg-primary text-white border-primary shadow-lg',
                    isCompleted && 'bg-primary/10 text-primary border-primary/30',
                    !isActive && !isCompleted && 'bg-white text-foreground/40 border-border'
                  )}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    'text-sm font-semibold',
                    isActive && 'text-primary',
                    isCompleted && 'text-foreground',
                    !isActive && !isCompleted && 'text-foreground/50'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-border/70 relative">
                  <span
                    className={cn(
                      'absolute inset-0 h-full rounded-full transition-all',
                      isCompleted && 'bg-primary/60',
                      isActive && 'bg-primary/30',
                      !isCompleted && !isActive && 'bg-transparent'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartSteps;
