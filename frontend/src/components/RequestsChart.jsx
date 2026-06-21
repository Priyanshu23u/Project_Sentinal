import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import useMetricsStore from "../store/metricsStore";
import { IconChartLine } from "./icons";
import styles from "./RequestsChart.module.css";

const SERIES = [
  { key: "rps", label: "Requests / sec", color: "var(--color-brand-strong)", colorRaw: "#9266ff" },
  { key: "success", label: "Successful", color: "var(--color-success)", colorRaw: "#2ed573" },
  { key: "failure", label: "Failed", color: "var(--color-danger)", colorRaw: "#ff5470" },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTime}>{label}</div>
      <div className={styles.tooltipRows}>
        {payload.map((entry) => {
          const series = SERIES.find((s) => s.key === entry.dataKey);
          return (
            <div key={entry.dataKey} className={styles.tooltipRow}>
              <span className={styles.tooltipDot} style={{ background: series?.colorRaw }} />
              <span className={styles.tooltipLabel}>{series?.label ?? entry.dataKey}</span>
              <span className={`${styles.tooltipValue} tabular`}>{entry.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RequestsChart({ loading = false }) {
  const history = useMetricsStore((state) => state.history);
  const hasData = history.length > 1;

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Live Request Volume</h2>
          <p className={styles.subtitle}>Last {history.length || 0} samples from the metrics stream</p>
        </div>

        <div className={styles.legend}>
          {SERIES.map((s) => (
            <span key={s.key} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: s.colorRaw }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.chartArea}>
        {!hasData ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <IconChartLine size={22} />
            </span>
            <p className={styles.emptyTitle}>
              {loading ? "Waiting for live data" : "Collecting samples…"}
            </p>
            <p className={styles.emptyText}>
              The chart will populate automatically as metrics arrive over the WebSocket feed.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={history} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                {SERIES.map((s) => (
                  <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.colorRaw} stopOpacity={0.32} />
                    <stop offset="100%" stopColor={s.colorRaw} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid stroke="var(--color-border)" vertical={false} strokeDasharray="3 5" />

              <XAxis
                dataKey="time"
                tick={{ fill: "var(--color-text-tertiary)", fontSize: 11 }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
                minTickGap={32}
              />

              <YAxis
                tick={{ fill: "var(--color-text-tertiary)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--color-border-strong)", strokeWidth: 1 }} />

              {SERIES.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.colorRaw}
                  strokeWidth={2}
                  fill={`url(#fill-${s.key})`}
                  dot={false}
                  activeDot={{ r: 3.5, strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
