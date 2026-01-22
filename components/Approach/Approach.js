import styles from './Approach.module.css';

export default function Approach() {
    return (
        <section className={styles.approach}>
            <div className="container">
                <h2 className={styles.heading}>Blending Psychology with Precision</h2>
                <div className={styles.content}>
                    <div className={styles.item}>
                        <h3>Strategy Meets Storytelling</h3>
                        <p>
                            The Logic: We begin by decoding your brand’s purpose and audience behavior. This foundation shapes a narrative that is clear, relatable, and meaningful, ensuring your message isn’t just heard, but felt.
                        </p>
                    </div>
                    <div className={styles.item}>
                        <h3>Creativity with Precision</h3>
                        <p>
                            The Craft: For us, creativity isn’t just about looking good—it’s about working effectively. Our ideas are crafted with surgical intent—visually striking, strategically aligned, and execution-ready.
                        </p>
                    </div>
                    <div className={styles.item}>
                        <h3>Data Guided, Human Driven</h3>
                        <p>
                            The Insight: We merge hard data insights with emotional understanding. This ensures our decisions are not just “smart” according to the numbers, but also culturally relevant and audience-aware.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
