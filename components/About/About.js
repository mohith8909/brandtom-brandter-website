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
                        <FadeIn delay={0.2} tag="span" className={styles.subHeading}>Who We Are</FadeIn>
                        <FadeIn delay={0.3} tag="h2" className={styles.heading}>Brandtom & Brandter</FadeIn>

                        <div className={styles.definitions}>
                            <FadeIn delay={0.4} className={styles.defItem}>
                                <h3>Brandtom (Brand + Atom)</h3>
                                <p>Every idea starts with a spark as tiny as an atom, and so does our level of thinking when it comes to delivering a successful campaign.</p>
                            </FadeIn>
                            <FadeIn delay={0.5} className={styles.defItem}>
                                <h3>Brandter (Brand + Matter)</h3>
                                <p>Every successful campaign ends when the idea has been delivered to its fullest potential — the final form is matter, and we make sure it does.</p>
                            </FadeIn>
                        </div>

                        <div className={styles.missionVision}>
                            <FadeIn delay={0.6} className={styles.mvItem}>
                                <h4>Our Mission</h4>
                                <p>Our mission is to transform ideas into impactful realities, guiding brands from the spark of inspiration to the final expression that connects, engages, and endures. We craft end-to-end marketing strategies and solutions that merge creativity with precision, ensuring every idea finds its full form and every message finds its meaning.</p>
                            </FadeIn>
                            <FadeIn delay={0.7} className={styles.mvItem}>
                                <h4>Our Vision</h4>
                                <p>To lead a new era of brand evolution—where ideas are limitless, creativity is strategic, and every expression leaves a lasting mark on culture.</p>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
