import { Instagram, Facebook, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer({ hideCta = false }) {
    return (
        <footer className={styles.footer} id="contact">
            <div className="container">
                {!hideCta && (
                    <div className={styles.ctaSection}>
                        <h2 className={styles.ctaHeading}>Your Brand’s Next Chapter</h2>
                        <p className={styles.ctaSub}>
                            Have questions? Get in touch! Every great movement begins with a single spark. Whether you are looking for a core strategy, digital architecture, or a full-scale creative campaign, our team is ready to guide your brand's evolution from ideation to impact.
                        </p>
                        <Link href="/contact-us" className={`btn-primary ${styles.mainBtn}`}>Start Your Brand Experiment</Link>
                    </div>
                )}

                <div className={styles.bottom}>
                    <div className={styles.contactInfo}>
                        <h4>Brandtom & Brandter</h4>
                        <p>2 A, M P Avenue, Abbusali St, Saligramam, Chennai, Tamil Nadu 600093</p>
                        <p>contactus@brandtomandbrandter.com</p>
                        <p>+91 95850 50047</p>
                    </div>
                    <div className={styles.socials}>
                        <a href="https://www.instagram.com/brandtom_brandter?igsh=MWgzNzEyYTN5Nmxqbg==" className={styles.socialLink} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                            <Instagram size={24} />
                        </a>
                        <a href="https://www.facebook.com/share/17J73h24vn/" className={styles.socialLink} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                            <Facebook size={24} />
                        </a>
                        <a href="https://www.linkedin.com/company/brandom-brandter/" className={styles.socialLink} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                            <Linkedin size={24} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
