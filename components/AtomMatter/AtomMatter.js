'use client';
import { useRef } from 'react';
import styles from './AtomMatter.module.css';
import SplitReveal from '../Motion/SplitReveal';
import { gsap, useGSAP, prefersReducedMotion } from '../Motion/gsap';

/*
 * Who we are: Brandtom (Brand + Atom) -> Brandter (Brand + Matter).
 * 19 hexagons start scattered like particles of an idea; as you scroll they
 * lock together into a solid honeycomb. The two name definitions trade focus
 * as it happens. Mission and vision follow underneath.
 */

// Honeycomb of radius 2 (1 + 6 + 12 cells), pointy-top axial coordinates
const CELLS = [];
for (let q = -2; q <= 2; q++) {
    for (let r = Math.max(-2, -q - 2); r <= Math.min(2, -q + 2); r++) CELLS.push({ q, r });
}

// Colour each cell by its angle around the centre, in the order colours flow around the logo
const SPECTRUM = ['var(--c-coral)', 'var(--c-magenta)', 'var(--c-plum)', 'var(--c-royal)', 'var(--c-blue)', 'var(--c-lime)'];
const colourFor = ({ q, r }) => {
    if (q === 0 && r === 0) return 'var(--c-plum)';
    const x = Math.sqrt(3) * (q + r / 2), y = 1.5 * r;
    const a = (Math.atan2(y, x) + Math.PI * 2.5) % (Math.PI * 2);   // start at the top, go clockwise
    return SPECTRUM[Math.floor((a / (Math.PI * 2)) * SPECTRUM.length) % SPECTRUM.length];
};

// Deterministic "random" so server and browser agree
const seeded = (i, k) => {
    const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v);
};

export default function AtomMatter() {
    const root = useRef(null);

    useGSAP(() => {
        const q = gsap.utils.selector(root);
        const hexes = q(`.${styles.hex}`);
        const atomText = q(`.${styles.atom}`)[0];
        const matterText = q(`.${styles.matter}`)[0];
        const stage = q(`.${styles.stage}`)[0];
        if (prefersReducedMotion()) return;   // honeycomb shown assembled

        const spread = () => Math.min(stage.offsetWidth, 520);

        // One scroll-linked timeline: scattered atom -> locked honeycomb, text focus swaps
        const build = (scrollTrigger) => {
            const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger });
            hexes.forEach((h, i) => {
                tl.fromTo(h, {
                    x: () => (seeded(i, 1) - 0.5) * spread() * 1.05,
                    y: () => (seeded(i, 2) - 0.5) * spread() * 0.95,
                    rotation: () => (seeded(i, 3) - 0.5) * 240,
                    scale: () => 0.35 + seeded(i, 4) * 0.4,
                }, {
                    x: 0, y: 0, rotation: 0, scale: 1,
                    duration: 1, ease: 'power2.inOut',
                }, seeded(i, 5) * 0.35);
            });
            tl.fromTo(atomText, { opacity: 1 }, { opacity: 0.28, duration: 0.6 }, 0.45)
                .fromTo(matterText, { opacity: 0.28 }, { opacity: 1, duration: 0.6 }, 0.55)
                .fromTo(q(`.${styles.stateAtom}`), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3 }, 0.6)
                .fromTo(q(`.${styles.stateMatter}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.75);
            return tl;
        };

        const mm = gsap.matchMedia();
        mm.add('(min-width: 901px)', () => {
            build({ trigger: q(`.${styles.pinArea}`)[0], start: 'top top', end: '+=150%', scrub: 0.8, pin: true, invalidateOnRefresh: true });
        });
        mm.add('(max-width: 900px)', () => {
            build({ trigger: stage, start: 'top 85%', end: 'bottom 35%', scrub: 0.6, invalidateOnRefresh: true });
        });

        gsap.from(q(`.${styles.mv}`), {
            y: 60, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out',
            scrollTrigger: { trigger: q(`.${styles.mvRow}`)[0], start: 'top 85%', once: true },
        });
        return () => mm.revert();
    }, { scope: root });

    return (
        <section ref={root} className={styles.section} id="about">
            <div className={styles.pinArea}>
                <div className={styles.head}>
                    <span className={styles.label}>Who we are</span>
                    <SplitReveal tag="h2" className={styles.heading}>Two words. One journey.</SplitReveal>
                </div>

                <div className={styles.grid}>
                    <div className={`${styles.side} ${styles.atom}`}>
                        <span className={styles.formula}>Brand + Atom</span>
                        <h3 className={styles.name}>Brandtom</h3>
                        <p className={styles.text}>
                            Every idea starts with a spark as tiny as an atom, and that is the level our
                            thinking starts at when we build a campaign.
                        </p>
                    </div>

                    <div className={styles.stage} aria-hidden="true">
                        <div className={styles.comb}>
                            {CELLS.map((c, i) => (
                                <span
                                    key={i}
                                    className={styles.hex}
                                    style={{
                                        '--x': Math.sqrt(3) * (c.q + c.r / 2),
                                        '--y': 1.5 * c.r,
                                        '--c': colourFor(c),
                                    }}
                                />
                            ))}
                        </div>
                        <span className={styles.state}>
                            <span className={styles.stateAtom}>Atom</span>
                            <span className={styles.stateMatter}>Matter</span>
                        </span>
                    </div>

                    <div className={`${styles.side} ${styles.matter}`}>
                        <span className={styles.formula}>Brand + Matter</span>
                        <h3 className={styles.name}>Brandter</h3>
                        <p className={styles.text}>
                            A campaign is complete when the idea reaches its fullest form. That final form is
                            matter, and we make sure it gets there.
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.mvRow}>
                <article className={styles.mv}>
                    <span className={styles.mvLabel}>Our mission</span>
                    <p className={styles.mvText}>
                        To turn ideas into impactful realities: guiding brands from the first spark of
                        inspiration to a final expression that connects, engages and endures, with end-to-end
                        strategy that merges creativity with precision.
                    </p>
                </article>
                <article className={styles.mv}>
                    <span className={styles.mvLabel}>Our vision</span>
                    <p className={styles.mvText}>
                        A new era of brand evolution, where ideas are limitless, creativity is strategic and
                        every expression leaves a lasting mark on culture.
                    </p>
                </article>
            </div>
        </section>
    );
}
