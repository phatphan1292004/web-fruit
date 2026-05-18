import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../../../components/layout/layout';
import { fruitProducts } from '../../category/components/mockData';
import type { FruitProduct } from '../../category/components/types';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import ReviewSection from './ReviewSection';
import RelatedProducts from './RelatedProducts';
import { productDetails, productReviews } from './mockData';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const product = productDetails.find((item) => item.slug === slug) ?? productDetails[0];

  const relatedProducts: FruitProduct[] = useMemo(
    () => fruitProducts.filter((item) => item.id !== product.id).slice(0, 4),
    [product.id]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 400);
    return () => window.clearTimeout(timer);
  }, []);

  const handleAddToCart = () => {};

  return (
    <Layout mainClassName="bg-gradient-to-b from-emerald-50 via-white to-orange-50 pt-28 pb-16">
      <div className="container mx-auto px-4 md:px-8 space-y-10">
        <nav className="text-sm text-foreground/60 flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/category" className="hover:text-primary transition-colors">
            Trái cây nhập khẩu
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">{product.name}</span>
        </nav>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="rounded-[2rem] bg-white h-[560px]" />
            <div className="space-y-4">
              <div className="h-8 bg-white rounded-full w-2/3" />
              <div className="h-6 bg-white rounded-full w-1/2" />
              <div className="h-40 bg-white rounded-[2rem]" />
            </div>
          </div>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <ProductGallery product={product} />
            <ProductInfo
              product={product}
              quantity={quantity}
              onIncrease={() => setQuantity((prev) => prev + 1)}
              onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
              onAddToCart={handleAddToCart}
            />
          </section>
        )}

        <ProductTabs product={product} />

        <ReviewSection product={product} reviews={productReviews} />

        <RelatedProducts products={relatedProducts} />
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
