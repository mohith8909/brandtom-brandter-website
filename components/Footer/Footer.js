'use client';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import LetsTalk from './LetsTalk';

export default function Footer({ hideCta = false }) {
    return (
        <footer className={styles.footer} id="contact">
            {!hideCta && <LetsTalk />}

            <div className={`container ${styles.bottomWrap}`}>
                <div className={styles.bottom}>
                    <div className={styles.contactInfo}>
                        <h4>Brandtom & Brandter</h4>
                        <p>2 A, M P Avenue, Abbusali St, Saligramam, Chennai, Tamil Nadu 600093</p>
                        <p><a href="mailto:contactus@brandtomandbrandter.com" className={styles.contactLink}>contactus@brandtomandbrandter.com</a></p>
                        <p><a href="tel:+919585050047" className={styles.contactLink}>+91 95850 50047</a></p>
                    </div>
                    <div className={styles.recognition}>
                        <span className={styles.recognitionLabel}>Recognised by</span>
                        <Image
                            src="/assets/dpiit-startup-india.png"
                            alt="DPIIT Startup India recognised startup"
                            width={1212}
                            height={446}
                            className={styles.recognitionLogo}
                        />
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

            <div className={styles.wordmark} aria-hidden="true">BRANDTOM &amp; BRANDTER</div>
        </footer>
    );
}
