'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

export default function SmoothScroll() {
    const pathname = usePathname();

    useEffect(() => {
        if (prefersReducedMotion()) return;
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });
        window.__lenis = lenis;
        if (!window.__bbIntroDone) lenis.stop();
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
            window.__lenis = null;
        };
    }, []);

    // New page: jump to top and re-measure scroll-driven animations.
    useEffect(() => {
        window.__lenis?.scrollTo(0, { immediate: true });
        const id = setTimeout(() => ScrollTrigger.refresh(), 400);
        return () => clearTimeout(id);
    }, [pathname]);

    return null;
}
