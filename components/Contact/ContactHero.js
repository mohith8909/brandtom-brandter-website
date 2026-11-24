import styles from './ContactHero.module.css';
import SplitReveal from '../Motion/SplitReveal';

export default function ContactHero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.content}>
                    <SplitReveal tag="h1" className={styles.title} onLoad>Contact Us</SplitReveal>
                </div>
                <div className={styles.scrollDown}>
                    <div className={styles.arrow}></div>
                </div>
            </div>
        </section>
    );
}
