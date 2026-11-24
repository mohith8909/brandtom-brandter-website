'use client';
import { useRef } from 'react';
import styles from './Process.module.css';
import SplitReveal from '../Motion/SplitReveal';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../Motion/gsap';

/*
 * Spark -> Strategy -> Expression -> Impact.
 * Desktop: the section pins; a line in the logo spectrum draws across the four steps
 * and each step lights up in its own colour as the line reaches it, while the giant
 * background word changes. Mobile: the same steps stacked, with the line drawing downward.
 */
const STEPS = [
    { n: '01', title: 'Spark', color: 'var(--c-coral)', text: 'We dig into your brand, your audience and your market until we find the one insight worth building on.' },
    { n: '02', title: 'Strategy', color: 'var(--c-blue)', text: 'That insight becomes positioning, a clear message and a plan, with the right channels for your budget.' },
    { n: '03', title: 'Expression', color: 'var(--c-magenta)', text: 'Ideas take form as campaigns, content, films and design, crafted to stop the scroll and stay remembered.' },
    { n: '04', title: 'Impact', color: 'var(--c-lime)', text: 'We launch, measure and refine, so the work keeps performing and the brand keeps growing.' },
];

export default function Process() {
    const root = useRef(null);

    useGSAP(() => {
        const q = gsap.utils.selector(root);
        const steps = q(`.${styles.step}`);
        const words = q(`.${styles.bgWord}`);
        if (prefersReducedMotion()) {
            gsap.set(q(`.${styles.lineFill}`), { scaleX: 1, scaleY: 1 });
            steps.forEach((s) => s.classList.add(styles.active));
            return;
        }

        // Light steps up to `idx`; the step at `idx` is the current one
        let shown = -1;
        const setActive = (idx) => {
            if (idx === shown) return;
            shown = idx;
            steps.forEach((o, j) => {
                o.classList.toggle(styles.active, j <= idx);
                o.classList.toggle(styles.current, j === idx);
            });
        };

        const mm = gsap.matchMedia();
        mm.add('(min-width: 901px)', () => {
            setActive(0);
            gsap.set(words, { autoAlpha: 0, yPercent: 20 });
            gsap.set(words[0], { autoAlpha: 1, yPercent: 0 });
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: root.current, start: 'top top', end: '+=220%', scrub: 0.8, pin: true,
                    // derived from scroll position, so it is right in both directions
                    onUpdate: (self) => setActive(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))),
                },
            });
            tl.fromTo(q(`.${styles.lineFill}`), { scaleX: 0 }, { scaleX: 1, duration: STEPS.length, ease: 'none' }, 0);
            for (let i = 1; i < STEPS.length; i++) {
                tl.to(words[i - 1], { autoAlpha: 0, yPercent: -20, duration: 0.4 }, i)
                    .to(words[i], { autoAlpha: 1, yPercent: 0, duration: 0.4 }, i);
            }
        });
        mm.add('(max-width: 900px)', () => {
            gsap.fromTo(q(`.${styles.lineFill}`), { scaleY: 0 }, {
                scaleY: 1, ease: 'none',
                scrollTrigger: { trigger: q(`.${styles.track}`)[0], start: 'top 70%', end: 'bottom 60%', scrub: true },
            });
            steps.forEach((s, i) => {
                ScrollTrigger.create({
                    trigger: s, start: 'top 70%',
                    onEnter: () => setActive(i),
                    onLeaveBack: () => setActive(i - 1),
                });
            });
        });
        return () => mm.revert();
    }, { scope: root });

    return (
        <div className={styles.pinWrap}>
            <section ref={root} className={styles.process}>
            <div className={styles.bgWords} aria-hidden="true">
                {STEPS.map((s) => <span key={s.n} className={styles.bgWord} style={{ '--c': s.color }}>{s.title}</span>)}
            </div>

            <div className={styles.head}>
                <span className={styles.label}>How we work</span>
                <SplitReveal tag="h2" className={styles.heading}>From a spark to real impact</SplitReveal>
            </div>

            <div className={styles.track}>
                <div className={styles.line}><div className={styles.lineFill} /></div>
                {STEPS.map((s) => (
                    <div key={s.n} className={styles.step} style={{ '--c': s.color }}>
                        <span className={styles.node} />
                        <span className={styles.num}>{s.n}</span>
                        <h3 className={styles.title}>{s.title}</h3>
                        <p className={styles.text}>{s.text}</p>
                    </div>
                ))}
            </div>
        </section>
        </div>
    );
}
