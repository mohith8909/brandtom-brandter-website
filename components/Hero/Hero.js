import styles from './Hero.module.css';
import Image from 'next/image';
import FadeIn from '../UI/FadeIn';

export default function Hero() {
    return (
        <section className={styles.hero} id="home">
            {/* Collage Images */}
            {/* Top Left - Using placeholder '1-1' */}
            <div className={`${styles.collageImage} ${styles.imgTopLeft}`}>
                <Image src="/assets/hero/261_1-1-copyright1.jpg" alt="Creative" fill style={{ objectFit: 'cover' }} />
            </div>

            {/* Top Right - Using placeholder '1-2' */}
            <div className={`${styles.collageImage} ${styles.imgTopRight}`}>
                <Image src="/assets/hero/261_1-2-copyright1.jpg" alt="City" fill style={{ objectFit: 'cover' }} />
            </div>

            {/* Bottom Left - Using placeholder '1-3' */}
            <div className={`${styles.collageImage} ${styles.imgBottomLeft}`}>
                <Image src="/assets/hero/261_1-3-copyright1.jpg" alt="Architecture" fill style={{ objectFit: 'cover' }} />
            </div>

            {/* Bottom Right - Using placeholder '1-4' */}
            <div className={`${styles.collageImage} ${styles.imgBottomRight}`}>
                <Image src="/assets/hero/261_1-4-copyright1.jpg" alt="Lifestyle" fill style={{ objectFit: 'cover' }} />
            </div>

            {/* Extra Side Image - '1-6' */}
            <div className={`${styles.collageImage} ${styles.imgExtra}`}>
                <Image src="/assets/hero/261_1-6-copyright1.jpg" alt="Abstract" fill style={{ objectFit: 'cover' }} />
            </div>

            <div className={styles.content}>
                <h1 className={styles.title}>
                    <FadeIn delay={0.2} tag="span" className={styles.titleLine}>Marketing</FadeIn>
                    <FadeIn delay={0.4} tag="span" className={styles.titleLine}>Solutions</FadeIn>
                    <FadeIn delay={0.6} tag="span" className={styles.titleLine}>Agency</FadeIn>
                </h1>
                <FadeIn delay={0.8} tag="p" className={styles.subtitle}>
                    Marketing, Development, Design
                </FadeIn>
            </div>

            <div className={styles.scrollDown}>
                <div className={styles.arrow}></div>
            </div>
        </section>
    );
}
