import styles from './Services.module.css';
import Image from 'next/image';
import Link from 'next/link';
import FadeIn from '../UI/FadeIn';

export default function Services() {
    const services = [
        {
            title: "Digital Architecture",
            desc: "“Where Design Meets Performance.” We don’t just build websites; we create digital destinations. By merging high-end aesthetics with seamless functionality, we transform your online presence into a powerful engine for growth.",
            bg: "/assets/quantum-img-1-copyright.jpg"
        },
        {
            title: "The Spark",
            desc: "“Strategies That Stick.” Every breakthrough begins with a single insight. We dive deep into your brand’s DNA to craft the positioning, voice, and visionary concepts that set you apart in a crowded market.",
            bg: "/assets/quantum-img-3-copyright.jpg"
        },
        {
            title: "Complete Execution",
            desc: "“Vision Brought to Life.” From cinematic ad films to global digital campaigns, we handle the heavy lifting. We bridge the gap between “what if” and “what is,” delivering high-impact results with surgical precision.",
            bg: "/assets/quantum-img-33-copyright-890x664.jpg"
        }
    ];

    return (
        <section className={styles.services} id="services">
            <div className="container">
                <FadeIn tag="h2" className={styles.heading}>The Core Pillars</FadeIn>
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
                            <Link href="/contact-us" className={styles.cardLink}>Learn More</Link>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
