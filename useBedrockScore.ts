import { useState, useCallback, useRef, useEffect } from "react";
import { postBedrockScore } from "@/api/score";
import type {
  BedrockAgentInput,
  BedrockAgentOutput,
  BedrockScoreState,
} from "@/types";

/**
 * useBedrockScore
 *
 * Manages the full async lifecycle of a Bedrock agent score request:
 * - idle → loading → success | error
 * - In-memory result cache keyed by JSON-serialised input
 * - AbortController cleanup on unmount or input change
 */
export function useBedrockScore() {
  const [state, setState] = useState<BedrockScoreState>({ status: "idle" });
  const cacheRef  = useRef<Map<string, BedrockAgentOutput>>(new Map());
  const abortRef  = useRef<AbortController | null>(null);

  const fetchScore = useCallback(async (input: BedrockAgentInput) => {
    const cacheKey = JSON.stringify(input);

    // Serve from cache immediately
    if (cacheRef.current.has(cacheKey)) {
      setState({ status: "success", data: cacheRef.current.get(cacheKey)! });
      return;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ status: "loading" });

    try {
      const data = await postBedrockScore(input, controller.signal);
      cacheRef.current.set(cacheKey, data);
      setState({ status: "success", data });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Unknown error occurred",
      });
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  // Cleanup on unmount
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  return { state, fetchScore, reset };
}
