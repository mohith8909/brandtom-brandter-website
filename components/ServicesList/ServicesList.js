'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ServicesList.module.css';
import SplitReveal from '../Motion/SplitReveal';
import { serviceHref } from '../Motion/anchors';
import { gsap, useGSAP, prefersReducedMotion } from '../Motion/gsap';

// Each service owns a logo colour by meaning:
// coral = campaigns/promotion, blue = strategy/digital, magenta & plum = content/design, lime = growth
const SERVICES = [
    { slug: 'creative-campaigns', name: 'Creative Campaigns', tag: 'Ideas that get noticed', color: 'var(--c-coral)', on: '#0A0A0F', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=70&w=600&auto=format&fit=crop' },
    { slug: 'brand-strategy', name: 'Brand Strategy & Ideation', tag: 'Positioning with purpose', color: 'var(--c-blue)', on: '#0A0A0F', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=70&w=600&auto=format&fit=crop' },
    { slug: 'content-copywriting', name: 'Content & Copywriting', tag: 'A voice people remember', color: 'var(--c-magenta)', on: '#FFFFFF', img: 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=70&w=600&auto=format&fit=crop' },
    { slug: 'brand-communication', name: 'Brand Communication', tag: 'Values into stories', color: 'var(--c-plum)', on: '#FFFFFF', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=70&w=600&auto=format&fit=crop' },
    { slug: 'digital-marketing', name: 'Digital Marketing', tag: 'Reach, measured', color: 'var(--c-royal)', on: '#FFFFFF', img: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=70&w=600&auto=format&fit=crop' },
    { slug: 'graphic-design', name: 'Graphic Designing', tag: 'Visuals with impact', color: 'var(--c-magenta)', on: '#FFFFFF', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=70&w=600&auto=format&fit=crop' },
    { slug: 'content-production', name: 'Content Production', tag: 'Ad films, shoots, social', color: 'var(--c-coral)', on: '#0A0A0F', img: 'https://images.unsplash.com/photo-1639426131676-ff5f24493f2c?fm=jpg&q=60&w=600&auto=format&fit=crop' },
    { slug: 'influencer-marketing', name: 'Influencer Marketing', tag: 'Trusted voices, real growth', color: 'var(--c-lime)', on: '#0A0A0F', img: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?fm=jpg&q=60&w=600&auto=format&fit=crop' },
];

export default function ServicesList() {
    const root = useRef(null);
    const preview = useRef(null);
    const [active, setActive] = useState(-1);

    useGSAP(() => {
        if (prefersReducedMotion()) return;
        const q = gsap.utils.selector(root);

        // Rows slide in from below one after another
        gsap.from(q(`.${styles.row}`), {
            yPercent: 60, autoAlpha: 0, duration: 1.1, stagger: 0.07, ease: 'expo.out',
            scrollTrigger: { trigger: q(`.${styles.list}`)[0], start: 'top 85%', once: true },
        });

        // Hexagon photo trails the cursor, tilting with its speed
        if (!window.matchMedia('(pointer: fine)').matches) return;
        const el = preview.current;
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
        const rTo = gsap.quickTo(el, 'rotate', { duration: 0.5, ease: 'power3' });
        let lastX = 0;
        const move = (e) => {
            const r = root.current.getBoundingClientRect();
            xTo(e.clientX - r.left);
            yTo(e.clientY - r.top);
            rTo(gsap.utils.clamp(-18, 18, (e.clientX - lastX) * 0.6));
            lastX = e.clientX;
        };
        root.current.addEventListener('mousemove', move);
        return () => root.current?.removeEventListener('mousemove', move);
    }, { scope: root });

    return (
        <section ref={root} className={styles.section} id="services-list">
            <div className={styles.head}>
                <span className={styles.label}>What we do</span>
                <SplitReveal tag="h2" className={styles.heading}>Eight ways we make ideas matter</SplitReveal>
            </div>

            <ul className={styles.list} onMouseLeave={() => setActive(-1)}>
                {SERVICES.map((s, i) => (
                    <li
                        key={s.name}
                        className={`${styles.row} ${active === i ? styles.rowActive : ''}`}
                        style={{ '--row-c': s.color, '--row-on': s.on }}
                        onMouseEnter={() => setActive(i)}
                    >
                        <Link href={serviceHref(s.slug)} className={styles.rowLink} data-cursor="View">
                            <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                            <span className={styles.name}>{s.name}</span>
                            <span className={styles.tag}>{s.tag}</span>
                            <span className={styles.arrow} aria-hidden="true">↗</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div ref={preview} className={styles.preview} aria-hidden="true">
                <div className={`${styles.previewInner} ${active >= 0 ? styles.previewOn : ''}`}>
                    {SERVICES.map((s, i) => (
                        <div key={s.name} className={`${styles.previewImg} ${active === i ? styles.previewImgOn : ''}`}>
                            <Image src={s.img} alt="" fill sizes="320px" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
