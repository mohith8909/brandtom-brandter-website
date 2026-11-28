"use client";
import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Magnetic from '../Motion/Magnetic';
import ServicesMenu from './ServicesMenu';
import MobileMenu from './MobileMenu';
import { PAGES, CONTACT } from '../site';

const Roll = ({ children }) => (
    <span className="roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>
);

export default function Header() {
    const pathname = usePathname();
    // The page you are on is marked for sighted users (a hexagon) and screen readers (aria-current)
    const current = (item) => item.page === pathname;
    const [isVisible, setIsVisible] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const lastScrollY = useRef(0);
    const menuButton = useRef(null);

    const closeMenu = () => setIsMenuOpen(false);

    // Hide the header while scrolling down, show it again on the way up
    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            if (document.documentElement.style.overflow === 'hidden') return; // phone menu open
            if (y < 10) setIsVisible(true);
            else if (y > lastScrollY.current) setIsVisible(false);
            else setIsVisible(true);
            lastScrollY.current = y;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // A new page closes the phone menu
    useEffect(() => { setIsMenuOpen(false); }, [pathname]);

    return (
        <header className={`${styles.header} ${!isVisible ? styles.headerHidden : ''} ${isMenuOpen ? styles.menuIsOpen : ''}`}>
            <div className={styles.leftGroup}>
                <div className={styles.logoContainer}>
                    <Link href="/" aria-label="Brandtom & Brandter, home" onClick={closeMenu}>
                        <Image
                            src="/assets/opt/brandtom-logo.webp"
                            alt="Brandtom & Brandter"
                            width={280}
                            height={89}
                            className={styles.logo}
                            priority
                        />
                    </Link>
                </div>

                <nav className={styles.nav} aria-label="Main">
                    {PAGES.map((item) => {
                        const link = (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${current(item) ? styles.active : ''}`}
                                aria-current={current(item) ? 'page' : undefined}
                            >
                                <Roll>{item.label}</Roll>
                            </Link>
                        );
                        return item.hasServices
                            ? <ServicesMenu key={item.href} link={link} hidden={!isVisible} />
                            : link;
                    })}
                </nav>
            </div>

            <div className={styles.rightGroup}>
                <a href={CONTACT.tel} className={styles.phone}>{CONTACT.phone}</a>
                <Magnetic className={styles.ctaMagnet}>
                    <Link href="/contact-us" className={styles.ctaButton} onClick={closeMenu}><Roll>Let&apos;s Talk</Roll></Link>
                </Magnetic>
                <a href={CONTACT.tel} className={styles.mobilePhone} aria-label={`Call us on ${CONTACT.phone}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z" />
                    </svg>
                </a>
                <button
                    ref={menuButton}
                    type="button"
                    className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}
                    onClick={() => setIsMenuOpen((open) => !open)}
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            <MobileMenu
                open={isMenuOpen}
                onClose={closeMenu}
                menuButton={menuButton}
                pathname={pathname}
                onOpenChange={() => setIsVisible(true)}
            />
        </header>
    );
}
