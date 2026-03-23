import type { BedrockAgentInput, BedrockAgentOutput } from "@/types";

// ─── Bedrock Agent Config ─────────────────────────────────────────────────────
const AGENT_ID  = "WKDRRWYNTH";
const REGION    = "ap-south-1";
export const BEDROCK_ENDPOINT =
  `https://bedrock-agent-runtime.${REGION}.amazonaws.com/agents/${AGENT_ID}/invokeAgent`;

// ─── Response validator ───────────────────────────────────────────────────────
function isValidOutput(data: unknown): data is BedrockAgentOutput {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.overall_score === "number" &&
    typeof d.stars         === "string" &&
    d.breakdown            !== null     &&
    typeof d.breakdown     === "object" &&
    Array.isArray(d.issues)
  );
}

// ─── API call ─────────────────────────────────────────────────────────────────
/**
 * postBedrockScore
 *
 * POSTs device metrics to the Bedrock agent and returns the scored output.
 * Throws on network failure or invalid response shape.
 */
export async function postBedrockScore(
  input: BedrockAgentInput,
  signal?: AbortSignal
): Promise<BedrockAgentOutput> {
  const response = await fetch(BEDROCK_ENDPOINT, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(input),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Bedrock agent ${response.status}: ${errorText}`);
  }

  const data: unknown = await response.json();

  if (!isValidOutput(data)) {
    throw new Error("Unexpected response shape from Bedrock agent.");
  }

  return data;
}
