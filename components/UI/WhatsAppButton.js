'use client';
import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import styles from './WhatsAppButton.module.css';
import { CONTACT } from '../site';
import { whenIntroDone } from '../Motion/gsap';

/*
 * Floating "Chat on WhatsApp" button for phones and tablets (hidden on desktop, where
 * the header always shows Let's Talk and the phone number). It slides in once the
 * intro has finished, so it never sits on top of the logo animation.
 */
export default function WhatsAppButton() {
    const [shown, setShown] = useState(false);
    useEffect(() => whenIntroDone(() => setShown(true)), []);

    return (
        <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.whatsappBtn} ${shown ? styles.shown : ''}`}
            aria-label="Chat with us on WhatsApp"
        >
            <MessageCircle size={26} aria-hidden="true" />
        </a>
    );
}
