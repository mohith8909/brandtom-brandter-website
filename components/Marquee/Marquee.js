import styles from './Marquee.module.css';

export default function Marquee() {
    return (
        <div className={styles.marqueeSection}>
            <div className={styles.track}>
                <span className={styles.text}>Creative Campaigns <span className={styles.dot}>•</span> Brand Strategy & Ideation <span className={styles.dot}>•</span> Content & Copy Writing <span className={styles.dot}>•</span> Brand Communication <span className={styles.dot}>•</span> Digital Marketing <span className={styles.dot}>•</span> </span>
                <span className={`${styles.text} ${styles.filled}`}>Creative Campaigns <span className={styles.dot}>•</span> Brand Strategy & Ideation <span className={styles.dot}>•</span> Content & Copy Writing <span className={styles.dot}>•</span> Brand Communication <span className={styles.dot}>•</span> Digital Marketing <span className={styles.dot}>•</span> </span>
            </div>
            <div className={styles.trackReverse}>
                <span className={`${styles.text} ${styles.filled}`}>Graphic Designing <span className={styles.dot}>•</span> Content Production <span className={styles.dot}>•</span> ATL/BTL Promotion <span className={styles.dot}>•</span> Influencer Marketing <span className={styles.dot}>•</span> </span>
                <span className={styles.text}>Graphic Designing <span className={styles.dot}>•</span> Content Production <span className={styles.dot}>•</span> ATL/BTL Promotion <span className={styles.dot}>•</span> Influencer Marketing <span className={styles.dot}>•</span> </span>
            </div>
        </div>
    );
}
