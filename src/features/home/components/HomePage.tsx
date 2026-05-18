import DefaultLayout from '../../../components/layout/layout';
import HeroBanner from './HeroBanner';
import Features from './Features';
import ProductSection from './ProductSection';
import PromoBanner from './PromoBanner';
import Testimonials from './Testimonials';

const HomePage = () => {
  return (
    <DefaultLayout mainClassName="bg-background relative pt-20">
      <HeroBanner />
      <Features />
      <ProductSection />
      <PromoBanner />
      <Testimonials />
    </DefaultLayout>
  );
};

export default HomePage;
