import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ContactHero from '@/components/Contact/ContactHero';
import ContactInfo from '@/components/Contact/ContactInfo';
import ContactMap from '@/components/Contact/ContactMap';

export default function ContactPage() {
    return (
        <main>
            <Header />
            <ContactHero />
            <ContactInfo />
            <ContactMap />
            <Footer hideCta={true} />
        </main>
    );
}
