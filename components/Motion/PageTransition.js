'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';
import { scrollToAnchor } from './anchors';
import styles from './PageTransition.module.css';

/*
 * Hex-shatter page transitions.
 *
 * Clicking a link to another page: a honeycomb of hexagons in the logo's colours
 * grows out from the point you clicked, cooling to ink as it covers the screen.
 * The next page loads underneath, then the honeycomb shatters away outward from the
 * same point and reveals it. Back/forward buttons are left as a plain, instant swap.
 *
 * Links opt out with data-transition="manual" on them or an ancestor (the hero's
 * throwable words: a throw must not navigate). Such code can still start a transition
 * with window.dispatchEvent(new CustomEvent('bb:navigate', { detail: { href, x, y } })).
 *
 * One 2D canvas, a few hundred hexagons; nothing runs between transitions.
 * Skipped completely for visitors with reduced motion switched on.
 */

const COLORS = ['#FF3325', '#AE2A73', '#792784', '#00A3EA', '#3169C9', '#8FD73A'];
const INK = '#0A0A0F';
const LABELS = { '/': 'Home', '/services': 'Our Services', '/contact-us': 'Contact Us' };
const SPREAD = 1.5;          // how staggered the wave is (0 = all at once)
const STALL_MS = 8000;       // never keep visitors behind the honeycomb longer than this

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIn = (t) => t * t * t;

export default function PageTransition() {
    const router = useRouter();
    const routerRef = useRef(router);
    routerRef.current = router;
    const pathname = usePathname();
    const canvasRef = useRef(null);
    const labelRef = useRef(null);
    const api = useRef(null);
    const firstPath = useRef(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        const label = labelRef.current;
        const ctx = canvas.getContext('2d');
        // phase: idle | covering | covered (waiting for the new page) | revealing
        const state = { cells: [], R: 0, W: 0, H: 0, phase: 'idle', tween: null, fallback: 0, ox: 0, oy: 0 };

        const hexPath = new Path2D();
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i - Math.PI / 2; // pointy top, like the logo cells
            const x = Math.cos(a), y = Math.sin(a);
            if (i === 0) hexPath.moveTo(x, y); else hexPath.lineTo(x, y);
        }
        hexPath.closePath();

        // Lay a honeycomb over the viewport; each cell knows how far it is from the origin
        const build = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const W = window.innerWidth, H = window.innerHeight;
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const R = W < 700 ? 34 : 50;
            const w = Math.sqrt(3) * R, rowH = 1.5 * R;
            const cells = [];
            let maxD = 0;
            for (let row = -1; row * rowH < H + R * 2; row++) {
                for (let col = -1; col * w < W + w; col++) {
                    const x = col * w + (row & 1 ? w / 2 : 0);
                    const y = row * rowH;
                    const d = Math.hypot(x - state.ox, y - state.oy);
                    maxD = Math.max(maxD, d);
                    cells.push({ x, y, d, c: COLORS[(Math.random() * COLORS.length) | 0], j: Math.random() * 0.12 });
                }
            }
            // normalise so the last cell finishes exactly at p = 1, jitter included
            for (const c of cells) c.d = (c.d / maxD) * 0.88 + c.j;
            Object.assign(state, { cells, R, W, H });
        };

        // cover: 0 -> 1 hexagons grow in; reveal: 0 -> 1 hexagons shrink away
        const draw = (p, mode) => {
            const { cells, R, W, H } = state;
            ctx.clearRect(0, 0, W, H);
            for (const c of cells) {
                const t = clamp01(p * (1 + SPREAD) - c.d * SPREAD);
                let s, ink;
                if (mode === 'cover') {
                    s = easeOut(t);
                    ink = clamp01((t - 0.35) / 0.55);   // colour cools to ink as it settles
                } else {
                    s = 1 - easeIn(t);
                    ink = 1 - clamp01(t / 0.45);         // flashes its colour as it breaks away
                }
                if (s <= 0.001) continue;
                const r = R * 1.06 * s;                  // slight overlap so a full cover has no seams
                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.scale(r, r);
                if (ink < 1) { ctx.fillStyle = c.c; ctx.fill(hexPath); }
                if (ink > 0) { ctx.globalAlpha = ink; ctx.fillStyle = INK; ctx.fill(hexPath); }
                ctx.restore();
            }
        };

        const show = (blockClicks) => {
            canvas.style.visibility = 'visible';
            canvas.style.pointerEvents = blockClicks ? 'auto' : 'none';
        };
        const hide = () => {
            ctx.clearRect(0, 0, state.W, state.H);
            canvas.style.visibility = 'hidden';
            canvas.style.pointerEvents = 'none';
            gsap.set(label, { autoAlpha: 0 });
        };

        const reveal = () => {
            clearTimeout(state.fallback);
            state.tween?.kill();
            state.phase = 'revealing';
            // Reuse the honeycomb that is covering the screen. Rebuilding resizes the canvas,
            // which wipes it, and the page would flash through for a frame before the first
            // reveal frame is drawn. Only rebuild if the window changed size.
            if (!state.cells.length || state.W !== window.innerWidth || state.H !== window.innerHeight) build();
            draw(0, 'reveal'); // fully covered, drawn now rather than on the next tick
            show(false); // the new page is usable as soon as it starts to appear
            gsap.to(label, { autoAlpha: 0, y: -12, duration: 0.3, ease: 'power2.in', overwrite: true });
            const o = { p: 0 };
            state.tween = gsap.to(o, {
                p: 1, duration: 0.95, ease: 'power2.inOut',
                onUpdate: () => draw(o.p, 'reveal'),
                onComplete: () => { hide(); state.phase = 'idle'; },
            });
        };

        const go = (href, ox, oy) => {
            // busy covering: ignore double clicks. Still revealing: a new click wins.
            if (state.phase === 'covering' || state.phase === 'covered') return;
            state.tween?.kill();
            const url = new URL(href, window.location.href);
            const target = url.pathname + url.search + url.hash;
            if (prefersReducedMotion()) { routerRef.current.push(target); return; }
            state.phase = 'covering';
            state.ox = ox; state.oy = oy;
            routerRef.current.prefetch(url.pathname);
            build();
            draw(0, 'cover');
            show(true); // no double clicks while covering
            // The custom cursor only updates on mouseover; tell it the link under it is gone
            // so it does not carry a "View" or hover state across to the next page
            canvas.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            label.textContent = LABELS[url.pathname] || '';
            gsap.fromTo(label, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.4, ease: 'power3.out', overwrite: true });
            const o = { p: 0 };
            state.tween = gsap.to(o, {
                p: 1, duration: 0.8, ease: 'power2.inOut',
                onUpdate: () => draw(o.p, 'cover'),
                onComplete: () => {
                    state.phase = 'covered';
                    routerRef.current.push(target);
                    state.fallback = setTimeout(reveal, STALL_MS);
                },
            });
        };

        const onClick = (e) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = e.target.closest?.('a[href]');
            if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
            if (a.closest('[data-transition="manual"]')) return;
            const url = new URL(a.href, window.location.href);
            if (url.origin !== window.location.origin) return;
            if (url.pathname === window.location.pathname) return;   // same page: hash links, etc.
            if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return;       // a file (PDF, image), not a page
            if (prefersReducedMotion()) return;
            e.preventDefault(); // Next's <Link> sees this and leaves navigation to us
            const keyboard = e.detail === 0; // Enter on a focused link: start from the middle
            go(url.href,
                keyboard ? window.innerWidth / 2 : e.clientX,
                keyboard ? window.innerHeight / 2 : e.clientY);
        };

        // Navigation requested by code (see the comment at the top)
        const onNavigate = (e) => {
            const { href, x, y } = e.detail || {};
            if (!href) return;
            go(href, x ?? window.innerWidth / 2, y ?? window.innerHeight / 2);
        };

        // Window resized (or phone rotated) mid-transition: lay the honeycomb out again
        const onResize = () => {
            if (state.phase === 'idle') return;
            build();
            if (state.phase === 'covered') draw(1, 'cover');
        };

        window.addEventListener('click', onClick, true);
        window.addEventListener('bb:navigate', onNavigate);
        window.addEventListener('resize', onResize);
        window.__bbTransition = true;

        // Jump to #section links (e.g. "/#about" from another page). Called right after the
        // page has been measured, so pinned sections' scroll space is already in place.
        const scrollToHash = () => {
            const id = decodeURIComponent(window.location.hash.slice(1));
            if (id) scrollToAnchor(id, { immediate: true });
        };

        api.current = {
            arrived() {
                if (prefersReducedMotion()) return;
                if (state.phase === 'covered') {
                    // Let the new page paint underneath, then measure its scroll animations
                    // (pinned sections change the page height) while it is still hidden, so
                    // nothing jumps once it shows. SmoothScroll skips its own re-measure.
                    window.__bbRefreshedUnderCover = true;
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        ScrollTrigger.refresh();
                        scrollToHash();
                        reveal();
                    }));
                } else if (state.phase === 'covering') {
                    // back/forward pressed while covering: drop the click's navigation,
                    // reveal whatever page we are now on
                    reveal();
                }
                // idle (back / forward buttons): the browser has already swapped the page, so
                // popping a honeycomb over it would only flash; leave it as a plain swap.
                // already revealing: nothing to do
            },
        };

        return () => {
            window.removeEventListener('click', onClick, true);
            window.removeEventListener('bb:navigate', onNavigate);
            window.removeEventListener('resize', onResize);
            window.__bbTransition = false;
            clearTimeout(state.fallback);
            state.tween?.kill();
            gsap.killTweensOf(label);
            hide(); // never leave the overlay stuck on screen
            api.current = null;
        };
    }, []);

    useEffect(() => {
        if (firstPath.current) { firstPath.current = false; return; }
        api.current?.arrived();
    }, [pathname]);

    return (
        <div className={styles.root} aria-hidden="true">
            <canvas ref={canvasRef} className={styles.canvas} />
            <span ref={labelRef} className={styles.label} />
        </div>
    );
}
