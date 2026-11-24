'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';
import KineticWords from './KineticWords';
import Magnetic from '../Motion/Magnetic';
import { gsap, useGSAP, prefersReducedMotion, whenIntroDone } from '../Motion/gsap';

const LINES = [
    { text: 'From thought' },
    { text: 'to impact.', spectrum: true },
];

function ChennaiClock() {
    const [time, setTime] = useState('');
    useEffect(() => {
        const fmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
        const tick = () => setTime(fmt.format(new Date()));
        tick();
        const id = setInterval(tick, 15000);
        return () => clearInterval(id);
    }, []);
    return <span suppressHydrationWarning>Chennai {time || '--:--'} IST</span>;
}

export default function Hero() {
    const root = useRef(null);

    useGSAP(() => {
        const q = gsap.utils.selector(root);
        const lines = q(`.${styles.lineInner}`);
        const fades = q(`.${styles.fadeUp}`);

        if (prefersReducedMotion()) {
            gsap.set(lines, { y: 0, yPercent: 0 });
            return;
        }

        gsap.set(fades, { autoAlpha: 0, y: 24 });
        const cancel = whenIntroDone(() => {
            gsap.timeline()
                .to(lines, { y: 0, yPercent: 0, duration: 1.4, stagger: 0.12, ease: 'expo.out' })
                .to(fades, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }, 0.35);
        });

        // Headline lifts and fades as the hero scrolls away
        gsap.to(q(`.${styles.content}`), {
            yPercent: -25, autoAlpha: 0, ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: '60% top', scrub: true },
        });

        return cancel;
    }, { scope: root });

    return (
        <section ref={root} className={styles.hero} id="home">
            <div className={styles.glow} aria-hidden="true" />

            {/* The physical word pile sits behind the text and fills the hero */}
            <KineticWords scrollTarget={root} />

            <div className={styles.content}>
                <div className={`${styles.chips} ${styles.fadeUp}`}>
                    <span className={styles.chip}><span className={styles.chipHex} />DPIIT Recognised Startup</span>
                    <span className={styles.chip}><ChennaiClock /></span>
                    <span className={`${styles.chip} ${styles.chipLive}`}><span className={styles.liveDot} />Open for projects</span>
                </div>

                <h1 className={styles.title}>
                    {LINES.map((l) => (
                        <span key={l.text} className={styles.titleLine}>
                            <span className={`${styles.lineInner} ${l.spectrum ? styles.spectrum : ''}`}>{l.text}</span>
                        </span>
                    ))}
                </h1>

                <div className={styles.row}>
                    <p className={`${styles.subtitle} ${styles.fadeUp}`}>
                        A full-spectrum marketing agency from Chennai. Strategy, stories and campaigns,
                        built to collide with culture and leave a mark.
                    </p>

                    <div className={`${styles.ctas} ${styles.fadeUp}`}>
                        <Magnetic strength={0.3}>
                            <Link href="/contact-us" className={styles.ctaPrimary}>
                                <span className="roll"><span>Start a project</span><span aria-hidden="true">Start a project</span></span>
                                <span className={styles.ctaArrow} aria-hidden="true">→</span>
                            </Link>
                        </Magnetic>
                        <Link href="/services" className={styles.ctaGhost}>
                            <span className="roll"><span>Explore services</span><span aria-hidden="true">Explore services</span></span>
                        </Link>
                        <span className={styles.hint} aria-hidden="true">↓ Grab a word and throw it</span>
                    </div>
                </div>
            </div>

        </section>
    );
}
