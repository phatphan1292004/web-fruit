import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../../../components/layout/layout';
import { fetchProductDetail } from '../servers';
import type { ApiProduct } from '../servers';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import ReviewSection from './ReviewSection';
import RelatedProducts from './RelatedProducts';
import { fruitProducts } from '../../category/components/mockData';
import type { FruitProduct } from '../../category/components/types';
import { productReviews } from './mockData';

const categorySlugMap: Record<string, string> = {
  'Trong nước': 'trai-cay-trong-nuoc',
  'Nhập khẩu': 'trai-cay-nhap-khau',
  'Giỏ quà': 'gio-qua-trai-cay',
  'Hữu cơ': 'trai-cay-huu-co',
  'Theo mùa': 'trai-cay-theo-mua',
};

const getCategorySlug = (product: ApiProduct) => {
  const directSlug = product.categoryId?.slug;
  if (directSlug) return directSlug;

  const categoryName = product.category ?? product.categoryId?.name ?? '';
  return categorySlugMap[categoryName] ?? '';
};

const mapApiProductToDetail = (product: ApiProduct) => ({
  id: product.id,
  slug: product.slug,
  name: product.name,
  category: product.categoryId?.name ?? product.category ?? 'Danh mục trái cây',
  categorySlug: product.categoryId?.slug ?? categorySlugMap[product.categoryId?.name ?? product.category ?? ''] ?? 'trai-cay-nhap-khau',
  price: product.price,
  oldPrice: product.originalPrice ?? product.price,
  rating: product.rating ?? 0,
  reviewsCount: product.reviews ?? 0,
  badges: [product.label ?? 'New'] as const,
  stockText: product.stockText ?? 'Còn hàng',
  origin: product.origin ?? 'Việt Nam',
  weight: product.weight ?? '1kg',
  unit: product.unit ?? 'Hộp',
  shelfLife: product.shelfLife ?? '7 ngày',
  storage: product.storage ?? 'Bảo quản ngăn mát 2 - 5°C',
  shortDescription: product.shortDescription ?? 'Sản phẩm trái cây cao cấp, tươi ngon và được chọn lọc kỹ lưỡng.',
  description: product.description ?? 'Mô tả sản phẩm đang được cập nhật.',
  nutrition: product.nutrition ?? ['Giàu vitamin', 'Chất xơ tự nhiên', 'Hương vị tươi ngon'],
  storageTips: product.storageTips ?? ['Bảo quản ngăn mát', 'Tránh ánh nắng trực tiếp', 'Dùng sớm để ngon nhất'],
  gallery: product.gallery?.length ? product.gallery : [product.image ?? 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1200&auto=format&fit=crop'],
});

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(mapApiProductToDetail(fruitProducts[0]));

  const relatedProducts: FruitProduct[] = useMemo(() => fruitProducts.filter((item) => item.id !== product.id).slice(0, 4), [product.id]);
  const categorySlug = getCategorySlug(product as unknown as ApiProduct);
  const categoryLink = categorySlug ? `/category/${categorySlug}` : '/category';

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        setProduct(mapApiProductToDetail(await fetchProductDetail(slug)));
      } catch {
        const fallback = fruitProducts.find((item) => item.slug === slug);
        if (fallback) {
          setProduct({
            id: fallback.id,
            slug: fallback.slug,
            name: fallback.name,
            category: fallback.category,
            categorySlug: categorySlugMap[fallback.category] ?? 'trai-cay-nhap-khau',
            price: fallback.price,
            oldPrice: fallback.originalPrice,
            rating: fallback.rating,
            reviewsCount: fallback.reviews,
            badges: [fallback.label],
            stockText: 'Còn hàng',
            origin: 'Việt Nam',
            weight: '1kg',
            unit: 'Hộp',
            shelfLife: '7 ngày',
            storage: 'Bảo quản ngăn mát 2 - 5°C',
            shortDescription: 'Sản phẩm trái cây cao cấp, tươi ngon và được chọn lọc kỹ lưỡng.',
            description: 'Mô tả sản phẩm đang được cập nhật.',
            nutrition: ['Giàu vitamin', 'Chất xơ tự nhiên', 'Hương vị tươi ngon'],
            storageTips: ['Bảo quản ngăn mát', 'Tránh ánh nắng trực tiếp', 'Dùng sớm để ngon nhất'],
            gallery: [fallback.image],
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [slug]);

  return (
    <Layout mainClassName="bg-gradient-to-b from-emerald-50 via-white to-orange-50 pt-28 pb-16">
      <div className="container mx-auto px-4 md:px-8 space-y-10">
        <nav className="text-sm text-foreground/60 flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to={categoryLink} className="hover:text-primary transition-colors">
            {product.category || 'Danh mục'}
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">{product.name}</span>
        </nav>
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse"><div className="rounded-[2rem] bg-white h-[560px]" /><div className="space-y-4"><div className="h-8 bg-white rounded-full w-2/3" /><div className="h-6 bg-white rounded-full w-1/2" /><div className="h-40 bg-white rounded-[2rem]" /></div></div>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"><ProductGallery product={product as any} /><ProductInfo product={product as any} quantity={quantity} onIncrease={() => setQuantity((prev) => prev + 1)} onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))} onAddToCart={() => {}} /></section>
        )}
        <ProductTabs product={product as any} />
        <ReviewSection product={product as any} reviews={productReviews} />
        <RelatedProducts products={relatedProducts} />
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
