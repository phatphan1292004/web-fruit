import Layout from '../../../components/layout/layout';
import HeroSection from './HeroSection';
import StorySection from './StorySection';
import MissionVision from './MissionVision';
import WhyChooseUs from './WhyChooseUs';
import FarmQuality from './FarmQuality';
import StatisticsSection from './StatisticsSection';
import Testimonials from './Testimonials';
import CTASection from './CTASection';

const AboutPage = () => {
  return (
    <Layout mainClassName="bg-gradient-to-b from-emerald-50 via-white to-orange-50">
      <HeroSection />
      <StorySection />
      <MissionVision />
      <WhyChooseUs />
      <FarmQuality />
      <StatisticsSection />
      <Testimonials />
      <CTASection />
    </Layout>
  );
};

export default AboutPage;
