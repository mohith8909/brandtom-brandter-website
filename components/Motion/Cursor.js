'use client';
import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from './gsap';
import styles from './Cursor.module.css';

export default function Cursor() {
    const dot = useRef(null);
    const ring = useRef(null);
    const label = useRef(null);

    useEffect(() => {
        if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;
        document.documentElement.classList.add('has-custom-cursor');

        const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1, ease: 'power3' });
        const dy = gsap.quickTo(dot.current, 'y', { duration: 0.1, ease: 'power3' });
        const rx = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' });
        const ry = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' });

        const move = (e) => {
            dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
            gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3, overwrite: 'auto' });
        };
        const over = (e) => {
            const target = e.target.closest?.('[data-cursor], a, button');
            const text = target?.getAttribute('data-cursor') || '';
            label.current.textContent = text;
            ring.current.classList.toggle(styles.hover, !!target && !text);
            ring.current.classList.toggle(styles.labelled, !!text);
        };
        const leave = () => gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
        const down = () => gsap.to(ring.current, { scale: 0.8, duration: 0.2 });
        const up = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: 'back.out(3)' });

        window.addEventListener('mousemove', move);
        document.addEventListener('mouseover', over);
        document.documentElement.addEventListener('mouseleave', leave);
        window.addEventListener('mousedown', down);
        window.addEventListener('mouseup', up);
        return () => {
            document.documentElement.classList.remove('has-custom-cursor');
            window.removeEventListener('mousemove', move);
            document.removeEventListener('mouseover', over);
            document.documentElement.removeEventListener('mouseleave', leave);
            window.removeEventListener('mousedown', down);
            window.removeEventListener('mouseup', up);
        };
    }, []);

    return (
        <>
            <div ref={ring} className={styles.ring} aria-hidden="true"><span ref={label} className={styles.label} /></div>
            <div ref={dot} className={styles.dot} aria-hidden="true" />
        </>
    );
}
