import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import HeroBanner from './ui/HeroBanner';
import ProductSection from './ui/ProductSection';
import PromoBanner from './ui/PromoBanner';
import Features from './ui/Features';
import Testimonials from './ui/Testimonials';

import { Fragment } from 'react';

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
