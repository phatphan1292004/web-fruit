type CartHeaderProps = {
  title: string;
  breadcrumb: string;
  subtitle?: string;
};

const CartHeader = ({ title, breadcrumb, subtitle }: CartHeaderProps) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm text-foreground/60">{breadcrumb}</span>
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-foreground/70 text-base md:text-lg max-w-2xl">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default CartHeader;
