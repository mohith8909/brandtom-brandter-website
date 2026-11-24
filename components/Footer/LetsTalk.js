'use client';
import { useRef } from 'react';
import Link from 'next/link';
import styles from './LetsTalk.module.css';
import Magnetic from '../Motion/Magnetic';
import { gsap, useGSAP, prefersReducedMotion } from '../Motion/gsap';

/*
 * Footer finale: a giant "LET'S TALK".
 * Letters rise into view, then lift and take a logo colour as the cursor passes,
 * fading back to white behind it.
 */
const WORD = "LET'S TALK";
const COLORS = ['var(--c-coral)', 'var(--c-magenta)', 'var(--c-plum)', 'var(--c-blue)', 'var(--c-lime)'];
const EMAIL = 'contactus@brandtomandbrandter.com';
const WHATSAPP = 'https://wa.me/919585050047?text=Hi%20Brandtom%20%26%20Brandter%2C%20I%20would%20like%20to%20discuss%20a%20project.';

export default function LetsTalk() {
    const root = useRef(null);

    useGSAP(() => {
        const q = gsap.utils.selector(root);
        const letters = q(`.${styles.ch}`);
        if (prefersReducedMotion()) {
            gsap.set(letters, { yPercent: 0 });
            return;
        }

        gsap.to(letters, {
            yPercent: 0, y: 0, duration: 1.3, stagger: 0.045, ease: 'expo.out',
            scrollTrigger: { trigger: q(`.${styles.word}`)[0], start: 'top 85%', once: true },
        });
        gsap.from(q(`.${styles.fade}`), {
            y: 30, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: q(`.${styles.actions}`)[0], start: 'top 92%', once: true },
        });

        if (!window.matchMedia('(pointer: fine)').matches) return;
        const lifts = letters.map((l) => gsap.quickTo(l, 'y', { duration: 0.5, ease: 'power3' }));
        const onMove = (e) => {
            letters.forEach((l, i) => {
                const r = l.getBoundingClientRect();
                const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
                const k = Math.max(0, 1 - d / 260);
                lifts[i](-k * r.height * 0.14);
                l.classList.toggle(styles.lit, k > 0.25);
            });
        };
        const onLeave = () => letters.forEach((l, i) => { lifts[i](0); l.classList.remove(styles.lit); });
        const el = root.current;
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, { scope: root });

    return (
        <section ref={root} className={styles.finale}>
            <div className={styles.blobs} aria-hidden="true"><span /><span /><span /></div>

            <span className={styles.label}>Got an idea worth building?</span>

            <h2 className={styles.word} aria-label="Let's talk">
                {WORD.split('').map((c, i) => (
                    <span key={i} className={styles.mask} aria-hidden="true">
                        <span className={styles.ch} style={{ '--c': COLORS[i % COLORS.length] }}>{c === ' ' ? ' ' : c}</span>
                    </span>
                ))}
            </h2>

            <div className={styles.actions}>
                <Magnetic strength={0.2} className={styles.fade}>
                    <a href={`mailto:${EMAIL}`} className={styles.email}>{EMAIL}</a>
                </Magnetic>
                <div className={`${styles.buttons} ${styles.fade}`}>
                    <Magnetic strength={0.3}>
                        <Link href="/contact-us" className={styles.primary}>
                            <span className="roll"><span>Start a project</span><span aria-hidden="true">Start a project</span></span>
                            <span aria-hidden="true">→</span>
                        </Link>
                    </Magnetic>
                    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={styles.whatsapp}>
                        <span className={styles.waDot} aria-hidden="true" />
                        <span className="roll"><span>WhatsApp us</span><span aria-hidden="true">WhatsApp us</span></span>
                    </a>
                    <a href="tel:+919585050047" className={styles.phone}>+91 95850 50047</a>
                </div>
            </div>
        </section>
    );
}
