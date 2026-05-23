import Layout from '../../../components/layout/layout';
import HeroSection from './HeroSection';
import ContactInfoCards from './ContactInfoCards';
import ContactForm from './ContactForm';
import GoogleMapSection from './GoogleMapSection';
import FAQSection from './FAQSection';
import SocialMediaSection from './SocialMediaSection';
import CTASection from './CTASection';

const ContactPage = () => {
  return (
    <Layout mainClassName="bg-gradient-to-b from-emerald-50 via-white to-orange-50">
      <HeroSection />

      <ContactInfoCards />

      <section className="px-4 md:px-8 py-12">
        <div className="container mx-auto grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
          <ContactForm />
          <GoogleMapSection />
        </div>
      </section>

      <FAQSection />
      <SocialMediaSection />
      <CTASection />
    </Layout>
  );
};

export default ContactPage;
