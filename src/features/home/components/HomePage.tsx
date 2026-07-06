import DefaultLayout from '../../../components/layout/layout';
import HeroBanner from './HeroBanner';
import Features from './Features';
import ProductSection from './ProductSection';
import FlashSaleSection from './FlashSaleSection';
import PromoBanner from './PromoBanner';
import Testimonials from './Testimonials';
import RecommendationSection from './RecommendationSection';

const HomePage = () => {
  return (
    <DefaultLayout mainClassName="bg-background relative pt-16 sm:pt-20">
      <HeroBanner />
      <Features />
      <FlashSaleSection />
      <RecommendationSection />
      <ProductSection />
      <PromoBanner />
      <Testimonials />
    </DefaultLayout>
  );
};

export default HomePage;
