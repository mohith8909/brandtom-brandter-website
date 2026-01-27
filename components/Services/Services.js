import styles from './Services.module.css';
import Image from 'next/image';
import Link from 'next/link';
import FadeIn from '../UI/FadeIn';

export default function Services() {
    const services = [
        {
            title: "Digital Architecture",
            desc: "“Where Design Meets Performance.” We don’t just build websites; we create digital destinations. By merging high-end aesthetics with seamless functionality, we transform your online presence into a powerful engine for growth.",
            bg: "/assets/new/services_digital_arch_1769107669538.png"
        },
        {
            title: "The Spark",
            desc: "“Strategies That Stick.” Every breakthrough begins with a single insight. We dive deep into your brand’s DNA to craft the positioning, voice, and visionary concepts that set you apart in a crowded market.",
            bg: "/assets/new/services_spark_1769107685292.png"
        },
        {
            title: "Complete Execution",
            desc: "“Vision Brought to Life.” From cinematic ad films to global digital campaigns, we handle the heavy lifting. We bridge the gap between “what if” and “what is,” delivering high-impact results with surgical precision.",
            bg: "/assets/new/services_production_1769107701682.png"
        }
    ];

    return (
        <section className={styles.services} id="services">
            <div className="container">
                {/* <FadeIn tag="h2" className={styles.heading}>The Core Pillars</FadeIn>
                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <FadeIn key={index} delay={index * 0.15} className={styles.card}>
                            <Image
                                src={service.bg}
                                alt={service.title}
                                fill
                                className={styles.cardBackground}
                            />
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            <p className={styles.cardDesc}>{service.desc}</p>
                            <Link href="/services" className={styles.cardLink}>Learn More</Link>
                        </FadeIn>
                    ))}
                </div> */}

                <div className={styles.ctaSection}>
                    <Image
                        src="/assets/new/services_cta_background.png"
                        alt="Background"
                        fill
                        className={styles.ctaBackground}
                        quality={90}
                    />
                    <FadeIn>
                        <h2 className={styles.ctaHeading}>Transforming Ideas into Impact</h2>
                        <p className={styles.ctaText}>
                            Explore our comprehensive suite of services designed to elevate your brand.
                        </p>
                        <Link href="/services" className={styles.ctaButton}>
                            View Our Services
                        </Link>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
