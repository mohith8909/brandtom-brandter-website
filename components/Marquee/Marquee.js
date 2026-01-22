import styles from './Marquee.module.css';

export default function Marquee() {
    return (
        <div className={styles.marqueeSection}>
            <div className={styles.track}>
                <span className={styles.text}>Web Development • Digital Marketing • Branding • </span>
                <span className={`${styles.text} ${styles.filled}`}>Web Development • Digital Marketing • Branding • </span>
                <span className={styles.text}>Web Development • Digital Marketing • Branding • </span>
                <span className={`${styles.text} ${styles.filled}`}>Web Development • Digital Marketing • Branding • </span>
            </div>
            <div className={styles.trackReverse}>
                <span className={`${styles.text} ${styles.filled}`}>Strategy • Creative Design • Growth • </span>
                <span className={styles.text}>Strategy • Creative Design • Growth • </span>
                <span className={`${styles.text} ${styles.filled}`}>Strategy • Creative Design • Growth • </span>
                <span className={styles.text}>Strategy • Creative Design • Growth • </span>
            </div>
        </div>
    );
}
