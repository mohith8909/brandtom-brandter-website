import styles from './Expertise.module.css';
import Image from 'next/image';
import Marquee from '../Marquee/Marquee';
import FadeIn from '../UI/FadeIn';

export default function Expertise() {
    return (
        <section className={styles.expertise} id="consulting">
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.content}>
                        <FadeIn delay={0.2} tag="h2" className={styles.heading}>
                            Our consulting team drives your <span className={styles.highlight}>success</span>.
                        </FadeIn>
                        <FadeIn delay={0.3} tag="p" className={styles.description}>
                            Our collective of thinkers and creators doesn't just consult; we collaborate. By aligning deep market insights with high-precision execution, we build the frameworks that turn your brand's potential into sustainable, long-term commercial impact.
                        </FadeIn>

                        <FadeIn delay={0.4} className={styles.resultBox}>
                            <span className={styles.resultTitle}>The Result: Enduring Loyalty</span>
                            <p className={styles.resultText}>
                                We craft insight-driven campaigns, compelling content, and immersive brand experiences that go beyond capturing attention to create profound meaning, drive measurable engagement, and cultivate unwavering, long-term loyalty.
                            </p>
                        </FadeIn>
                    </div>

                    <div className={styles.imageWrapper}>
                        <Image
                            src="/assets/quantum-img-28-copyright-410x230.jpg"
                            alt="Expertise"
                            width={600}
                            height={400}
                            className={styles.image}
                        />
                    </div>
                </div>
            </div>
            <Marquee />
        </section>
    );
}
