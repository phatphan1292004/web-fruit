import ProductCard from './ProductCard';
import type { FruitProduct } from './types';

type ProductGridProps = {
  products: FruitProduct[];
};

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
