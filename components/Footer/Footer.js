'use client';
import { Instagram, Facebook, Linkedin, ArrowUp } from 'lucide-react';
import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import LetsTalk from './LetsTalk';
import { PAGES, SERVICES, SOCIALS, CONTACT, serviceHref } from '../site';

const SOCIAL_ICONS = { Instagram, Facebook, LinkedIn: Linkedin };

/*
 * Footer: the "Let's talk" finale (optional), then a site map, so whoever reaches the
 * bottom of any page can go anywhere from there: company pages, every service,
 * every way to get in touch, and back to the top.
 */
export default function Footer({ hideCta = false }) {
    const toTop = () => {
        if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        // keyboard users go back to the top too
        const h1 = document.querySelector('main h1');
        if (h1) { if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    };

    return (
        <footer className={styles.footer} id="contact">
            {!hideCta && <LetsTalk />}

            <div className={`container ${styles.mapWrap}`}>
                <div className={styles.map}>
                    <div className={styles.brand}>
                        <p className={styles.brandName}>Brandtom &amp; Brandter</p>
                        <p className={styles.tagline}>From Thoughts to Impact.</p>
                        <address className={styles.address}>{CONTACT.address}</address>
                        <div className={styles.recognition}>
                            <span className={styles.recognitionLabel}>Recognised by</span>
                            <Image
                                src="/assets/opt/dpiit-startup-india.webp"
                                alt="DPIIT Startup India recognised startup"
                                width={480}
                                height={177}
                                className={styles.recognitionLogo}
                            />
                        </div>
                    </div>

                    <nav className={styles.col} aria-labelledby="footer-company">
                        <h2 id="footer-company" className={styles.colTitle}>Company</h2>
                        <ul>
                            {PAGES.map((p) => (
                                <li key={p.href}><Link href={p.href} className={styles.link}>{p.label}</Link></li>
                            ))}
                        </ul>
                    </nav>

                    <nav className={styles.col} aria-labelledby="footer-services">
                        <h2 id="footer-services" className={styles.colTitle}>Services</h2>
                        <ul>
                            {SERVICES.map((s) => (
                                <li key={s.slug}>
                                    <Link href={serviceHref(s.slug)} className={styles.link} style={{ '--c': s.color }}>{s.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.col}>
                        <h2 className={styles.colTitle}>Connect</h2>
                        <ul>
                            <li><a href={CONTACT.tel} className={styles.link}>{CONTACT.phone}</a></li>
                            <li><a href={`mailto:${CONTACT.email}`} className={`${styles.link} ${styles.email}`}>{CONTACT.email}</a></li>
                            <li><a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.link}>WhatsApp us</a></li>
                        </ul>
                        <div className={styles.socials}>
                            {SOCIALS.map((s) => {
                                const Icon = SOCIAL_ICONS[s.label];
                                return (
                                    <a key={s.label} href={s.href} className={styles.socialLink} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                                        <Icon size={20} aria-hidden="true" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className={styles.bar}>
                    <p className={styles.copy}>
                        © {new Date().getFullYear()} {CONTACT.company} · Made in Chennai
                    </p>
                    <button type="button" className={styles.toTop} onClick={toTop}>
                        Back to top <ArrowUp size={16} aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className={styles.wordmark} aria-hidden="true">BRANDTOM &amp; BRANDTER</div>
        </footer>
    );
}
