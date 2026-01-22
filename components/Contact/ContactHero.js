import styles from './ContactHero.module.css';
import FadeIn from '../UI/FadeIn';

export default function ContactHero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.content}>
                    <FadeIn tag="h1" className={styles.title}>Contact Us</FadeIn>
                </div>
                <div className={styles.scrollDown}>
                    <div className={styles.arrow}></div>
                </div>
            </div>
        </section>
    );
}
