'use client';
import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from './gsap';

/*
 * Wipes an image into view from the bottom, settles it from a zoom,
 * then keeps a gentle parallax drift while it scrolls past.
 * Pass the layout className the image container already had.
 */
export default function ImageReveal({ children, className = '', parallax = 12, cursor, flow = false, ...rest }) {
    const ref = useRef(null);

    useGSAP(() => {
        const inner = ref.current.querySelector('.img-reveal-inner');
        if (prefersReducedMotion()) {
            gsap.set(ref.current, { clipPath: 'inset(0% 0% 0% 0%)' });
            return;
        }
        gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })
            .to(ref.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
            .fromTo(inner, { scale: 1.35 }, { scale: parallax ? 1 + parallax / 100 : 1, duration: 1.8, ease: 'expo.out' }, 0.1);

        if (parallax) {
            gsap.fromTo(inner, { yPercent: -parallax / 2 }, {
                yPercent: parallax / 2,
                ease: 'none',
                scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
            });
        }
    }, { scope: ref });

    return (
        <div ref={ref} className={`img-reveal ${className}`} data-cursor={cursor} {...rest}>
            <div className={`img-reveal-inner ${flow ? 'img-reveal-flow' : ''}`}>{children}</div>
        </div>
    );
}
