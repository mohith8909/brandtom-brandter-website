import styles from './ContactInfo.module.css';
import FadeIn from '../UI/FadeIn';
import { MessageCircle } from 'lucide-react';

export default function ContactInfo() {
    return (
        <section className={styles.infoSection}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.leftCol}>
                        <FadeIn tag="span" className={styles.subHeading} delay={0.2}>Get in touch</FadeIn>
                        <FadeIn tag="h2" className={styles.tagline} delay={0.3}>
                            LET'S TRANSFORM YOUR THOUGHTS INTO IMPACT.
                        </FadeIn>
                        <FadeIn tag="p" className={styles.description} delay={0.4}>
                            Every great movement begins with a single spark. Whether you are looking for a core strategy, digital architecture, or a full-scale creative campaign, our team is ready to guide your brand's evolution from ideation to impact.
                        </FadeIn>
                    </div>

                    <div className={styles.rightCol}>
                        <FadeIn className={styles.infoBlock} delay={0.5}>
                            <h4 className={styles.infoTitle}>Address</h4>
                            <p className={styles.infoText}>No 2A MP Avenue, Abussali street Saligramam , Chennai -600093.</p>
                        </FadeIn>

                        <FadeIn className={styles.infoBlock} delay={0.6}>
                            <h4 className={styles.infoTitle}>Contact Details</h4>
                            <a href="mailto:contactus@brandtomandbrandter.com" className={styles.link}>
                                contactus@brandtomandbrandter.com
                            </a>
                            <a href="tel:+919585050047" className={styles.link}>
                                +91 95850 50047
                            </a>
                            <a
                                href="https://wa.me/919585050047?text=Hi%20Brandtom%20%26%20Brandter%2C%20I%20would%20like%20to%20discuss%20a%20project."
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.link} ${styles.whatsappLink}`}
                                style={{ marginTop: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#25D366' }}
                            >
                                <MessageCircle size={20} /> Chat on WhatsApp
                            </a>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}
