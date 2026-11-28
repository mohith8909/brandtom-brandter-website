'use client';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Work.module.css';
import SplitReveal from '../Motion/SplitReveal';
import { serviceHref } from '../Motion/anchors';
import { gsap, useGSAP, prefersReducedMotion } from '../Motion/gsap';

/*
 * Showcase on a horizontal scroll.
 *
 * Desktop: the section pins and scrolling down slides the row of cards sideways.
 * Cards lean with scroll speed, their pictures drift inside the frame, and hovering
 * one sends a liquid ripple through its picture (and plays its video, if it has one).
 * Phones, tablets and reduced motion: the same row as a native swipe carousel.
 *
 * To turn a card into a real case study, change its text and image, and optionally
 * add `video: '/assets/work/name.mp4'` (a short, muted loop) and a `href`.
 */
const ITEMS = [
    { title: 'Insight & ideation', href: serviceHref('brand-strategy'), tags: 'Research · The big idea', color: 'var(--c-coral)', img: '/assets/opt/work-spark.webp' },
    { title: 'Brand strategy', href: serviceHref('brand-strategy'), tags: 'Positioning · Planning', color: 'var(--c-blue)', img: '/assets/opt/work-strategy.webp' },
    { title: 'Identity & design', href: serviceHref('graphic-design'), tags: 'Logos · Systems · Print', color: 'var(--c-magenta)', img: '/assets/opt/work-design.webp' },
    { title: 'Ad films & shoots', href: serviceHref('content-production'), tags: 'Production · Direction', color: 'var(--c-plum)', img: '/assets/opt/work-film.webp' },
    { title: 'Content that moves', href: serviceHref('content-copywriting'), tags: 'Social · Copy · Reels', color: 'var(--c-royal)', img: '/assets/opt/work-content.webp' },
    { title: 'Digital growth', href: serviceHref('digital-marketing'), tags: 'Performance · SEO · Influencers', color: 'var(--c-lime)', img: '/assets/opt/work-digital.webp' },
];

const pad = (n) => String(n).padStart(2, '0');

export default function Work() {
    const root = useRef(null);
    const track = useRef(null);

    useGSAP(() => {
        if (prefersReducedMotion()) return undefined;
        const q = gsap.utils.selector(root);
        const cards = q(`.${styles.card}`);
        const count = q(`.${styles.countNow}`)[0];
        const bar = q(`.${styles.barFill}`)[0];

        // Liquid ripple through a card's picture on hover (SVG displacement filter).
        // Safari draws SVG filters on HTML badly (the picture can blank out), so it gets
        // the zoom and colour wash only.
        const ua = navigator.userAgent;
        const svgFiltersOk = !(/Safari\//.test(ua) && !/Chrome|Chromium|CriOS|Edg|Android/.test(ua));
        const ripple = (i) => {
            if (!svgFiltersOk) return;
            const wrap = q(`.${styles.imgWrap}`)[i];
            const disp = q(`#work-disp-${i}`)[0];
            const turb = q(`#work-turb-${i}`)[0];
            if (!wrap || !disp) return;
            gsap.killTweensOf([disp, turb]);
            wrap.style.filter = `url(#work-ripple-${i})`;
            gsap.timeline({ onComplete: () => { wrap.style.filter = ''; } })
                .fromTo(disp, { attr: { scale: 0 } }, { attr: { scale: 45 }, duration: 0.35, ease: 'power2.out' })
                .to(disp, { attr: { scale: 0 }, duration: 1.2, ease: 'power3.out' })
                .fromTo(turb, { attr: { baseFrequency: '0.012 0.04' } }, { attr: { baseFrequency: '0.004 0.012' }, duration: 1.55, ease: 'power2.out' }, 0);
        };
        const enters = cards.map((card, i) => {
            const video = card.querySelector('video');
            const on = () => { ripple(i); video?.play().catch(() => {}); };
            const off = () => { video?.pause(); };
            card.addEventListener('mouseenter', on);
            card.addEventListener('mouseleave', off);
            return () => { card.removeEventListener('mouseenter', on); card.removeEventListener('mouseleave', off); };
        });

        const mm = gsap.matchMedia();
        mm.add('(min-width: 901px)', () => {
            root.current.classList.add(styles.pinned);
            const distance = () => track.current.scrollWidth - track.current.parentElement.clientWidth;
            const lean = cards.map((c) => gsap.quickTo(c, 'skewX', { duration: 0.6, ease: 'power3' }));
            let shown = -1;

            const slide = gsap.to(track.current, {
                x: () => -distance(),
                ease: 'none',
                scrollTrigger: {
                    trigger: root.current,
                    start: 'top top',
                    end: () => `+=${distance()}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        bar.style.transform = `scaleX(${self.progress})`;
                        const idx = Math.min(ITEMS.length, Math.round(self.progress * (ITEMS.length - 1)) + 1);
                        if (idx !== shown) { shown = idx; count.textContent = pad(idx); }
                        const v = gsap.utils.clamp(-7, 7, self.getVelocity() / -350);
                        lean.forEach((fn) => fn(v));
                    },
                    onScrubComplete: () => lean.forEach((fn) => fn(0)),
                },
            });

            // Each picture drifts inside its frame as its card crosses the screen.
            // (Moves the wrapper, not the image, so the image keeps its CSS hover zoom.)
            q(`.${styles.imgWrap}`).forEach((wrap) => {
                gsap.fromTo(wrap, { xPercent: -6 }, {
                    xPercent: 6, ease: 'none',
                    scrollTrigger: { trigger: wrap.closest(`.${styles.card}`), containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
                });
            });

            // Keyboard users: tabbing to a card that is off to the side scrolls the page
            // to the point where that card has slid into view
            const onFocus = (e) => {
                const item = e.target.closest('li');
                const st = slide.scrollTrigger;
                if (!item || !st) return;
                const viewW = track.current.parentElement.clientWidth;
                const target = gsap.utils.clamp(0, distance(), item.offsetLeft - (viewW - item.offsetWidth) / 2);
                const y = st.start + (target / distance()) * (st.end - st.start);
                if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
            };
            const trackEl = track.current;
            trackEl.addEventListener('focusin', onFocus);

            return () => {
                trackEl.removeEventListener('focusin', onFocus);
                root.current?.classList.remove(styles.pinned);
            };
        });

        return () => { mm.revert(); enters.forEach((f) => f()); };
    }, { scope: root });

    return (
        <div className={styles.pinWrap}>
            <section ref={root} className={styles.work} id="work">
                <div className={styles.head}>
                    <div>
                        <span className={styles.label}>Showcase</span>
                        <SplitReveal tag="h2" className={styles.heading}>Ideas, in motion</SplitReveal>
                    </div>
                    <div className={styles.progress} aria-hidden="true">
                        <span className={styles.count}><span className={styles.countNow}>01</span> / {pad(ITEMS.length)}</span>
                        <span className={styles.bar}><span className={styles.barFill} /></span>
                    </div>
                </div>

                <div className={styles.viewport}>
                    <ul ref={track} className={styles.track}>
                        {ITEMS.map((it, i) => (
                            <li key={it.title} className={styles.card} style={{ '--c': it.color }}>
                                <Link href={it.href || '/services'} className={styles.cardLink} data-cursor="Explore">
                                    <div className={styles.media}>
                                        <div className={styles.imgWrap}>
                                            <Image src={it.img} alt="" fill sizes="(max-width: 900px) 75vw, 420px" className={styles.img} />
                                            {it.video && <video className={styles.video} src={it.video} muted loop playsInline preload="none" />}
                                        </div>
                                        <span className={styles.tint} />
                                        <span className={styles.num}>{pad(i + 1)}</span>
                                    </div>
                                    <div className={styles.meta}>
                                        <h3 className={styles.title}>{it.title}</h3>
                                        <span className={styles.tags}>{it.tags}</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                        <li className={styles.endCard}>
                            <p className={styles.endText}>Your brand, <span className={styles.endSpectrum}>next.</span></p>
                            <Link href="/contact-us" className={styles.endCta}>Start a project <span aria-hidden="true">→</span></Link>
                        </li>
                    </ul>
                </div>

                {/* One ripple filter per card, so each animates on its own */}
                <svg className={styles.filters} aria-hidden="true" focusable="false">
                    {ITEMS.map((_, i) => (
                        <filter key={i} id={`work-ripple-${i}`} x="-10%" y="-10%" width="120%" height="120%">
                            <feTurbulence id={`work-turb-${i}`} type="fractalNoise" baseFrequency="0.02 0.06" numOctaves="2" seed={i + 3} result="noise" />
                            <feDisplacementMap id={`work-disp-${i}`} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                    ))}
                </svg>
            </section>
        </div>
    );
}
