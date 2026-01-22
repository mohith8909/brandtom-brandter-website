import styles from './About.module.css';
import Image from 'next/image';
import FadeIn from '../UI/FadeIn';

export default function About() {
    return (
        <section className={styles.about} id="about">
            <div className="container">
                <div className={styles.contentWrapper}>
                    <div className={styles.imageCol}>
                        <Image
                            src="/assets/new/about_team_1769107718949.png"
                            alt="Our Philosophy"
                            fill
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.textCol}>
                        <FadeIn delay={0.2} tag="span" className={styles.subHeading}>The Story</FadeIn>
                        <FadeIn delay={0.3} tag="h2" className={styles.heading}>Where Vision Meets Reality</FadeIn>
                        <FadeIn delay={0.4} tag="p" className={styles.description}>
                            Brandtom & Brandter was born from a simple belief: that every great movement begins with a small, powerful thought. We are the bridge between that initial spark and the final, tangible impact.
                        </FadeIn>
                        <FadeIn delay={0.5} tag="p" className={styles.description}>
                            We don't just dream up ideas; we give them the weight and substance they need to move the world.
                        </FadeIn>

                        <div className={styles.stats}>
                            <FadeIn delay={0.6} className={styles.statItem}>
                                <h4>360°</h4>
                                <span>Strategic Architecture</span>
                            </FadeIn>
                            <FadeIn delay={0.7} className={styles.statItem}>
                                <h4>The Bridge</h4>
                                <span>From Concept to Expression</span>
                            </FadeIn>
                            <FadeIn delay={0.8} className={styles.statItem}>
                                <h4>Impact</h4>
                                <span>Psychology-Driven</span>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
