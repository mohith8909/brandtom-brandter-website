'use client';
import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from './gsap';

// Pulls its child toward the pointer while hovered, then springs back.
export default function Magnetic({ children, strength = 0.35, className = '' }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || !window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });

        const move = (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * strength);
            yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });

        el.addEventListener('mousemove', move);
        el.addEventListener('mouseleave', leave);
        return () => {
            el.removeEventListener('mousemove', move);
            el.removeEventListener('mouseleave', leave);
        };
    }, [strength]);

    return (
        <span ref={ref} className={className} style={{ display: 'inline-block', willChange: 'transform' }}>
            {children}
        </span>
    );
}
