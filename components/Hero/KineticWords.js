'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Matter from 'matter-js';
import styles from './KineticWords.module.css';
import { prefersReducedMotion, whenIntroDone } from '../Motion/gsap';

/*
 * Service words as physical objects.
 * After the intro they drop into the hero, bounce and pile up.
 * Mouse: grab and throw them, or push them by moving through the pile.
 * Click (without dragging) opens the services page.
 * Scroll down: the floor opens and the pile falls into the next section;
 * scroll back to the top and the words drop in again.
 * Phones: no dragging (so the page still scrolls); tilting the phone rolls the pile where supported.
 * The words render as real DOM links, so they stay crisp and accessible.
 */

const WORDS = [
    { label: 'Campaigns', tone: 'coral' },
    { label: 'Strategy', tone: 'blue' },
    { label: 'Storytelling', tone: 'magenta' },
    { label: 'Ad Films', tone: 'outline' },
    { label: 'Digital', tone: 'royal' },
    { label: 'Design', tone: 'plum' },
    { label: 'Influence', tone: 'lime' },
    { label: 'Ideation', tone: 'outline' },
    { label: 'Copywriting', tone: 'white', wide: true },
    { label: 'Social', tone: 'coral', wide: true },
    { label: 'Branding', tone: 'blue', wide: true },
    { label: 'Content', tone: 'magenta', wide: true },
];
const TOKENS = ['coral', 'blue', 'lime', 'magenta'];

export default function KineticWords({ scrollTarget, className = '' }) {
    const stage = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const el = stage.current;
        if (!el || prefersReducedMotion()) return undefined;   // static pile stays

        const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;
        const fine = window.matchMedia('(pointer: fine)').matches;
        const engine = Engine.create({ gravity: { x: 0, y: 1.15 } });
        const world = engine.world;
        let W = el.clientWidth, H = el.clientHeight;
        let disposed = false, raf = 0, visible = true, dropped = false, falling = false;

        // Switch from the static first-paint layout to free physics positioning
        const items = [...el.querySelectorAll('[data-body]')].filter((n) => n.offsetWidth > 0);
        const sizes = items.map((n) => ({ w: n.offsetWidth, h: n.offsetHeight }));
        el.classList.add(styles.live);

        // Walls
        const T = 400;
        const wallOpts = { isStatic: true, friction: 0.4, restitution: 0.2 };
        let floor, left, right;
        const buildWalls = () => {
            if (floor) Composite.remove(world, [floor, left, right]);
            floor = Bodies.rectangle(W / 2, H + T / 2, W * 3, T, wallOpts);
            left = Bodies.rectangle(-T / 2, H / 2 - 2000, T, H * 2 + 4000, wallOpts);
            right = Bodies.rectangle(W + T / 2, H / 2 - 2000, T, H * 2 + 4000, wallOpts);
            Composite.add(world, falling ? [left, right] : [floor, left, right]);
        };
        buildWalls();

        // One body per word / token
        const bodies = items.map((node, i) => {
            const { w, h } = sizes[i];
            const opts = { restitution: 0.35, friction: 0.25, frictionAir: 0.012, density: 0.0016, angle: (Math.random() - 0.5) * 0.6 };
            const b = node.dataset.body === 'hex'
                ? Bodies.polygon(-999, -999, 6, h / 2, opts)   // pointy-top, matches the CSS hexagon
                : Bodies.rectangle(-999, -999, w, h, { ...opts, chamfer: { radius: h / 2 - 1 } });
            b.node = node;
            b.w = w; b.h = h;
            return b;
        });

        // Park everything off-stage until the drop
        bodies.forEach((b) => { b.node.style.transform = 'translate3d(-9999px, -9999px, 0)'; });

        const placeAbove = (b, i) => {
            Matter.Sleeping.set(b, false);
            const x = b.w / 2 + 20 + Math.random() * Math.max(1, W - b.w - 40);
            Body.setPosition(b, { x, y: -b.h - 60 - i * 70 });
            Body.setVelocity(b, { x: (Math.random() - 0.5) * 4, y: 0 });
            Body.setAngle(b, (Math.random() - 0.5) * 0.8);
            Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.08);
        };

        const drop = () => {
            dropped = true;
            if (falling) Composite.add(world, floor);   // close the floor again
            falling = false;
            bodies.forEach((b, i) => {
                placeAbove(b, i);
                if (!Composite.get(world, b.id, 'body')) {
                    setTimeout(() => { if (!disposed) Composite.add(world, b); }, i * 90);
                }
            });
        };

        // Drag & throw (mouse only, so touch devices keep normal scrolling)
        let mouseConstraint;
        let dragMoved = false, downAt = null;
        if (fine) {
            const mouse = Mouse.create(el);
            el.removeEventListener('wheel', mouse.mousewheel);
            el.removeEventListener('touchmove', mouse.mousemove);
            el.removeEventListener('touchstart', mouse.mousedown);
            el.removeEventListener('touchend', mouse.mouseup);
            mouseConstraint = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.18, damping: 0.1, render: { visible: false } } });
            Composite.add(world, mouseConstraint);
            Events.on(mouseConstraint, 'startdrag', () => el.classList.add(styles.dragging));
            Events.on(mouseConstraint, 'enddrag', () => el.classList.remove(styles.dragging));
        }

        // A click opens services; a drag must not
        const onDown = (e) => { downAt = { x: e.clientX, y: e.clientY, t: performance.now() }; dragMoved = false; };
        const onMoveDrag = (e) => {
            if (downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) dragMoved = true;
        };
        const onClick = (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            e.preventDefault();
            if (!dragMoved && downAt && performance.now() - downAt.t < 400) router.push(link.getAttribute('href'));
            downAt = null;
        };
        el.addEventListener('pointerdown', onDown);
        window.addEventListener('pointermove', onMoveDrag);
        el.addEventListener('click', onClick);

        // Moving the cursor through the pile shoves the words it passes
        const cursor = { x: -9999, y: -9999, vx: 0, vy: 0 };
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            cursor.vx = x - cursor.x; cursor.vy = y - cursor.y;
            cursor.x = x; cursor.y = y;
        };
        if (fine) window.addEventListener('mousemove', onMove);

        // Phone tilt rolls the pile (Android and others that allow it without a prompt)
        const onTilt = (e) => {
            if (e.gamma == null) return;
            engine.gravity.x = Math.max(-1, Math.min(1, e.gamma / 35));
        };
        if (!fine) window.addEventListener('deviceorientation', onTilt);

        // Scroll: open the floor once the hero is a third gone, re-drop at the top
        const scrollProgress = () => {
            const t = scrollTarget?.current;
            if (!t) return 0;
            const r = t.getBoundingClientRect();
            return Math.max(0, -r.top / r.height);
        };

        let last = performance.now();
        const sync = () => {
            for (const b of bodies) {
                const { x, y } = b.position;
                b.node.style.transform = `translate3d(${x - b.w / 2}px, ${y - b.h / 2}px, 0) rotate(${b.angle}rad)`;
            }
        };
        const tick = (now) => {
            if (disposed) return;
            raf = requestAnimationFrame(tick);
            const dt = Math.min(now - last, 100);
            last = now;
            if (!visible || !dropped) return;

            const sp = scrollProgress();
            // Open the floor: removing it (not making it a sensor) also releases words already resting on it
            if (!falling && sp > 0.33) { falling = true; Composite.remove(world, floor); }
            else if (falling && sp < 0.02) drop();

            if (fine && !mouseConstraint?.body) {
                const speed = Math.hypot(cursor.vx, cursor.vy);
                if (speed > 1) {
                    for (const b of bodies) {
                        const dx = b.position.x - cursor.x, dy = b.position.y - cursor.y;
                        const reach = Math.max(b.w, b.h) / 2 + 40;
                        const d = Math.hypot(dx, dy);
                        if (d < reach) {
                            const f = 0.0009 * b.mass * Math.min(speed, 40);
                            Body.applyForce(b, b.position, { x: (cursor.vx / speed) * f, y: (cursor.vy / speed) * f - 0.0004 * b.mass });
                        }
                    }
                }
                cursor.vx *= 0.5; cursor.vy *= 0.5;
            }

            // Words that fell well out of view stop simulating until the next drop
            if (falling) bodies.forEach((b) => { if (b.position.y > H + 600 && !b.isSleeping) Matter.Sleeping.set(b, true); });

            // Fixed 16ms substeps: stable physics that keeps real time even when frames drop
            for (let left = dt; left > 0.5; left -= 16.667) Engine.update(engine, Math.min(16.667, left));
            sync();
        };
        raf = requestAnimationFrame(tick);

        const cancelIntro = whenIntroDone(() => { if (!disposed) drop(); });

        const ro = new ResizeObserver(() => {
            W = el.clientWidth; H = el.clientHeight;
            buildWalls();
            bodies.forEach((b) => {
                if (b.position.x > W - b.w / 2) Body.setPosition(b, { x: W - b.w / 2 - 10, y: b.position.y });
            });
        });
        ro.observe(el);
        const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; last = performance.now(); });
        io.observe(el);

        return () => {
            disposed = true;
            cancelAnimationFrame(raf);
            cancelIntro();
            ro.disconnect();
            io.disconnect();
            el.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointermove', onMoveDrag);
            el.removeEventListener('click', onClick);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('deviceorientation', onTilt);
            if (mouseConstraint) Mouse.clearSourceEvents(mouseConstraint.mouse);
            Composite.clear(world, false);
            Engine.clear(engine);
            el.classList.remove(styles.live, styles.dragging);
            items.forEach((n) => { n.style.transform = ''; });
        };
    }, [scrollTarget, router]);

    return (
        <div ref={stage} className={`${styles.stage} ${className}`}>
            {WORDS.map((w) => (
                <a
                    key={w.label}
                    href="/services"
                    data-body="pill"
                    draggable={false}
                    className={`${styles.pill} ${styles[w.tone]} ${w.wide ? styles.wideOnly : ''}`}
                >
                    {w.label}
                </a>
            ))}
            {TOKENS.map((t) => (
                <span key={t} data-body="hex" className={`${styles.hex} ${styles[t]}`} aria-hidden="true" />
            ))}
        </div>
    );
}
