import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ContactHero from '@/components/Contact/ContactHero';
import ContactInfo from '@/components/Contact/ContactInfo';
import ContactMap from '@/components/Contact/ContactMap';

export const metadata = {
    title: "Contact Us | Brandtom & Brandter",
    description: "Get in touch with Brandtom & Brandter in Chennai. Email, call or WhatsApp us to start your brand's next chapter.",
};

export default function ContactPage() {
    return (
        <main id="main-content">
            <Header />
            <ContactHero />
            <ContactInfo />
            <ContactMap />
            <Footer hideCta={true} />
        </main>
    );
}
