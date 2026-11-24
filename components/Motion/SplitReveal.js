'use client';
import { Children, isValidElement, useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion, whenIntroDone } from './gsap';

/*
 * Splits text into words that rise from behind a mask.
 *   mode="rise" (default) – words slide up once when scrolled into view (or on load with onLoad)
 *   mode="fill"           – words brighten from dim to solid as you scroll through the heading
 */
function splitWords(children, mode) {
    const out = [];
    let key = 0;
    Children.forEach(children, (child) => {
        if (typeof child === 'string' || typeof child === 'number') {
            String(child).split(/(\s+)/).forEach((part) => {
                if (!part) return;
                if (/^\s+$/.test(part)) { out.push(' '); return; }
                out.push(
                    <span key={key++} className="sr-mask">
                        <span className={`sr-word ${mode === 'fill' ? 'sr-fill' : ''}`}>{part}</span>
                    </span>
                );
            });
        } else if (isValidElement(child)) {
            out.push(
                <span key={key++} className="sr-mask">
                    <span className={`sr-word ${mode === 'fill' ? 'sr-fill' : ''}`}>{child}</span>
                </span>
            );
        }
    });
    return out;
}

export default function SplitReveal({
    children,
    tag: Tag = 'div',
    className = '',
    delay = 0,
    stagger = 0.06,
    onLoad = false,
    mode = 'rise',
    ...rest
}) {
    const ref = useRef(null);

    useGSAP(() => {
        const words = ref.current.querySelectorAll('.sr-word');
        if (prefersReducedMotion()) {
            gsap.set(words, { y: 0, yPercent: 0, rotate: 0, opacity: 1 });
            return;
        }

        if (mode === 'fill') {
            gsap.to(words, {
                opacity: 1,
                stagger: 0.1,
                ease: 'none',
                scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'bottom 45%', scrub: true },
            });
            return;
        }

        const play = () =>
            gsap.to(words, {
                y: 0,
                yPercent: 0,
                rotate: 0,
                duration: 1.1,
                stagger,
                delay,
                ease: 'expo.out',
            });

        if (onLoad) return whenIntroDone(play);

        gsap.to(words, {
            y: 0,
            yPercent: 0,
            rotate: 0,
            duration: 1.1,
            stagger,
            delay,
            ease: 'expo.out',
            scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        });
    }, { scope: ref });

    return (
        <Tag ref={ref} className={className} {...rest}>
            {splitWords(children, mode)}
        </Tag>
    );
}
