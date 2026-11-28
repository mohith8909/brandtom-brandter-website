'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from './gsap';
import styles from './Preloader.module.css';

/*
 * Intro, on every full page load (moving between pages inside the site does not replay it,
 * because this component lives in the root layout and only mounts once):
 *   glass   - "Liquid Glass": the real logo artwork flows in as liquid glass (a WebGL2
 *             shader, components/Motion/LiquidLogo.js) and settles into the exact logo
 *   classic - letter-by-letter wordmark with a counter, if WebGL is unavailable
 * Visitors with reduced motion switched on skip straight to the site; a script in <head>
 * (app/layout.js) hides this overlay before paint for them. "Skip intro" is always available.
 */

const WORD = 'BRANDTOM & BRANDTER';

const finish = () => {
    window.__bbIntroDone = true;
    window.__lenis?.start();
    window.dispatchEvent(new Event('bb:intro-done'));
};

export default function Preloader() {
    const root = useRef(null);
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('pending'); // pending | glass | classic | gone

    // Decide what to play
    useEffect(() => {
        if (prefersReducedMotion()) {
            finish();
            setMode('gone');
            return;
        }
        const start = () => {
            const ok = (() => {
                try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
            })();
            setMode(ok ? 'glass' : 'classic');
        };
        // Opened in a background tab? Browsers pause animation there, so wait until the
        // visitor actually looks at the tab; otherwise the intro would play to nobody.
        if (document.visibilityState === 'visible') { start(); return undefined; }
        const onVisible = () => {
            if (document.visibilityState !== 'visible') return;
            document.removeEventListener('visibilitychange', onVisible);
            start();
        };
        document.addEventListener('visibilitychange', onVisible);
        return () => document.removeEventListener('visibilitychange', onVisible);
    }, []);

    // Safety net: once an intro is playing, never keep visitors behind it for more than 15s
    const playing = mode === 'glass' || mode === 'classic';
    useEffect(() => {
        if (!playing) return undefined;
        const id = setTimeout(() => { finish(); setMode('gone'); }, 15000);
        return () => clearTimeout(id);
    }, [playing]);

    // Exit: wipe the overlay up and reveal the site
    const exit = (immediate = false) => {
        finish();
        if (immediate || !root.current) { setMode('gone'); return; }
        gsap.to(root.current, {
            clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut',
            onComplete: () => setMode('gone'),
        });
    };

    // Liquid Glass
    useEffect(() => {
        if (mode !== 'glass') return undefined;
        let intro, tl, cancelled = false, started = false;
        const el = root.current;
        const q = gsap.utils.selector(el);

        (async () => {
            try {
                // On a slow connection, don't keep visitors on a black screen waiting.
                // Only guards *starting* the intro; once it is playing it is never interrupted.
                const timeout = new Promise((_, reject) => setTimeout(() => {
                    if (!started) reject(new Error('intro load timeout'));
                }, 6000));
                const { playLiquidLogo, DURATION } = await Promise.race([import('./LiquidLogo'), timeout]);
                if (cancelled) return;

                intro = await Promise.race([
                    playLiquidLogo(canvasRef.current, {
                        // hold the finished logo a moment, then reveal the site
                        onComplete: (info) => (info?.skipped ? exit(true) : gsap.delayedCall(0.45, () => exit())),
                    }),
                    timeout,
                ]);
                started = true;
                if (cancelled) { intro.dispose(); return; }

                // Cinematic camera: starts tilted in 3D and slightly close, settles face-on
                tl = gsap.timeline()
                    .fromTo(q(`.${styles.stage}`),
                        { rotateY: -16, rotateX: 9, scale: 1.12 },
                        { rotateY: 0, rotateX: 0, scale: 1, duration: DURATION - 0.6, ease: 'power3.inOut' }, 0)
                    .to(q(`.${styles.caption}`), { opacity: 1, duration: 0.8 }, 0.6);
            } catch (err) {
                // Too slow to load, or WebGL failed to start: use the classic intro
                if (!cancelled) setMode('classic');
            }
        })();

        return () => {
            cancelled = true;
            tl?.kill();
            intro?.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    // Classic fallback
    useEffect(() => {
        if (mode !== 'classic') return undefined;
        const el = root.current;
        const counter = { v: 0 };
        const num = el.querySelector(`.${styles.count}`);
        const chars = el.querySelectorAll(`.${styles.char}`);
        const bar = el.querySelector(`.${styles.bar}`);
        const tl = gsap.timeline({ onComplete: () => exit() })
            .from(chars, { yPercent: 120, stagger: 0.03, duration: 0.8, ease: 'power4.out' })
            .to(counter, {
                v: 100, duration: 1.4, ease: 'power2.inOut',
                onUpdate: () => { num.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
            }, 0)
            .to(bar, { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 0)
            .to(chars, { yPercent: -120, stagger: 0.015, duration: 0.5, ease: 'power3.in' }, '+=0.1')
            .to([num, bar], { autoAlpha: 0, duration: 0.3 }, '<');
        return () => tl.kill();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    if (mode === 'gone') return null;

    return (
        <div ref={root} className={styles.preloader} data-preloader aria-hidden={mode !== 'glass'}>
            {mode === 'glass' && (
                <>
                    <div className={styles.stage}>
                        <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label="Brandtom & Brandter" />
                    </div>
                    <span className={styles.caption}>From Thoughts to Impact</span>
                    <button type="button" className={styles.skip} onClick={() => exit(true)}>
                        Skip intro
                    </button>
                </>
            )}

            {mode === 'classic' && (
                <>
                    <div className={styles.word}>
                        {WORD.split('').map((c, i) => (
                            <span key={i} className={styles.char}>{c === ' ' ? ' ' : c}</span>
                        ))}
                    </div>
                    <div className={styles.meta}>
                        <span className={styles.tag}>From Thoughts to Impact</span>
                        <span className={styles.count}>000</span>
                    </div>
                    <div className={styles.bar} />
                </>
            )}
        </div>
    );
}
