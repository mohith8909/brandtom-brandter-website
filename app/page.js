import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import ServicesList from '@/components/ServicesList/ServicesList';
import Work from '@/components/Work/Work';
import Manifesto from '@/components/Manifesto/Manifesto';
import AtomMatter from '@/components/AtomMatter/AtomMatter';
import Process from '@/components/Process/Process';
import WhyUs from '@/components/WhyUs/WhyUs';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <main id="main-content">
      <Header />
      <Hero />
      <ServicesList />
      <Work />
      <Manifesto />
      <AtomMatter />
      <Process />
      <WhyUs />
      <Footer />
    </main>
  );
}
