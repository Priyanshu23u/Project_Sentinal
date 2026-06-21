import styles from "./StatusPill.module.css";

/**
 * Small status indicator: a dot (optionally pulsing) + label.
 * tone: "success" | "danger" | "warning" | "info" | "neutral"
 */
export default function StatusPill({ tone = "neutral", label, pulse = false, icon = null }) {
  return (
    <span className={`${styles.pill} ${styles[tone]}`}>
      <span className={styles.dotWrap}>
        {pulse && <span className={styles.ring} />}
        <span className={styles.dot} />
      </span>
      {icon}
      <span>{label}</span>
    </span>
  );
}
