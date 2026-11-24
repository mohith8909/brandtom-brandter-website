'use client';
import { useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from './gsap';
import styles from './Preloader.module.css';

const finish = () => {
    window.__bbIntroDone = true;
    window.__lenis?.start();
    window.dispatchEvent(new Event('bb:intro-done'));
};

const WORD = 'BRANDTOM & BRANDTER';

export default function Preloader() {
    const root = useRef(null);
    const [gone, setGone] = useState(false);

    useGSAP(() => {
        if (prefersReducedMotion()) { finish(); setGone(true); return; }
        const counter = { v: 0 };
        const num = root.current.querySelector(`.${styles.count}`);
        const chars = root.current.querySelectorAll(`.${styles.char}`);
        const bar = root.current.querySelector(`.${styles.bar}`);

        gsap.timeline({ onComplete: () => setGone(true) })
            .from(chars, { yPercent: 120, stagger: 0.03, duration: 0.8, ease: 'power4.out' })
            .to(counter, {
                v: 100, duration: 1.4, ease: 'power2.inOut',
                onUpdate: () => { num.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
            }, 0)
            .to(bar, { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 0)
            .to(chars, { yPercent: -120, stagger: 0.015, duration: 0.5, ease: 'power3.in' }, '+=0.1')
            .to([num, bar], { autoAlpha: 0, duration: 0.3 }, '<')
            .add(finish, '-=0.1')
            .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, '-=0.15');
    }, { scope: root });

    if (gone) return null;
    return (
        <div ref={root} className={styles.preloader} aria-hidden="true">
            <div className={styles.word}>
                {WORD.split('').map((c, i) => (
                    <span key={i} className={styles.char}>{c === ' ' ? ' ' : c}</span>
                ))}
            </div>
            <div className={styles.meta}>
                <span className={styles.tag}>From thought to impact</span>
                <span className={styles.count}>000</span>
            </div>
            <div className={styles.bar} />
        </div>
    );
}
