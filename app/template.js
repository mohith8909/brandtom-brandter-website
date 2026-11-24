'use client';
import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/components/Motion/gsap';

// Re-mounts on every navigation: a curtain in the logo's colours lifts off the new page.
export default function Template({ children }) {
    const curtain = useRef(null);

    useGSAP(() => {
        if (prefersReducedMotion()) return;
        // Black (top) lifts first, then coral, magenta, blue and lime strips follow in logo order.
        const panels = [...curtain.current.children].reverse();
        gsap.timeline()
            .set(panels, { scaleY: 1, transformOrigin: 'top' })
            .to(panels, { scaleY: 0, duration: 0.9, ease: 'expo.inOut', stagger: 0.06 });
    }, { scope: curtain });

    return (
        <>
            {children}
            <div ref={curtain} className="page-curtain" aria-hidden="true">
                <div className="page-curtain-panel" style={{ background: 'var(--c-lime)' }} />
                <div className="page-curtain-panel" style={{ background: 'var(--c-blue)' }} />
                <div className="page-curtain-panel" style={{ background: 'var(--c-magenta)' }} />
                <div className="page-curtain-panel" style={{ background: 'var(--c-coral)' }} />
                <div className="page-curtain-panel" />
            </div>
        </>
    );
}
