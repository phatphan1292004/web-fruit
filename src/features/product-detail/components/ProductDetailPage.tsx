import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../../components/layout/layout';
import { fetchProductDetail, fetchReviewsByProductId, fetchRelatedProducts } from '../servers';
import type { ApiProduct } from '../servers';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import ReviewSection from './ReviewSection';
import RelatedProducts from './RelatedProducts';
import { fruitProducts } from '../../category/components/constants';
import type { FruitProduct, FruitCategory } from '../../category/components/types';

const toFruitCategory = (value?: string): FruitCategory => {
  const normalized = (value ?? '').toLowerCase();
  if (normalized.includes('nhap') || normalized.includes('nhập')) return 'Nhập khẩu';
  if (normalized.includes('huu') || normalized.includes('hữu')) return 'Hữu cơ';
  if (normalized.includes('gio') || normalized.includes('giỏ')) return 'Giỏ quà';
  if (normalized.includes('mua') || normalized.includes('mùa')) return 'Theo mùa';
  return 'Trong nước';
};

const toFruitLabel = (badge?: string): 'Hot' | 'Sale' | 'New' => {
  const normalized = (badge ?? '').toLowerCase();
  if (normalized.includes('sale')) return 'Sale';
  if (normalized.includes('hot')) return 'Hot';
  return 'New';
};

const mapApiProductToFruit = (p: ApiProduct): FruitProduct => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: toFruitCategory(p.categoryId?.name ?? p.category),
  price: p.price,
  originalPrice: p.originalPrice ?? p.price,
  rating: p.rating ?? 0,
  reviews: p.reviewsCount ?? p.reviews ?? 0,
  label: toFruitLabel(p.label ?? p.badges?.[0]),
  image: p.gallery?.[0] ?? p.image ?? 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1200&auto=format&fit=crop',
  bestseller: 0,
  createdAt: p.createdAt ?? new Date().toISOString(),
});
import { useCartStore } from '../../cart/store/cart-store';
import { addFavoriteProduct, fetchFavoriteProducts } from '../../profile/servers';
import type { ProductDetail, ProductReview } from './types';

const readCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

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

const mapApiProductToDetail = (product: ApiProduct): ProductDetail => ({
  _id: product._id,
  id: product.id,
  slug: product.slug,
  name: product.name,
  category: product.categoryId?.name ?? product.category ?? 'Danh mục trái cây',
  categorySlug: product.categoryId?.slug ?? categorySlugMap[product.categoryId?.name ?? product.category ?? ''] ?? 'trai-cay-nhap-khau',
  price: product.price,
  oldPrice: product.originalPrice ?? product.price,
  rating: product.rating ?? 0,
  reviewsCount: product.reviewsCount ?? product.reviews ?? 0,
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
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetail>(mapApiProductToDetail(fruitProducts[0] as ApiProduct));
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [favoriteAddedId, setFavoriteAddedId] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const isFavoriteAdded = product._id ? favoriteAddedId === product._id : false;

  const [relatedProducts, setRelatedProducts] = useState<FruitProduct[]>([]);
  const categorySlug = getCategorySlug(product as unknown as ApiProduct);
  const categoryLink = categorySlug ? `/category/${categorySlug}` : '/category';

  const reloadProductAndReviews = async () => {
    if (!slug) return;
    try {
      const detail = await fetchProductDetail(slug);
      const mapped = mapApiProductToDetail(detail);
      setProduct(mapped);
      if (detail._id) {
        const list = await fetchReviewsByProductId(detail._id);
        setReviews(list);
      }
      const related = await fetchRelatedProducts(slug);
      if (related) {
        setRelatedProducts(related.map(mapApiProductToFruit));
      }
    } catch (err) {
      console.error('Reload failed:', err);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        const detail = await fetchProductDetail(slug);
        setProduct(mapApiProductToDetail(detail));
        if (detail._id) {
          const list = await fetchReviewsByProductId(detail._id);
          setReviews(list);
        }
        const related = await fetchRelatedProducts(slug);
        if (related) {
          setRelatedProducts(related.map(mapApiProductToFruit));
        }
      } catch {
        const fallback = fruitProducts.find((item) => item.slug === slug);
        if (fallback) {
          setProduct({
            _id: undefined,
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
          setReviews([]);
          const fallbackList = fruitProducts.filter((item) => item.id !== fallback.id).slice(0, 4);
          setRelatedProducts(fallbackList);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [slug]);

  const handleAddFavorite = async () => {
    const userId = readCookie('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    if (!product._id) return;
    setIsFavoriteLoading(true);
    try {
      await addFavoriteProduct(userId, { productId: product._id });
      setFavoriteAddedId(product._id);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadFavoriteState = async () => {
      const userId = readCookie('userId');
      if (!userId || !product._id) {
        setFavoriteAddedId(null);
        return;
      }
      const favorites = await fetchFavoriteProducts(userId);
      if (!isActive) return;
      const hasFavorite = (favorites ?? []).some((item: unknown) => {
        const candidate = (item as { _id?: string; productId?: string; id?: number | string })._id || (item as { _id?: string; productId?: string; id?: number | string }).productId || ((item as { _id?: string; productId?: string; id?: number | string }).id ? String((item as { _id?: string; productId?: string; id?: number | string }).id) : null);
        return candidate === product._id;
      });
      setFavoriteAddedId(hasFavorite ? product._id : null);
    };

    loadFavoriteState();
    return () => {
      isActive = false;
    };
  }, [product._id]);

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse"><div className="rounded-4xl bg-white h-140" /><div className="space-y-4"><div className="h-8 bg-white rounded-full w-2/3" /><div className="h-6 bg-white rounded-full w-1/2" /><div className="h-40 bg-white rounded-4xl" /></div></div>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <ProductGallery product={product} />
            <ProductInfo
              product={product}
              quantity={quantity}
              onIncrease={() => setQuantity((prev) => prev + 1)}
              onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
              onAddToCart={() =>
                addItem({
                  id: product.id,
                  productId: product._id ?? String(product.id),
                  name: product.name,
                  description: product.shortDescription ?? product.category,
                  price: product.price,
                  image: product.gallery?.[0] ?? '',
                  badge: product.badges?.[0],
                  quantity,
                })
              }
              onAddToFavorite={handleAddFavorite}
              isFavoriteLoading={isFavoriteLoading}
              isFavoriteAdded={isFavoriteAdded}
            />
          </section>
        )}
        <ProductTabs product={product} />
        <ReviewSection product={product} reviews={reviews} onReviewSubmitted={reloadProductAndReviews} />
        <RelatedProducts products={relatedProducts} />
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
