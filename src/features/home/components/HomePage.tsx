import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { Fragment } from 'react';
import HeroBanner from './HeroBanner';
import Features from './Features';
import ProductSection from './ProductSection';
import PromoBanner from './PromoBanner';
import Testimonials from './Testimonials';

const HomePage = () => {
  return (
    <Fragment>
      <Header />
      <main className="flex-1 w-full bg-background relative pt-20">
        <HeroBanner />
        <Features />
        <ProductSection />
        <PromoBanner />
        <Testimonials />
      </main>
      <Footer />
    </Fragment>
  );
};

export default HomePage;
