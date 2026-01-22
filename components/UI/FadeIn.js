'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FadeIn({
    children,
    delay = 0,
    duration = 0.8,
    yOffset = 20,
    className = "",
    tag = "div"
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    const Component = motion[tag] || motion.div;

    return (
        <Component
            ref={ref}
            initial={{ opacity: 0, y: yOffset }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
            transition={{ duration: duration, delay: delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={className}
        >
            {children}
        </Component>
    );
}
