import Hero from '@/components/Hero';
import ProductPreview from '@/components/ProductPreview';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import AppPagesSection from '@/components/AppPagesSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductPreview />
      <HowItWorks />
      <Features />
      <AppPagesSection />
      <Footer />
    </main>
  );
}
