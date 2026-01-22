import styles from './Approach.module.css';

export default function Approach() {
    return (
        <section className={styles.approach}>
            <div className="container">
                <h2 className={styles.heading}>Blending Psychology with Precision</h2>
                <div className={styles.content}>
                    <div className={styles.item}>
                        <h3>Strategy with Storytelling</h3>
                        <p>
                            We understand not just how audiences think, but why they connect. We decode your brand’s purpose to shape a narrative that is clear, relatable, and meaningful.
                        </p>
                    </div>
                    <div className={styles.item}>
                        <h3>Creativity with Precision</h3>
                        <p>
                            Creativity ensuring every idea finds its full form. We merge impact with intent—visually striking, strategically aligned, and execution-ready.
                        </p>
                    </div>
                    <div className={styles.item}>
                        <h3>Data with Human Insight</h3>
                        <p>
                            We merge hard data insights with emotional understanding, ensuring decisions are not just “smart” but culturally relevant and audience-aware.
                        </p>
                    </div>
                    <div className={styles.item}>
                        <h3>Budget Aligned Execution</h3>
                        <p>
                            Smart execution designed around your budget. We ensure that every campaign is delivered to its fullest potential without compromising on quality or impact.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
