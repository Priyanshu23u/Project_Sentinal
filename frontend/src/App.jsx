import { useEffect, useRef, useState } from "react";

import useMetricsStore from "./store/metricsStore";

import Header from "./components/Header";
import MetricCard from "./components/MetricCard";
import CircuitStatus from "./components/CircuitStatus";
import TrafficFlow from "./components/TrafficFlow";
import RequestsChart from "./components/RequestsChart";
import { IconActivity, IconCheckCircle, IconXCircle, IconRoute, IconWifiOff } from "./components/icons";

import styles from "./App.module.css";

const RECONNECT_DELAY_MS = 3000;

function App() {
  const { metrics, setMetrics } = useMetricsStore();

  const [connectionStatus, setConnectionStatus] = useState("connecting"); // connecting | live | offline
  const [hasData, setHasData] = useState(false);

  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const connect = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const ws = new WebSocket(`${protocol}//localhost:8080/ws`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) return;
        setConnectionStatus((prev) => (prev === "offline" ? "connecting" : prev));
      };

      ws.onmessage = (event) => {
        if (cancelled) return;
        const data = JSON.parse(event.data);
        setMetrics(data);
        setHasData(true);
        setConnectionStatus("live");
      };

      ws.onerror = () => {
        // onclose will fire right after; reconnection is handled there.
      };

      ws.onclose = () => {
        if (cancelled) return;
        setConnectionStatus("offline");
        reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
      };
    };

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [setMetrics]);

  const loading = !hasData;
  const history = useMetricsStore((state) => state.history);

  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />

      <Header connectionStatus={connectionStatus} />

      <main className={styles.main}>
        <div className={styles.container}>
          {connectionStatus === "offline" && hasData && (
            <div className={styles.alert} role="status">
              <IconWifiOff size={16} />
              <span>
                Live connection lost — showing the last known metrics while Sentinel attempts to reconnect.
              </span>
            </div>
          )}

          <div className={styles.pageHeading}>
            <h1 className={styles.pageTitle}>Overview</h1>
            <p className={styles.pageSubtitle}>
              Real-time visibility into the circuit breaker, traffic routing and request volume.
            </p>
          </div>

          <CircuitStatus state={metrics.circuitState} loading={loading} />

          <div className={styles.kpiGrid}>
            <MetricCard
              title="Requests / sec"
              value={metrics.rps}
              icon={<IconActivity size={17} />}
              tone="brand"
              trendData={history.map((h) => h.rps)}
              hint="Live throughput"
              loading={loading}
            />
            <MetricCard
              title="Success"
              value={metrics.success}
              icon={<IconCheckCircle size={17} />}
              tone="success"
              trendData={history.map((h) => h.success)}
              hint="Completed requests"
              loading={loading}
            />
            <MetricCard
              title="Failure"
              value={metrics.failure}
              icon={<IconXCircle size={17} />}
              tone="danger"
              trendData={history.map((h) => h.failure)}
              hint="Failed requests"
              loading={loading}
            />
            <MetricCard
              title="Active Routes"
              value={metrics.activeRoutes}
              icon={<IconRoute size={17} />}
              tone="info"
              hint="Currently balancing traffic"
              loading={loading}
            />
          </div>

          <div className={styles.lowerGrid}>
            <TrafficFlow state={metrics.circuitState} loading={loading} />
            <RequestsChart loading={loading} />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <span>Project Sentinel — real-time resilience &amp; traffic monitoring</span>
          <span className={styles.footerMeta}>Streaming from ws://localhost:8080/ws</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
