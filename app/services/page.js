import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';
import FadeIn from '@/components/UI/FadeIn';

export const metadata = {
    title: "Our Services | Brandtom & Brandter",
    description: "Explore our full range of marketing solutions, from creative campaigns to digital architecture.",
};

export default function ServicesPage() {
    const services = [
        {
            id: "01.",
            title: "Creative Campaigns",
            desc: "Designing and executing full-scale marketing campaigns that capture attention and drive engagement."
        },
        {
            id: "02.",
            title: "Brand Strategy & Ideation",
            desc: "Crafting the core strategy, positioning, and innovative ideas that define your brand’s purpose."
        },
        {
            id: "03.",
            title: "Content & Communication",
            desc: "Developing your brand’s voice through compelling copywriting, messaging, and brand communication."
        },
        {
            id: "04.",
            title: "Digital Marketing",
            desc: "Helping brands reach the right audience online through targeted ads, social media, SEO, and tools to boost visibility, drive engagement, and deliver measurable business growth."
        },
        {
            id: "05.",
            title: "Graphic Designing",
            desc: "Creating visual content that communicates ideas clearly and attractively, ensuring visual impact and effective communication."
        },
        {
            id: "06.",
            title: "Content Production",
            desc: "Creating engaging ad films, videos, product shots, and social media content that tell your brand’s story and drive audience engagement across platforms."
        },
        {
            id: "07.",
            title: "Brand Communication",
            desc: "Our brand communication service refines your brand’s voice, narration, and visual language to create meaningful connections with your target audience. We translate your values into simple stories that inspire trust and long-term loyalty."
        }
    ];

    return (
        <main className={styles.main}>
            <Header />

            <section className={styles.titleSection}>
                <div className="container">
                    <FadeIn tag="h1" className={styles.heading}>Our Services</FadeIn>
                    <FadeIn tag="p" className={styles.subHeading} delay={0.2}>
                        End-to-end marketing solutions tailored to transform your vision into impact.
                    </FadeIn>
                </div>
            </section>

            <section className={styles.servicesSection}>
                <div className="container">
                    <div className={styles.servicesList}>
                        {services.map((service, index) => (
                            <FadeIn key={index} className={styles.serviceRow} delay={index * 0.1}>
                                <div className={styles.serviceHeader}>
                                    <span className={styles.serviceNumber}>{service.id}</span>
                                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                                </div>
                                <div className={styles.serviceBody}>
                                    <p className={styles.serviceDesc}>{service.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.partnershipSection}>
                <div className="container">
                    <FadeIn delay={0.2}>
                        <span className={styles.label}>OUR PARTNERSHIP</span>
                        <h2 className={styles.partnershipHeading}>The collective driving your growth</h2>
                    </FadeIn>
                </div>
            </section>

            <section className={styles.howWeHelpSection}>
                <div className="container">
                    <FadeIn delay={0.2}>
                        <span className={styles.label}>how we help</span>
                        <h2 className={styles.sectionHeading}>Empowering Brands Through Strategic Evolution</h2>
                        <div className={styles.descriptionBlock}>
                            <p>We are a full-spectrum marketing collective that operates at the intersection of psychology and precision. Our mission is to move your most ambitious ideas from a microscopic spark into a substantial market reality.</p>
                            <p>We don’t just deliver services; we build enduring connections that leave a lasting mark on culture. By blending creative intuition with scientific clarity, we ensure every message is built to resonate deeply and perform powerfully.</p>
                        </div>
                    </FadeIn>

                    <div className={styles.featuresGrid}>
                        <FadeIn className={styles.featureCard} delay={0.3}>
                            <h3>Creative Ideation & Strategy</h3>
                            <p>We start with the "Spark"—decoding audience behavior to build a logical framework wrapped in a narrative that makes your brand’s purpose undeniable.</p>
                        </FadeIn>
                        <FadeIn className={styles.featureCard} delay={0.4}>
                            <h3>Digital Architecture & Design</h3>
                            <p>We build the final "Expression," creating visual content and digital environments that communicate ideas clearly, ensuring maximum visual impact and seamless communication.</p>
                        </FadeIn>
                        <FadeIn className={styles.featureCard} delay={0.5}>
                            <h3>Complete Brand Execution</h3>
                            <p>We bring the idea to its fullest potential—the "Matter"—through high-end content production, ad films, and targeted digital marketing that delivers measurable growth.</p>
                        </FadeIn>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
