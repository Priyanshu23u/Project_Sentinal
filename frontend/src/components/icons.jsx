/**
 * A small set of hand-rolled, stroke-based icons (24x24, 1.75 stroke)
 * so the product has a single consistent icon language without adding
 * an extra dependency. Every icon forwards standard SVG props.
 */

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconShield(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <path d="M12 3.5l7 2.7v5.4c0 4.6-3 8.2-7 9.4-4-1.2-7-4.8-7-9.4V6.2l7-2.7z" />
      <path d="M9 12.2l2 2 4-4.2" />
    </svg>
  );
}

export function IconActivity(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <path d="M3 12h4l2.5 7L14 5l2.5 7H21" />
    </svg>
  );
}

export function IconCheckCircle(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.7 12.3l2.2 2.2 4.4-4.6" />
    </svg>
  );
}

export function IconAlertTriangle(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <path d="M12 4.2L21 19.5H3L12 4.2z" />
      <path d="M12 10v4.2" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconXCircle(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.3 9.3l5.4 5.4M14.7 9.3l-5.4 5.4" />
    </svg>
  );
}

export function IconRoute(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <circle cx="5.5" cy="6" r="2" />
      <circle cx="18.5" cy="18" r="2" />
      <path d="M5.5 8v3a4 4 0 0 0 4 4h5a4 4 0 0 1 4 4" strokeDasharray="3 3" />
    </svg>
  );
}

export function IconServer(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <rect x="3.5" y="4" width="17" height="6.5" rx="1.6" />
      <rect x="3.5" y="13.5" width="17" height="6.5" rx="1.6" />
      <path d="M7 7.2h.01M7 16.7h.01" strokeWidth="2.4" />
    </svg>
  );
}

export function IconUser(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <circle cx="12" cy="8.2" r="3.4" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    </svg>
  );
}

export function IconArrowRight(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}

export function IconArrowDown(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <path d="M12 4.5v15M6 13.5l6 6 6-6" />
    </svg>
  );
}

export function IconWifi(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <path d="M3.5 9.2a13 13 0 0 1 17 0" />
      <path d="M6.7 12.8a8.5 8.5 0 0 1 10.6 0" />
      <path d="M9.9 16.3a4 4 0 0 1 4.2 0" />
      <circle cx="12" cy="19.2" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconWifiOff(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <path d="M3 3.5l18 18" />
      <path d="M5.2 7.6a13 13 0 0 1 13.4-1.1M20.5 9.2a13 13 0 0 0-2.6-2" />
      <path d="M6.7 12.8a8.5 8.5 0 0 1 6.5-2.4M17.3 12.8a8.4 8.4 0 0 0-1.4-1.1" />
      <path d="M9.9 16.3a4 4 0 0 1 3-1" />
      <circle cx="12" cy="19.2" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconChartLine(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M6.5 15l3.5-4 3 2.6L18 8" />
    </svg>
  );
}

export function IconSun(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

export function IconMoon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z" />
    </svg>
  );
}

export function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size ?? 20} height={props.size ?? 20} {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
