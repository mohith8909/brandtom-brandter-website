'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion, whenIntroDone } from './gsap';
import { scrollToAnchor, focusWithoutScroll } from './anchors';

/*
 * Smooth scrolling (Lenis) plus everything about where a page starts:
 *   - a new page starts at the top, or at its #section if the link had one
 *   - Back / Forward return to where the visitor was on that page
 *   - links to a section of the current page glide there (and "Home" on the home page
 *     glides to the top) instead of jumping
 *   - after a page change, keyboard and screen reader focus moves to the new page's
 *     heading, so Tab continues from there instead of from the top of the site
 */

const pageY = () => window.__lenis?.scroll ?? window.scrollY;
const jumpTo = (y) => {
    if (window.__lenis) { window.__lenis.resize(); window.__lenis.scrollTo(y, { immediate: true, force: true }); }
    else window.scrollTo(0, y);
};

export default function SmoothScroll() {
    const pathname = usePathname();
    const lastPath = useRef(null);
    const popped = useRef(false);
    const positions = useRef(new Map()); // pathname -> scroll position when the visitor left it

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

    useEffect(() => {
        // We restore positions ourselves; the browser's own attempt fights the pinned sections
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

        const save = () => { if (lastPath.current) positions.current.set(lastPath.current, pageY()); };

        const onClick = (e) => {
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = e.target.closest?.('a[href]');
            if (!a || (a.target && a.target !== '_self') || a.classList.contains('skip-link')) return;
            const url = new URL(a.href, window.location.href);
            if (url.origin !== window.location.origin) return;

            if (url.pathname !== window.location.pathname) { save(); return; } // leaving: remember the spot

            // Same page: glide instead of jump, keep the address bar honest
            e.preventDefault();
            const id = decodeURIComponent(url.hash.slice(1));
            let target;
            if (id) target = scrollToAnchor(id);
            else {
                window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: 'smooth' });
                target = document.querySelector('main h1');
            }
            history.replaceState(history.state, '', url.pathname + url.search + url.hash);
            focusWithoutScroll(target);
        };

        // Back / Forward: the old page is still on screen when this fires, so its scroll
        // position is still correct to save
        const onPop = () => { save(); popped.current = true; };

        window.addEventListener('click', onClick, true);
        window.addEventListener('popstate', onPop);
        return () => {
            window.removeEventListener('click', onClick, true);
            window.removeEventListener('popstate', onPop);
        };
    }, []);

    useEffect(() => {
        const firstLoad = lastPath.current === null;
        lastPath.current = pathname;

        // Opened with a #section in the address (shared link, bookmark): go there once the
        // intro is done and the page is measured
        if (firstLoad) {
            const id = decodeURIComponent(window.location.hash.slice(1));
            if (!id) return undefined;
            return whenIntroDone(() => {
                requestAnimationFrame(() => {
                    ScrollTrigger.refresh();
                    focusWithoutScroll(scrollToAnchor(id, { immediate: true }));
                });
            });
        }

        const restore = popped.current ? positions.current.get(pathname) : undefined;
        popped.current = false;

        // New page starts at the top (a #section link is handled by the page transition)
        jumpTo(0);

        let raf1 = 0, raf2 = 0;
        raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => {
                if (restore != null) {
                    // Back / Forward: measure the page first (pinned sections add scroll
                    // space), then return to where the visitor was
                    ScrollTrigger.refresh();
                    window.__bbRefreshedUnderCover = true; // skip the re-measure below
                    jumpTo(restore);
                }
                const id = decodeURIComponent(window.location.hash.slice(1));
                focusWithoutScroll((id && document.getElementById(id)) || document.querySelector('main h1') || document.querySelector('main'));
            });
        });

        // Re-measure scroll-driven animations for the new page, unless that has already
        // been done (by the page transition while the screen was covered, or above)
        const id = setTimeout(() => {
            if (window.__bbRefreshedUnderCover) { window.__bbRefreshedUnderCover = false; return; }
            ScrollTrigger.refresh();
        }, 400);
        return () => { clearTimeout(id); cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
    }, [pathname]);

    return null;
}
