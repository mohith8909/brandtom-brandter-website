'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import styles from './WhyUs.module.css';
import SplitReveal from '../Motion/SplitReveal';
import Magnetic from '../Motion/Magnetic';
import { gsap, useGSAP, prefersReducedMotion } from '../Motion/gsap';

// Qualitative only: describes how the plan changes with budget, no invented figures
const BUDGET_LEVELS = [
    { name: 'Lean', text: 'A few sharp, high-impact moves: one hero idea, the channels that matter most, nothing wasted.' },
    { name: 'Focused', text: 'A clear campaign with content to match, built around your strongest audience.' },
    { name: 'Growth', text: 'Always-on content, paid reach and influencer partnerships working together.' },
    { name: 'Full-funnel', text: 'Brand, performance and production in one plan, from first impression to repeat customer.' },
];

const BARS = [
    { h: 38, c: 'var(--c-coral)' },
    { h: 62, c: 'var(--c-magenta)' },
    { h: 48, c: 'var(--c-plum)' },
    { h: 80, c: 'var(--c-royal)' },
    { h: 70, c: 'var(--c-blue)' },
    { h: 96, c: 'var(--c-lime)' },
];

export default function WhyUs() {
    const root = useRef(null);
    const [level, setLevel] = useState(1);

    useGSAP(() => {
        if (prefersReducedMotion()) return;
        const q = gsap.utils.selector(root);
        const tiles = q(`.${styles.tile}`);

        gsap.from(tiles, {
            y: 80, autoAlpha: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out',
            scrollTrigger: { trigger: q(`.${styles.grid}`)[0], start: 'top 85%', once: true },
        });
        gsap.from(q(`.${styles.bar}`), {
            scaleY: 0, duration: 1.4, stagger: 0.08, ease: 'expo.out',
            scrollTrigger: { trigger: q(`.${styles.chart}`)[0], start: 'top 85%', once: true },
        });

        // Tiles lean toward the pointer and carry a soft spotlight
        if (!window.matchMedia('(pointer: fine)').matches) return;
        const offs = tiles.map((tile) => {
            const rx = gsap.quickTo(tile, 'rotateX', { duration: 0.6, ease: 'power3' });
            const ry = gsap.quickTo(tile, 'rotateY', { duration: 0.6, ease: 'power3' });
            const move = (e) => {
                const r = tile.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                rx(-py * 6); ry(px * 6);
                tile.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
                tile.style.setProperty('--my', `${(py + 0.5) * 100}%`);
            };
            const leave = () => { rx(0); ry(0); };
            tile.addEventListener('mousemove', move);
            tile.addEventListener('mouseleave', leave);
            return () => { tile.removeEventListener('mousemove', move); tile.removeEventListener('mouseleave', leave); };
        });
        return () => offs.forEach((off) => off());
    }, { scope: root });

    return (
        <section ref={root} className={styles.section}>
            <div className={styles.head}>
                <span className={styles.label}>Why brands choose us</span>
                <SplitReveal tag="h2" className={styles.heading}>Psychology meets precision</SplitReveal>
            </div>

            <div className={styles.grid}>
                <article className={`${styles.tile} ${styles.story}`}>
                    <div className={styles.orbit} aria-hidden="true">
                        <span style={{ '--c': 'var(--c-coral)', '--d': '0s' }} />
                        <span style={{ '--c': 'var(--c-blue)', '--d': '-3s' }} />
                        <span style={{ '--c': 'var(--c-lime)', '--d': '-6s' }} />
                        <span style={{ '--c': 'var(--c-magenta)', '--d': '-9s' }} />
                    </div>
                    <span className={styles.tag}>01</span>
                    <h3 className={styles.tileTitle}>Strategy with storytelling</h3>
                    <p className={styles.tileText}>
                        We understand not just how audiences think, but why they connect. We decode your brand’s
                        purpose and shape it into a narrative that is clear, relatable and meaningful.
                    </p>
                </article>

                <article className={`${styles.tile} ${styles.craft}`}>
                    <span className={styles.guides} aria-hidden="true" />
                    <span className={styles.tag}>02</span>
                    <h3 className={styles.tileTitle}>Creativity with precision</h3>
                    <p className={styles.tileText}>Visually striking, strategically aligned and ready to execute.</p>
                </article>

                <article className={`${styles.tile} ${styles.data}`}>
                    <span className={styles.tag}>03</span>
                    <h3 className={styles.tileTitle}>Data with human insight</h3>
                    <div className={styles.chart} aria-hidden="true">
                        {BARS.map((b, i) => (
                            <span key={i} className={styles.bar} style={{ height: `${b.h}%`, background: b.c }} />
                        ))}
                    </div>
                    <p className={styles.tileText}>Hard numbers, read with empathy and cultural sense.</p>
                </article>

                <article className={`${styles.tile} ${styles.budget}`}>
                    <span className={styles.tag}>04</span>
                    <h3 className={styles.tileTitle}>Built around your budget</h3>
                    <label className={styles.sliderLabel} htmlFor="budget-level">
                        Your budget: <strong>{BUDGET_LEVELS[level].name}</strong>
                    </label>
                    <input
                        id="budget-level"
                        type="range"
                        min="0"
                        max={BUDGET_LEVELS.length - 1}
                        step="1"
                        value={level}
                        onChange={(e) => setLevel(+e.target.value)}
                        className={styles.slider}
                        style={{ '--p': `${(level / (BUDGET_LEVELS.length - 1)) * 100}%` }}
                        aria-valuetext={BUDGET_LEVELS[level].name}
                    />
                    <p className={styles.tileText} aria-live="polite">{BUDGET_LEVELS[level].text}</p>
                </article>

                <article className={`${styles.tile} ${styles.cta}`}>
                    <span className={styles.tag}>Have a brief?</span>
                    <h3 className={styles.ctaTitle}>Let’s make it matter.</h3>
                    <Magnetic strength={0.35}>
                        <Link href="/contact-us" className={styles.ctaBtn}>
                            <span className="roll"><span>Start a project</span><span aria-hidden="true">Start a project</span></span>
                            <span aria-hidden="true">→</span>
                        </Link>
                    </Magnetic>
                </article>
            </div>
        </section>
    );
}
