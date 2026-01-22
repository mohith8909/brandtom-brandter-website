import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import Services from '@/components/Services/Services';
import About from '@/components/About/About';
import Approach from '@/components/Approach/Approach';
import Footer from '@/components/Footer/Footer';
import PartnerSlider from '@/components/PartnerSlider/PartnerSlider';
import Expertise from '@/components/Expertise/Expertise';
import Marquee from '@/components/Marquee/Marquee';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      {/* <PartnerSlider /> */}
      <Marquee />
      <Services />
      <About />
      <Expertise />
      <Approach />
      <Footer />
    </main>
  );
}
