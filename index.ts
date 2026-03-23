// ─── Bedrock Agent API Types ──────────────────────────────────────────────────

/** Input payload sent to the Bedrock agent */
export interface BedrockAgentInput {
  device_id: string;
  uptime_pct: number;
  last_maintenance: string; // ISO date string e.g. "2026-02-25"
  fault_logs: string;
  utilization: number; // 0.0 – 1.0
}

/** Score breakdown returned by the agent (open-ended keys) */
export interface ScoreBreakdown {
  completeness: number;
  reliability?: number;
  maintenance?: number;
  utilization?: number;
  [key: string]: number | undefined;
}

/** Full response payload from the Bedrock agent */
export interface BedrockAgentOutput {
  overall_score: number; // 1–5
  stars: string;          // e.g. "★★★★☆"
  breakdown: ScoreBreakdown;
  issues: string[];
}

/** Discriminated union for hook async state */
export type BedrockScoreState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: BedrockAgentOutput }
  | { status: "error"; message: string };

/** MetricCard component props */
export interface MetricCardProps {
  metricName: string;
  rawData: BedrockAgentInput;
}
