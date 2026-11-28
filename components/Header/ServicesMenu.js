'use client';
import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './ServicesMenu.module.css';
import { SERVICES, serviceHref } from '../site';

/*
 * Desktop "Our Services" dropdown: a panel with all eight services, each opening its own
 * card on the Services page, plus "All services" and "Start a project".
 *
 * "Our Services" itself stays a normal link. Mouse users open the panel by hovering;
 * keyboard and screen reader users use the small arrow button next to it (a disclosure
 * button, with aria-expanded). Escape, clicking elsewhere, choosing a link or the header
 * hiding on scroll all close it.
 */
export default function ServicesMenu({ link, hidden }) {
    const [open, setOpen] = useState(false);
    const wrap = useRef(null);
    const button = useRef(null);
    const closeTimer = useRef(0);
    const panelId = useId();

    const show = () => { clearTimeout(closeTimer.current); setOpen(true); };
    // A short delay, so moving the mouse from the link down to the panel doesn't close it
    const hideSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpen(false), 180); };

    useEffect(() => { if (hidden) setOpen(false); }, [hidden]);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key !== 'Escape') return;
            setOpen(false);
            if (wrap.current?.contains(document.activeElement)) button.current?.focus();
        };
        const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
        // Tabbing out of the whole menu closes it
        const onFocusOut = (e) => { if (!wrap.current?.contains(e.relatedTarget)) setOpen(false); };
        const el = wrap.current;
        window.addEventListener('keydown', onKey);
        window.addEventListener('pointerdown', onDown);
        el.addEventListener('focusout', onFocusOut);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('pointerdown', onDown);
            el.removeEventListener('focusout', onFocusOut);
        };
    }, [open]);

    useEffect(() => () => clearTimeout(closeTimer.current), []);

    const hover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

    return (
        <div
            ref={wrap}
            className={styles.wrap}
            onMouseEnter={hover ? show : undefined}
            onMouseLeave={hover ? hideSoon : undefined}
        >
            {link}
            <button
                ref={button}
                type="button"
                className={`${styles.toggle} ${open ? styles.toggleOpen : ''}`}
                aria-expanded={open}
                aria-controls={panelId}
                aria-label="Show all services"
                onClick={() => (open ? setOpen(false) : show())}
            >
                <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>

            <div id={panelId} className={`${styles.panel} ${open ? styles.panelOpen : ''}`} inert={!open}>
                <div className={styles.inner}>
                    <div className={styles.intro}>
                        <span className={styles.kicker}>What we do</span>
                        <p className={styles.lead}>Eight disciplines, one idea carried all the way to impact.</p>
                        <div className={styles.introLinks}>
                            <Link href="/services" className={styles.all} onClick={() => setOpen(false)}>All services →</Link>
                            <Link href="/contact-us" className={styles.cta} onClick={() => setOpen(false)}>Start a project</Link>
                        </div>
                    </div>
                    <ul className={styles.grid}>
                        {SERVICES.map((s, i) => (
                            <li key={s.slug} style={{ '--c': s.color, '--i': i }}>
                                <Link href={serviceHref(s.slug)} className={styles.item} onClick={() => setOpen(false)}>
                                    <span className={styles.hex} aria-hidden="true" />
                                    <span className={styles.text}>
                                        <span className={styles.name}>{s.name}</span>
                                        <span className={styles.blurb}>{s.blurb}</span>
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
