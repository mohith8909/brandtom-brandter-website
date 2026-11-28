'use client';
import { useRef } from 'react';
import Image from 'next/image';
import styles from './ServicesGallery.module.css';
import Link from 'next/link';
import { gsap, useGSAP } from '../Motion/gsap';
import { registerAnchor } from '../Motion/anchors';

/*
 * Desktop: the section pins and the service cards travel sideways as you scroll,
 * with a progress bar and each card's photo drifting inside its frame.
 * Mobile / reduced motion: a plain stacked grid.
 *
 * Each card has an id (its slug), so /services#digital-marketing opens that card. On the
 * pinned desktop row a card's place depends on how far the row has slid, so the cards
 * register their own scroll positions (components/Motion/anchors.js).
 */
export default function ServicesGallery({ services }) {
    const root = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
            const track = root.current.querySelector(`.${styles.track}`);
            const distance = () => track.scrollWidth - window.innerWidth;

            const tween = gsap.to(track, {
                x: () => -distance(),
                ease: 'none',
                scrollTrigger: {
                    trigger: root.current,
                    start: 'top top',
                    end: () => `+=${distance()}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => gsap.set(`.${styles.progressFill}`, { scaleX: self.progress }),
                },
            });

            gsap.utils.toArray(`.${styles.photo}`).forEach((photo) => {
                gsap.fromTo(photo, { xPercent: -8 }, {
                    xPercent: 8,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: photo.parentElement,
                        containerAnimation: tween,
                        start: 'left right',
                        end: 'right left',
                        scrub: true,
                    },
                });
            });

            // Scroll position at which each card sits in the middle of the screen
            const unregister = gsap.utils.toArray(`.${styles.card}`).map((card) => registerAnchor(card.id, ({ immediate }) => {
                const st = tween.scrollTrigger;
                const d = distance();
                if (!st || d <= 0) return;
                const x = gsap.utils.clamp(0, d, card.offsetLeft - (window.innerWidth - card.offsetWidth) / 2);
                const y = st.start + (x / d) * (st.end - st.start);
                if (window.__lenis) window.__lenis.scrollTo(y, { immediate, force: true, duration: 1.6 });
                else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
            }));

            gsap.from(`.${styles.card}`, {
                y: 80, autoAlpha: 0, stagger: 0.08, duration: 1.2, ease: 'expo.out',
                scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
            });

            return () => unregister.forEach((u) => u());
        });
        return () => mm.revert();
    }, { scope: root });

    return (
        <div className={styles.pinWrap}>
            <section ref={root} className={styles.gallery}>
            <div className={styles.track}>
                <div className={styles.intro}>
                    <span className={styles.introLabel}>What we do</span>
                    <p className={styles.introText}>Eight disciplines. One idea carried all the way to impact.</p>
                    <span className={styles.introHint}>Scroll →</span>
                </div>
                {services.map((service) => (
                    <article key={service.id} id={service.slug} className={styles.card} aria-labelledby={`${service.slug}-title`}>
                        <div className={styles.frame}>
                            <div className={styles.photo}>
                                <Image src={service.image} alt={service.title} fill sizes="(max-width: 1024px) 100vw, 34vw" />
                            </div>
                            <div className={styles.overlay} />
                        </div>
                        <div className={styles.content}>
                            <span className={styles.number}>{service.id}</span>
                            <h3 id={`${service.slug}-title`} className={styles.title}>{service.title}</h3>
                            <p className={styles.desc}>{service.desc}</p>
                            <Link href="/contact-us" className={styles.cta}>
                                Start a project <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
            <div className={styles.progress} aria-hidden="true"><div className={styles.progressFill} /></div>
        </section>
        </div>
    );
}
