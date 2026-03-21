import React, { useState, useCallback, type FC } from "react";
import { MetricCard } from "@/components/MetricCard";
import { FLEET_DEVICES, METRIC_CONFIG } from "@/data/fleetData";
import "./index.css";

// ─── DarkToggle ───────────────────────────────────────────────────────────────
const DarkToggle: FC<{ dark: boolean; onToggle: () => void }> = ({ dark, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    aria-pressed={dark}
    className="flex items-center gap-2 focus:outline-none rounded-full"
  >
    <span className="text-xs font-mono-dm select-none" style={{ color: "var(--text-secondary)" }}>
      {dark ? "dark" : "light"}
    </span>
    <div className="toggle-track">
      <div className="toggle-thumb" />
    </div>
    <span className="text-sm leading-none select-none" aria-hidden>
      {dark ? "🌙" : "☀️"}
    </span>
  </button>
);

// ─── FleetBadge ───────────────────────────────────────────────────────────────
const FleetBadge: FC<{ count: number }> = ({ count }) => (
  <span
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-dm"
    style={{
      border: "0.5px solid var(--border-subtle)",
      color: "var(--text-secondary)",
      background: "var(--bg-surface)",
    }}
  >
    <span
      className="w-1.5 h-1.5 rounded-full inline-block status-dot-live"
      style={{ background: "#22c55e" }}
    />
    {count} devices
  </span>
);

// ─── DeviceTab ────────────────────────────────────────────────────────────────
const DeviceTab: FC<{
  id: string;
  location: string;
  active: boolean;
  onClick: () => void;
}> = ({ id, location, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-start px-3 py-2.5 rounded-xl text-left w-full transition-all duration-150"
    style={{
      background: active ? "var(--bg-card)" : "var(--bg-surface)",
      border: active ? "0.5px solid var(--border-medium)" : "0.5px solid var(--border-subtle)",
      boxShadow: active ? "var(--shadow-card)" : "none",
    }}
  >
    <span
      className="font-mono-dm text-xs font-medium"
      style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}
    >
      {id}
    </span>
    <span
      className="text-[10px] mt-0.5 truncate w-full"
      style={{ color: active ? "var(--text-secondary)" : "var(--text-muted)" }}
    >
      {location}
    </span>
  </button>
);

// ─── App ──────────────────────────────────────────────────────────────────────
const App: FC = () => {
  const [dark, setDark] = useState(false);
  const [activeId, setActiveId] = useState(FLEET_DEVICES[0].id);

  const toggleDark = useCallback(() => {
    setDark(d => !d);
    document.documentElement.classList.toggle("dark");
  }, []);

  const device = FLEET_DEVICES.find(d => d.id === activeId)!;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: "var(--bg-page)" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30"
        style={{
          background: "var(--bg-surface)",
          borderBottom: "0.5px solid var(--border-subtle)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          className="max-w-5xl mx-auto px-4 sm:px-6"
          style={{ height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-display text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
              Imaging Fleet Analytics
            </span>
            <span className="hidden sm:block text-xs font-mono-dm" style={{ color: "var(--text-muted)" }}>·</span>
            <span className="hidden sm:block text-xs font-mono-dm truncate" style={{ color: "var(--text-secondary)" }}>
              Data Quality Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <FleetBadge count={FLEET_DEVICES.length} />
            <DarkToggle dark={dark} onToggle={toggleDark} />
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Page title */}
        <div className="mb-8 animate-fade-up">
          <p
            className="text-[10px] uppercase tracking-widest font-mono-dm mb-1"
            style={{ color: "var(--text-muted)" }}
          >
            Real-time · Bedrock AI Scoring
          </p>
          <h1 className="font-display font-light leading-tight" style={{ fontSize: "clamp(24px,4vw,36px)", color: "var(--text-primary)" }}>
            Fleet Quality{" "}
            <em className="font-light not-italic" style={{ color: "var(--accent-cyan)", fontStyle: "italic" }}>
              Overview
            </em>
          </h1>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Device sidebar ──────────────────────────────────────────────── */}
          <aside className="w-full lg:w-44 flex-shrink-0">
            <p
              className="text-[10px] uppercase tracking-widest font-mono-dm mb-2 px-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              Devices
            </p>
            {/* Mobile: horizontal scroll row; Desktop: vertical stack */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
              {FLEET_DEVICES.map(d => (
                <div key={d.id} className="flex-shrink-0 w-36 lg:w-full">
                  <DeviceTab
                    id={d.id}
                    location={d.location}
                    active={d.id === activeId}
                    onClick={() => setActiveId(d.id)}
                  />
                </div>
              ))}
            </div>
          </aside>

          {/* ── Metrics panel ───────────────────────────────────────────────── */}
          <section className="flex-1 min-w-0">
            {/* Device header */}
            <div className="flex items-baseline gap-2 mb-5">
              <h2
                className="font-display font-medium"
                style={{ fontSize: "18px", color: "var(--text-primary)" }}
              >
                {device.label}
              </h2>
              <span
                className="font-mono-dm text-xs rounded px-1.5 py-0.5"
                style={{
                  color: "var(--text-muted)",
                  border: "0.5px solid var(--border-subtle)",
                }}
              >
                {device.id}
              </span>
            </div>

            {/* 5-card responsive grid
                - Mobile:       1 col
                - iPad portrait (≥768px): 2 col
                - Desktop:      auto-fill ≥ 220px (fits 3 on wide)
            */}
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
            >
              {METRIC_CONFIG.map((cfg, i) => (
                <div
                  key={cfg.key}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <MetricCard
                    metricName={cfg.label}
                    rawData={device.metrics[cfg.key]}
                  />
                </div>
              ))}
            </div>

            {/* Footer */}
            <p
              className="mt-6 text-xs font-mono-dm"
              style={{ color: "var(--text-muted)" }}
            >
              Last refreshed: {new Date().toLocaleTimeString()} ·{" "}
              <span style={{ color: "var(--accent-green)" }}>Bedrock agent active</span>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow">
        <h1 className="text-2xl font-bold p-4">"Imaging Fleet Analytics"</h1>
      </header>
      {/* 5 MetricCard grid */}
    </div>
  )
}
