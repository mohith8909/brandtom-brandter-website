'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import styles from './MobileMenu.module.css';
import { PAGES, SERVICES, SOCIALS, CONTACT, serviceHref } from '../site';

const SOCIAL_ICONS = { Instagram, Facebook, LinkedIn: Linkedin };

/*
 * Full-screen menu for phones and tablets (the header shows it below 1200px).
 *
 * Big numbered page links, the eight services, a "Start a project" button and one-tap
 * call / WhatsApp / email, then socials. While it is open the page behind is frozen and
 * inert, Tab cycles inside the menu (plus the close button), and Escape closes it and
 * returns focus to the menu button.
 */
export default function MobileMenu({ open, onClose, menuButton, pathname, onOpenChange }) {
    const panel = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        onOpenChange?.();
        window.__lenis?.stop();
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.classList.add('menu-open'); // e.g. hides the floating WhatsApp button
        const main = document.getElementById('main-content');
        // Everything else on the page is out of reach while the menu is open
        const siblings = main ? [...main.children].filter((el) => el.tagName !== 'HEADER') : [];
        siblings.forEach((el) => el.setAttribute('inert', ''));

        const focusables = () => [
            menuButton.current,
            ...panel.current.querySelectorAll('a[href], button'),
        ].filter(Boolean);

        const onKey = (e) => {
            if (e.key === 'Escape') {
                onClose();
                menuButton.current?.focus();
                return;
            }
            if (e.key !== 'Tab') return;
            // Keep Tab inside the menu
            const list = focusables();
            const i = list.indexOf(document.activeElement);
            if (e.shiftKey && (i <= 0)) { e.preventDefault(); list[list.length - 1].focus(); }
            else if (!e.shiftKey && i === list.length - 1) { e.preventDefault(); list[0].focus(); }
        };
        window.addEventListener('keydown', onKey);
        // Keyboard users land in the menu they just opened, not behind it
        const t = setTimeout(() => panel.current?.querySelector('a[href]')?.focus({ preventScroll: true }), 50);

        return () => {
            clearTimeout(t);
            window.removeEventListener('keydown', onKey);
            siblings.forEach((el) => el.removeAttribute('inert'));
            document.documentElement.style.overflow = '';
            document.documentElement.classList.remove('menu-open');
            if (window.__bbIntroDone) window.__lenis?.start();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const current = (item) => item.page === pathname;

    return (
        <div
            id="mobile-menu"
            ref={panel}
            className={`${styles.menu} ${open ? styles.open : ''}`}
            inert={!open}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
        >
            <div className={styles.glow} aria-hidden="true" />
            <div className={styles.scroll}>
                <nav aria-label="Pages">
                    <ol className={styles.pages}>
                        {PAGES.map((item, i) => (
                            <li key={item.href} style={{ '--i': i }}>
                                <Link
                                    href={item.href}
                                    className={`${styles.page} ${current(item) ? styles.active : ''}`}
                                    aria-current={current(item) ? 'page' : undefined}
                                    onClick={onClose}
                                >
                                    <span className={styles.num} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                                    <span className={styles.label}>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ol>
                </nav>

                <nav aria-label="Services" className={styles.servicesBlock} style={{ '--i': 4 }}>
                    <span className={styles.kicker}>Services</span>
                    <ul className={styles.services}>
                        {SERVICES.map((s) => (
                            <li key={s.slug}>
                                <Link href={serviceHref(s.slug)} className={styles.service} style={{ '--c': s.color }} onClick={onClose}>
                                    <span className={styles.hex} aria-hidden="true" />
                                    {s.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.actions} style={{ '--i': 5 }}>
                    <Link href="/contact-us" className={styles.cta} onClick={onClose}>
                        Start a project <span aria-hidden="true">→</span>
                    </Link>
                    <div className={styles.quick}>
                        <a href={CONTACT.tel} className={styles.quickLink}>Call</a>
                        <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.quickLink}>WhatsApp</a>
                        <a href={`mailto:${CONTACT.email}`} className={styles.quickLink}>Email</a>
                    </div>
                </div>

                <div className={styles.socials} style={{ '--i': 6 }}>
                    {SOCIALS.map((s) => {
                        const Icon = SOCIAL_ICONS[s.label];
                        return (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={styles.social} aria-label={s.label}>
                                <Icon size={20} aria-hidden="true" />
                            </a>
                        );
                    })}
                    <span className={styles.city}>Chennai, India</span>
                </div>
            </div>
        </div>
    );
}
