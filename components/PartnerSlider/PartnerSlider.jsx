'use client';
import React from 'react';
import Image from 'next/image';
import styles from './PartnerSlider.module.css';

const partners = [
    'quantum-agency-partner-1.png',
    'quantum-agency-partner-2.png',
    'quantum-agency-partner-3.png',
    'quantum-agency-partner-4.png',
    'quantum-agency-partner-5.png',
    'quantum-agency-partner-6.png',
    'quantum-agency-partner-7.png',
    'quantum-agency-partner-8.png',
    'quantum-agency-partner-9.png',
];

const PartnerSlider = () => {
    return (
        <section className={styles.partnerSection}>
            <div className={styles.container}>
                <div className={styles.slider}>
                    <div className={styles.track}>
                        {/* First set of logos */}
                        {partners.map((partner, index) => (
                            <div key={`partner-1-${index}`} className={styles.slide}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={`/assets/${partner}`}
                                        alt={`Partner ${index + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 100px, 150px"
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                            </div>
                        ))}
                        {/* Duplicate set for seamless loop */}
                        {partners.map((partner, index) => (
                            <div key={`partner-2-${index}`} className={styles.slide}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={`/assets/${partner}`}
                                        alt={`Partner ${index + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 100px, 150px"
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerSlider;
