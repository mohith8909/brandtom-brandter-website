import styles from './ContactMap.module.css';

export default function ContactMap() {
    return (
        <section className={styles.mapSection}>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.791908135122!2d80.19956119999999!3d13.048913599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52670068db71f7%3A0x13dc340cc2e4efd0!2sBrandtom%20%26%20Brandter%20India%20Private%20Limited!5e0!3m2!1sen!2sin!4v1769489543786!5m2!1sen!2sin"
                width="100%"
                height="600"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </section>
    );
}
