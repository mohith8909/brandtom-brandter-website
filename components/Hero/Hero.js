import styles from './Hero.module.css';
import Image from 'next/image';
import FadeIn from '../UI/FadeIn';

export default function Hero() {
    return (
        <section className={styles.hero} id="home">
            {/* Collage Images */}
            {/* Top Left - Creative Director */}
            <div className={`${styles.collageImage} ${styles.imgTopLeft}`}>
                <Image src="/assets/new/hero_creative_director_1769107562116.png" alt="Creative Strategy" fill style={{ objectFit: 'cover' }} />
            </div>

            {/* Top Right - Modern Office */}
            <div className={`${styles.collageImage} ${styles.imgTopRight}`}>
                <Image src="/assets/new/hero_modern_office_1769107598640.png" alt="Modern Agency" fill style={{ objectFit: 'cover' }} />
            </div>

            {/* Bottom Left - Designer Sketch */}
            <div className={`${styles.collageImage} ${styles.imgBottomLeft}`}>
                <Image src="/assets/new/hero_designer_sketch_1769107615839.png" alt="Creative Process" fill style={{ objectFit: 'cover' }} />
            </div>

            {/* Bottom Right - Digital Tech */}
            <div className={`${styles.collageImage} ${styles.imgBottomRight}`}>
                <Image src="/assets/new/hero_digital_tech_1769107581068.png" alt="Digital Innovation" fill style={{ objectFit: 'cover' }} />
            </div>

            {/* Extra Side Image - Abstract Art */}
            <div className={`${styles.collageImage} ${styles.imgExtra}`}>
                <Image src="/assets/new/hero_abstract_art_1769107632040.png" alt="Artistic Vision" fill style={{ objectFit: 'cover' }} />
            </div>

            <div className={styles.content}>
                <h1 className={styles.title}>
                    <FadeIn delay={0.2} tag="span" className={styles.titleLine}>Marketing</FadeIn>
                    <FadeIn delay={0.4} tag="span" className={styles.titleLine}>Solutions</FadeIn>
                    <FadeIn delay={0.6} tag="span" className={styles.titleLine}>Agency</FadeIn>
                </h1>
                <FadeIn delay={0.8} tag="p" className={styles.subtitle}>
                    From thoughts to impact
                </FadeIn>
            </div>

            <div className={styles.scrollDown}>
                <div className={styles.arrow}></div>
            </div>
        </section>
    );
}
