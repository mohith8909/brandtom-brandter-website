"use client";
import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import Image from 'next/image';
import Magnetic from '../Motion/Magnetic';

const Roll = ({ children }) => (
    <span className="roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>
);

export default function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const lastScrollY = useRef(0);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show if near top
            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY.current) {
                // Scrolling DOWN - Hide
                setIsVisible(false);
            } else {
                // Scrolling UP - Show
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${styles.header} ${!isVisible ? styles.headerHidden : ''}`}>
            <div className={styles.leftGroup}>
                <div className={styles.logoContainer}>
                    <Link href="/">
                        <Image
                            src="/assets/cropped-Brandtom.-Logo.svgtransparent.png"
                            alt="Brandtom & Brandter"
                            width={280}
                            height={85}
                            className={styles.logo}
                            priority
                        />
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <Link href="/#home" className={styles.navLink}><Roll>Home</Roll></Link>
                    <Link href="/#about" className={styles.navLink}><Roll>About Us</Roll></Link>
                    <Link href="/services" className={styles.navLink}><Roll>Our Services</Roll></Link>
                    <Link href="/contact-us" className={styles.navLink}><Roll>Contact Us</Roll></Link>
                </nav>
            </div>

            <div className={styles.rightGroup}>
                <a href="tel:+919585050047" className={styles.phone}>+91 95850 50047</a>
                <Magnetic className={styles.ctaMagnet}>
                    <Link href="/contact-us" className={styles.ctaButton}><Roll>Let's Talk</Roll></Link>
                </Magnetic>
                <a href="tel:+919585050047" className={styles.mobilePhone} aria-label="Call Us">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z" />
                    </svg>
                </a>
                <button
                    className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.menuOpen : ''}`}>
                <nav className={styles.mobileNav}>
                    <Link href="/#home" className={styles.mobileLink} onClick={toggleMenu}>Home</Link>
                    <Link href="/#about" className={styles.mobileLink} onClick={toggleMenu}>About Us</Link>
                    <Link href="/services" className={styles.mobileLink} onClick={toggleMenu}>Our Services</Link>
                    <Link href="/contact-us" className={styles.mobileLink} onClick={toggleMenu}>Contact Us</Link>
                </nav>
            </div>
        </header>
    );
}
