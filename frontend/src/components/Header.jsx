import { IconShield, IconWifi, IconWifiOff } from "./icons";
import StatusPill from "./StatusPill";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

const CONNECTION_CONFIG = {
  connecting: { tone: "warning", label: "Connecting", pulse: true, icon: <IconWifi size={12} /> },
  live: { tone: "success", label: "Live", pulse: true, icon: <IconWifi size={12} /> },
  offline: { tone: "danger", label: "Reconnecting", pulse: false, icon: <IconWifiOff size={12} /> },
};

export default function Header({ connectionStatus = "connecting" }) {
  const connection = CONNECTION_CONFIG[connectionStatus] ?? CONNECTION_CONFIG.connecting;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logoMark} aria-hidden="true">
            <IconShield size={20} />
          </span>
          <div className={styles.brandText}>
            <span className={styles.wordmark}>Sentinel</span>
            <span className={styles.tagline}>Resilience &amp; Traffic Control</span>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          <span className={`${styles.navItem} ${styles.navItemActive}`}>Overview</span>
          <span className={styles.navItem}>Circuits</span>
          <span className={styles.navItem}>Routes</span>
          <span className={styles.navItem}>History</span>
        </nav>

        <div className={styles.actions}>
          <span className={styles.envBadge}>Production</span>
          <StatusPill tone={connection.tone} label={connection.label} pulse={connection.pulse} icon={connection.icon} />
          <div className={styles.divider} aria-hidden="true" />
          <ThemeToggle />
          <span className={styles.avatar} title="Signed in operator">SR</span>
        </div>
      </div>
    </header>
  );
}
