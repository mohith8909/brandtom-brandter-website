'use client';
import { useRef } from 'react';
import Image from 'next/image';
import styles from './ServicesGallery.module.css';
import { gsap, useGSAP } from '../Motion/gsap';

/*
 * Desktop: the section pins and the service cards travel sideways as you scroll,
 * with a progress bar and each card's photo drifting inside its frame.
 * Mobile / reduced motion: a plain stacked grid.
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

            gsap.from(`.${styles.card}`, {
                y: 80, autoAlpha: 0, stagger: 0.08, duration: 1.2, ease: 'expo.out',
                scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
            });
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
                    <article key={service.id} className={styles.card} data-cursor="Explore">
                        <div className={styles.frame}>
                            <div className={styles.photo}>
                                <Image src={service.image} alt={service.title} fill sizes="(max-width: 1024px) 100vw, 34vw" />
                            </div>
                            <div className={styles.overlay} />
                        </div>
                        <div className={styles.content}>
                            <span className={styles.number}>{service.id}</span>
                            <h3 className={styles.title}>{service.title}</h3>
                            <p className={styles.desc}>{service.desc}</p>
                        </div>
                    </article>
                ))}
            </div>
            <div className={styles.progress} aria-hidden="true"><div className={styles.progressFill} /></div>
        </section>
        </div>
    );
}
