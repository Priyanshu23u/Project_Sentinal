import { useEffect, useRef, useState } from "react";
import { IconCheckCircle, IconAlertTriangle, IconXCircle } from "./icons";
import styles from "./CircuitStatus.module.css";

const STATE_CONFIG = {
  CLOSED: {
    tone: "success",
    icon: IconCheckCircle,
    headline: "Operating normally",
    description: "Requests are flowing freely. The circuit is closed and traffic is reaching the primary service without interruption.",
  },
  OPEN: {
    tone: "danger",
    icon: IconXCircle,
    headline: "Circuit tripped",
    description: "Failures crossed the threshold. Traffic has been cut off from the primary service and is being routed to the secondary failover.",
  },
  HALF_OPEN: {
    tone: "warning",
    icon: IconAlertTriangle,
    headline: "Probing recovery",
    description: "A limited number of test requests are being let through to check whether the primary service has recovered.",
  },
};

function formatElapsed(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function CircuitStatus({ state, loading = false }) {
  const config = STATE_CONFIG[state] ?? STATE_CONFIG.CLOSED;
  const Icon = config.icon;

  const stateRef = useRef(state);
  const sinceRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (sinceRef.current === null) {
      sinceRef.current = Date.now();
    }
    if (stateRef.current !== state) {
      stateRef.current = state;
      sinceRef.current = Date.now();
      setElapsed(0);
    }
  }, [state]);

  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - (sinceRef.current ?? Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className={`${styles.card} ${styles[config.tone]} ${loading ? styles.loading : ""}`}
      aria-live="polite"
    >
      <div className={styles.iconWrap}>
        <Icon size={26} />
      </div>

      <div className={styles.content}>
        <div className={styles.eyebrowRow}>
          <span className={styles.eyebrow}>Circuit Breaker</span>
          <span className={styles.since}>
            Stable for <strong className="tabular">{loading ? "—" : formatElapsed(elapsed)}</strong>
          </span>
        </div>

        <h1 className={styles.state}>{loading ? "Connecting…" : `${config.headline}`}</h1>
        <p className={styles.description}>
          {loading ? "Waiting for the first signal from the live feed." : config.description}
        </p>
      </div>

      <div className={styles.badge}>
        <span className={styles.badgeLabel}>State</span>
        <span className={styles.badgeValue}>{loading ? "—" : state}</span>
      </div>
    </section>
  );
}
