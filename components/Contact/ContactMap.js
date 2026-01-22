import styles from './ContactMap.module.css';

export default function ContactMap() {
    return (
        <section className={styles.mapSection}>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1945.8973710777322!2d80.270500!3d13.084306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDA1JzAzLjUiTiA4MMKwMTYnMTMuOCJF!5e0!3m2!1sen!2sin!4v1716388800000!5m2!1sen!2sin"
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
