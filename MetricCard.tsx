import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FC,
  type KeyboardEvent,
} from "react";
import { useBedrockScore } from "@/hooks/useBedrockScore";
import type { MetricCardProps, ScoreBreakdown } from "@/types";

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner: FC = () => (
  <svg
    className="animate-spin h-4 w-4"
    style={{ color: "var(--accent-cyan)" }}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-label="Loading"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ─── Star rating ──────────────────────────────────────────────────────────────
const StarRating: FC<{ stars: string; score: number }> = ({ stars, score }) => (
  <span
    className="font-mono-dm tracking-widest text-xs"
    style={{ color: "var(--accent-amber)" }}
    aria-label={`${score} out of 5 stars`}
  >
    {stars}
  </span>
);

// ─── Breakdown bar row ────────────────────────────────────────────────────────
const BreakdownRow: FC<{ label: string; value: number }> = ({ label, value }) => {
  const pct = Math.round(value * 100);
  const fillColor =
    pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <tr>
      <td
        className="py-1.5 pr-3 text-xs capitalize whitespace-nowrap font-mono-dm"
        style={{ color: "var(--text-secondary)" }}
      >
        {label.replace(/_/g, " ")}
      </td>
      <td className="py-1.5 pr-2 w-full">
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: "var(--border-subtle)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: fillColor }}
          />
        </div>
      </td>
      <td
        className="py-1.5 text-xs text-right font-mono-dm whitespace-nowrap"
        style={{ color: "var(--text-secondary)" }}
      >
        {pct}%
      </td>
    </tr>
  );
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────
const Tooltip: FC<{
  breakdown: ScoreBreakdown;
  issues: string[];
  onClose: () => void;
}> = ({ breakdown, issues, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const entries = Object.entries(breakdown).filter(
    ([, v]) => typeof v === "number"
  ) as [string, number][];

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Score breakdown"
      className="absolute z-50 left-0 right-0 rounded-2xl p-4"
      style={{
        top: "calc(100% + 8px)",
        background: "var(--bg-card)",
        border: "0.5px solid var(--border-medium)",
        boxShadow: "var(--shadow-tooltip)",
        animation: "fadeUp 0.18s ease both",
      }}
    >
      {/* Arrow */}
      <div
        className="absolute w-3 h-3 rotate-45"
        style={{
          top: "-6px",
          left: "18px",
          background: "var(--bg-card)",
          borderLeft: "0.5px solid var(--border-medium)",
          borderTop: "0.5px solid var(--border-medium)",
        }}
      />

      <p
        className="text-[10px] uppercase tracking-widest font-mono-dm mb-3"
        style={{ color: "var(--accent-cyan)" }}
      >
        Score Breakdown
      </p>

      <table className="w-full mb-3">
        <tbody>
          {entries.map(([key, val]) => (
            <BreakdownRow key={key} label={key} value={val} />
          ))}
        </tbody>
      </table>

      {issues.length > 0 ? (
        <>
          <div className="h-px my-2" style={{ background: "var(--border-subtle)" }} />
          <p
            className="text-[10px] uppercase tracking-widest font-mono-dm mb-2"
            style={{ color: "var(--accent-red)" }}
          >
            Issues ({issues.length})
          </p>
          <ul className="space-y-1">
            {issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                <span className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent-red)" }}>⚠</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div className="h-px my-2" style={{ background: "var(--border-subtle)" }} />
          <p className="text-xs italic" style={{ color: "var(--accent-green)" }}>No issues detected</p>
        </>
      )}

      <button
        onClick={onClose}
        className="mt-3 w-full text-xs py-1 rounded-lg transition-colors"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--text-secondary)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
      >
        Dismiss
      </button>
    </div>
  );
};

// ─── MetricCard ───────────────────────────────────────────────────────────────
export const MetricCard: FC<MetricCardProps> = ({ metricName, rawData }) => {
  const { state, fetchScore } = useBedrockScore();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    fetchScore(rawData);
  }, [fetchScore, rawData]);

  const handleToggle = useCallback(() => {
    if (state.status === "success") setTooltipOpen(v => !v);
  }, [state.status]);

  const handleKey = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleToggle(); }
      if (e.key === "Escape") setTooltipOpen(false);
    },
    [handleToggle]
  );

  const tintColor =
    state.status === "success"
      ? state.data.overall_score >= 4
        ? "rgba(16,185,129,0.07)"
        : state.data.overall_score >= 3
        ? "rgba(245,158,11,0.07)"
        : "rgba(239,68,68,0.07)"
      : "transparent";

  const isInteractive = state.status === "success";

  return (
    <div className="relative w-full">
      <div
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-expanded={tooltipOpen}
        aria-haspopup={isInteractive ? "dialog" : undefined}
        onClick={handleToggle}
        onKeyDown={handleKey}
        className="relative rounded-2xl transition-all duration-200 select-none overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${tintColor} 0%, transparent 60%), var(--bg-card)`,
          border: tooltipOpen
            ? "0.5px solid var(--border-accent)"
            : "0.5px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
          cursor: isInteractive ? "pointer" : "default",
        }}
        onMouseEnter={e => {
          if (isInteractive)
            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-medium)";
        }}
        onMouseLeave={e => {
          if (!tooltipOpen)
            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)";
        }}
      >
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <span
              className="text-[10px] uppercase tracking-[0.18em] font-mono-dm"
              style={{ color: "var(--text-muted)" }}
            >
              {metricName}
            </span>

            {state.status === "idle" && (
              <span className="text-sm italic" style={{ color: "var(--text-muted)" }}>Waiting…</span>
            )}

            {state.status === "loading" && (
              <div className="flex items-center gap-2">
                <Spinner />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Scoring…</span>
              </div>
            )}

            {state.status === "error" && (
              <span
                className="text-xs truncate"
                style={{ color: "var(--accent-red)" }}
                title={state.message}
              >
                ⚠ {state.message}
              </span>
            )}

            {state.status === "success" && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {Math.round(rawData.uptime_pct)}% Uptime
                </span>
                <span className="text-xs font-mono-dm" style={{ color: "var(--text-muted)" }}>
                  [{state.data.overall_score}/5
                </span>
                <StarRating stars={state.data.stars} score={state.data.overall_score} />
                <span className="text-xs font-mono-dm" style={{ color: "var(--text-muted)" }}>]</span>
              </div>
            )}
          </div>

          {isInteractive && (
            <span
              className="text-sm transition-transform duration-300 flex-shrink-0"
              style={{
                color: tooltipOpen ? "var(--accent-cyan)" : "var(--text-muted)",
                transform: tooltipOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
              aria-hidden
            >
              ▾
            </span>
          )}
        </div>
      </div>

      {tooltipOpen && state.status === "success" && (
        <Tooltip
          breakdown={state.data.breakdown}
          issues={state.data.issues}
          onClose={() => setTooltipOpen(false)}
        />
      )}
    </div>
  );
};

export default MetricCard;
