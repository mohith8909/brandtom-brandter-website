'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Runs cb once the intro loader has finished (or right away if it already has).
export const whenIntroDone = (cb) => {
    if (typeof window === 'undefined') return () => {};
    if (window.__bbIntroDone) { cb(); return () => {}; }
    const handler = () => cb();
    window.addEventListener('bb:intro-done', handler, { once: true });
    return () => window.removeEventListener('bb:intro-done', handler);
};

export { gsap, ScrollTrigger, useGSAP };
