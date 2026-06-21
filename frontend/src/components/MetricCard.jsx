import Sparkline from "./Sparkline";
import styles from "./MetricCard.module.css";

const TONE_VAR = {
  brand: "var(--color-brand-strong)",
  success: "var(--color-success)",
  danger: "var(--color-danger)",
  info: "var(--color-info)",
};

export default function MetricCard({
  title,
  value,
  unit,
  icon,
  tone = "brand",
  trendData,
  hint,
  loading = false,
}) {
  const color = TONE_VAR[tone] ?? TONE_VAR.brand;

  return (
    <div className={`${styles.card} ${loading ? styles.loadingCard : ""}`}>
      <div className={styles.top}>
        <span className={styles.label}>{title}</span>
        <span className={styles.iconWrap} style={{ color }}>
          {icon}
        </span>
      </div>

      <div className={styles.valueRow}>
        <span className={`${styles.value} tabular ${loading ? "skeleton" : ""}`}>
          {loading ? "0000" : value}
        </span>
        {unit && !loading && <span className={styles.unit}>{unit}</span>}
      </div>

      <div className={styles.bottom}>
        {hint && <span className={styles.hint}>{hint}</span>}
        {!loading && trendData && trendData.length > 1 && (
          <Sparkline data={trendData} color={color} />
        )}
      </div>
    </div>
  );
}
