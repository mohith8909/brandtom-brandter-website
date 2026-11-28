import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './not-found.module.css';

export const metadata = {
    title: 'Page not found | Brandtom & Brandter',
    robots: { index: false },
};

export default function NotFound() {
    return (
        <main id="main-content" className={styles.main}>
            <Header />
            <section className={styles.hero}>
                <div className={styles.hexes} aria-hidden="true">
                    <span /><span /><span /><span /><span />
                </div>
                <p className={styles.code}>404</p>
                <h1 className={styles.title}>This idea hasn’t taken shape yet.</h1>
                <p className={styles.text}>
                    The page you’re looking for doesn’t exist or has moved. Let’s get you somewhere that matters.
                </p>
                <div className={styles.links}>
                    <Link href="/" className={styles.primary}>Back to home</Link>
                    <Link href="/services" className={styles.ghost}>Our services</Link>
                    <Link href="/contact-us" className={styles.ghost}>Contact us</Link>
                </div>
            </section>
            <Footer hideCta />
        </main>
    );
}
