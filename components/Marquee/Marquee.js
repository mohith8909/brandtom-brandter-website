import styles from './Marquee.module.css';

export default function Marquee() {
    return (
        <div className={styles.marqueeSection}>
            <div className={styles.track}>
                <span className={styles.text}>Web Development <span className={styles.dot}>•</span> Digital Marketing <span className={styles.dot}>•</span> Branding <span className={styles.dot}>•</span> </span>
                <span className={`${styles.text} ${styles.filled}`}>Web Development <span className={styles.dot}>•</span> Digital Marketing <span className={styles.dot}>•</span> Branding <span className={styles.dot}>•</span> </span>
                <span className={styles.text}>Web Development <span className={styles.dot}>•</span> Digital Marketing <span className={styles.dot}>•</span> Branding <span className={styles.dot}>•</span> </span>
                <span className={`${styles.text} ${styles.filled}`}>Web Development <span className={styles.dot}>•</span> Digital Marketing <span className={styles.dot}>•</span> Branding <span className={styles.dot}>•</span> </span>
            </div>
            <div className={styles.trackReverse}>
                <span className={`${styles.text} ${styles.filled}`}>Strategy <span className={styles.dot}>•</span> Creative Design <span className={styles.dot}>•</span> Growth <span className={styles.dot}>•</span> </span>
                <span className={styles.text}>Strategy <span className={styles.dot}>•</span> Creative Design <span className={styles.dot}>•</span> Growth <span className={styles.dot}>•</span> </span>
                <span className={`${styles.text} ${styles.filled}`}>Strategy <span className={styles.dot}>•</span> Creative Design <span className={styles.dot}>•</span> Growth <span className={styles.dot}>•</span> </span>
                <span className={styles.text}>Strategy <span className={styles.dot}>•</span> Creative Design <span className={styles.dot}>•</span> Growth <span className={styles.dot}>•</span> </span>
            </div>
        </div>
    );
}
