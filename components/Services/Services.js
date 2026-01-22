"use client";

import styles from './Services.module.css';
import Image from 'next/image';
import Link from 'next/link';
import FadeIn from '../UI/FadeIn';
import { useEffect, useRef } from 'react';

export default function Services() {
    const scrollRef = useRef(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let scrollAmount = 0;
        const speed = 1; // Pixels per tick for smooth scroll
        const delay = 30; // ms interval

        const scrollInterval = setInterval(() => {
            // Dynamic scroll amount (card width + gap)
            const firstCard = scrollContainer.firstElementChild;
            const scrollStep = firstCard ? firstCard.clientWidth + 30 : 380; // Default fallback

            if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
                scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                scrollContainer.scrollBy({ left: scrollStep, behavior: 'smooth' });
            }
        }, 3000); // 3 seconds per slide

        return () => clearInterval(scrollInterval);
    }, []);

    const services = [
        {
            title: "Creative Campaigns",
            desc: "Designing and executing full scale marketing campaigns that capture attention and drive engagement.",
            bg: "/assets/new/hero_creative_director_1769107562116.png"
        },
        {
            title: "Brand Strategy & Ideation",
            desc: "Crafting the core strategy, positioning and innovative ideas that define your brand’s purpose.",
            bg: "/assets/new/expertise_strategy_1769107734480.png"
        },
        {
            title: "Content & Copy Writing",
            desc: "Developing your brand’s voice through compelling copywriting, messaging and brand communication.",
            bg: "/assets/new/hero_designer_sketch_1769107615839.png"
        },
        {
            title: "Brand Communication",
            desc: "Refining your brand’s voice, narration and visual language to create meaningful connections with your target audience. We translate your values into simple stories that inspire trust and long-term loyalty.",
            bg: "/assets/new/hero_abstract_art_1769107632040.png"
        },
        {
            title: "Digital Marketing",
            desc: "Helping brands reach the right audience online through targeted ads, social media, SEO and tools to boost visibility, drive engagement and deliver measurable business growth.",
            bg: "/assets/new/hero_digital_tech_1769107581068.png"
        },
        {
            title: "Graphic Designing",
            desc: "Creating visual content that communicates ideas clearly and attractively, ensuring visual impact and effective communication.",
            bg: "/assets/new/services_digital_arch_1769107669538.png"
        },
        {
            title: "Content Production",
            desc: "Creating engaging ad films, videos, product shots and social media content that tells your brand’s story and drive audience engagement across platforms.",
            bg: "/assets/new/services_production_1769107701682.png"
        },
        {
            title: "ATL/ BTL Activations",
            desc: "ATL builds broad brand awareness through mass media, while BTL drives direct consumer engagement and conversions. Together, they ensure visibility and action.",
            bg: "/assets/new/hero_modern_office_1769107598640.png"
        },
        {
            title: "Influencer Marketing",
            desc: "Leveraging trusted creators to authentically promote brands, boosting reach, credibility, and consumer engagement.",
            bg: "/assets/new/services_spark_1769107685292.png"
        }
    ];

    return (
        <section className={styles.services} id="services">
            <div className="container">
                <FadeIn tag="h2" className={styles.heading}>The Core Pillars</FadeIn>
                <div className={styles.grid} ref={scrollRef}>
                    {services.map((service, index) => (
                        <FadeIn key={index} delay={index * 0.15} className={styles.card}>
                            <Image
                                src={service.bg}
                                alt={service.title}
                                fill
                                className={styles.cardBackground}
                            />
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            <p className={styles.cardDesc}>{service.desc}</p>
                            <Link href="/contact-us" className={styles.cardLink}>Learn More</Link>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
