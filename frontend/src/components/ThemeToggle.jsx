import { useEffect, useState } from "react";
import { IconSun, IconMoon } from "./icons";
import styles from "./ThemeToggle.module.css";

const STORAGE_KEY = "sentinel-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const isLight = theme === "light";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      <span className={`${styles.icon} ${!isLight ? styles.active : ""}`}>
        <IconMoon size={15} />
      </span>
      <span className={`${styles.icon} ${isLight ? styles.active : ""}`}>
        <IconSun size={15} />
      </span>
      <span className={`${styles.knob} ${isLight ? styles.knobLight : ""}`} />
    </button>
  );
}
