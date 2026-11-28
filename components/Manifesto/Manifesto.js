'use client';
import { useRef } from 'react';
import Image from 'next/image';
import styles from './Manifesto.module.css';
import { gsap, useGSAP, prefersReducedMotion } from '../Motion/gsap';

/*
 * One big sentence that lights up word by word as you scroll.
 * Key words glow in their meaning colour and a hexagon photo pops in beside each.
 */
const SENTENCE = [
    'We', 'find', 'the', { word: 'spark', color: 'var(--c-coral)', img: '/assets/opt/manifesto-spark.webp' },
    'in', 'every', 'brand,', 'shape', 'it', 'into', { word: 'strategy,', color: 'var(--c-blue)', img: '/assets/opt/manifesto-strategy.webp' },
    'tell', 'it', 'through', { word: 'stories', color: 'var(--c-magenta)', img: '/assets/opt/manifesto-stories.webp' },
    'and', 'scale', 'it', 'into', { word: 'growth', color: 'var(--c-lime)', img: '/assets/opt/manifesto-growth.webp' },
    'that', 'matters.',
];

export default function Manifesto() {
    const root = useRef(null);

    useGSAP(() => {
        const q = gsap.utils.selector(root);
        const words = q(`.${styles.w}`);
        const chips = q(`.${styles.chip}`);
        if (prefersReducedMotion()) {
            gsap.set(words, { opacity: 1 });
            gsap.set(chips, { scale: 1 });
            return;
        }

        const desktop = window.matchMedia('(min-width: 901px)').matches;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: root.current,
                start: desktop ? 'top top' : 'top 75%',
                end: desktop ? '+=130%' : 'bottom 60%',
                scrub: 0.6,
                pin: desktop,
            },
        });
        words.forEach((w, i) => {
            tl.to(w, { opacity: 1, duration: 1, ease: 'none' }, i * 0.6);
            const chip = w.nextElementSibling?.classList.contains(styles.chip) ? w.nextElementSibling : null;
            if (chip) tl.to(chip, { scale: 1, rotate: 0, duration: 1.4, ease: 'back.out(2)' }, i * 0.6 + 0.2);
        });
    }, { scope: root });

    return (
        <div className={styles.pinWrap}>
            <section ref={root} className={styles.manifesto}>
            <span className={styles.label}>Our belief</span>
            <p className={styles.sentence}>
                {SENTENCE.map((t, i) =>
                    typeof t === 'string' ? (
                        <span key={i} className={styles.w}>{t} </span>
                    ) : (
                        <span key={i} className={styles.key}>
                            <span className={`${styles.w} ${styles.keyWord}`} style={{ '--k': t.color }}>{t.word}</span>
                            <span className={styles.chip} style={{ '--k': t.color }} aria-hidden="true">
                                <Image src={t.img} alt="" fill sizes="120px" />
                            </span>{' '}
                        </span>
                    )
                )}
            </p>
        </section>
        </div>
    );
}
