import { IconUser, IconRoute, IconServer } from "./icons";
import styles from "./TrafficFlow.module.css";

export default function TrafficFlow({ state, loading = false }) {
  const rerouted = state === "OPEN";
  const probing = state === "HALF_OPEN";

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Traffic Route</h2>
        <p className={styles.subtitle}>Live path from client to upstream service</p>
      </div>

      <div className={`${styles.diagram} ${loading ? styles.diagramLoading : ""}`}>
        <Node icon={<IconUser size={18} />} label="Client" sub="Inbound" />

        <Connector active vertical />

        <Node icon={<IconRoute size={18} />} label="Router" sub="Circuit breaker" highlight />

        <div className={styles.branches}>
          <div className={styles.branch}>
            <Connector active={!rerouted} dashed={probing} vertical />
            <Node
              icon={<IconServer size={18} />}
              label="Primary API"
              sub={rerouted ? "Bypassed" : probing ? "Probing" : "Receiving traffic"}
              active={!rerouted}
              muted={rerouted}
            />
          </div>

          <div className={styles.branch}>
            <Connector active={rerouted} vertical />
            <Node
              icon={<IconServer size={18} />}
              label="Secondary API"
              sub={rerouted ? "Receiving traffic" : "Standby"}
              active={rerouted}
              muted={!rerouted}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Node({ icon, label, sub, active = false, muted = false, highlight = false }) {
  return (
    <div
      className={`${styles.node} ${active ? styles.nodeActive : ""} ${muted ? styles.nodeMuted : ""} ${
        highlight ? styles.nodeHighlight : ""
      }`}
    >
      <span className={styles.nodeIcon}>{icon}</span>
      <span className={styles.nodeLabel}>{label}</span>
      <span className={styles.nodeSub}>{sub}</span>
    </div>
  );
}

function Connector({ active = false, dashed = false, vertical = false }) {
  return (
    <div
      className={`${styles.connector} ${vertical ? styles.connectorVertical : ""} ${
        active ? styles.connectorActive : ""
      } ${dashed ? styles.connectorDashed : ""}`}
    >
      <span className={styles.connectorLine} />
      {active && <span className={styles.connectorDot} />}
    </div>
  );
}
