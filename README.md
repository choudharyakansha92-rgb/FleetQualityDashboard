# Fleet Quality Dashboard

Imaging Fleet Analytics — Data Quality Dashboard powered by AWS Bedrock Agent (`WKDRRWYNTH`).

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 + CSS custom properties |
| AI scoring | AWS Bedrock Agent Runtime (`ap-south-1`) |
| Fonts | Fraunces · DM Sans · DM Mono |

## Project structure

```
FleetQualityDashboard/
├── index.html                   # Vite entry + Google Fonts
├── index.css                    # Tailwind @import (root)
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx                 # ReactDOM.createRoot
    ├── App.tsx                  # Dashboard layout (header + sidebar + 5-card grid)
    ├── index.css                # Global styles + CSS token theme
    ├── components/
    │   └── MetricCard.tsx       # Score card with tap-to-expand tooltip
    ├── hooks/
    │   └── useBedrockScore.ts   # Async state machine + cache + AbortController
    ├── api/
    │   └── score.ts             # POST /invokeAgent wrapper + response validator
    ├── types/
    │   └── index.ts             # BedrockAgentInput · Output · ScoreState · Props
    └── data/
        └── fleetData.ts         # 5 mock devices + METRIC_CONFIG
```

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (opens http://localhost:3000)
npm start

# 3. Production build
npm run build
```

## Bedrock agent

The dashboard POSTs to:
```
POST https://bedrock-agent-runtime.ap-south-1.amazonaws.com/agents/WKDRRWYNTH/invokeAgent
```

**Input schema:**
```json
{
  "device_id": "CT-001",
  "uptime_pct": 90,
  "last_maintenance": "2026-02-25",
  "fault_logs": "sensor_error",
  "utilization": 0.75
}
```

**Output schema:**
```json
{
  "overall_score": 4,
  "stars": "★★★★☆",
  "breakdown": { "completeness": 0.95 },
  "issues": ["8% missing logs"]
}
```

> **Auth note:** The `src/api/score.ts` fetch call does not attach AWS SigV4 headers — add your auth middleware or proxy if calling the agent directly from the browser. For production, route requests through an API Gateway or Lambda proxy.

## Responsive breakpoints

| Viewport | Card grid | Device sidebar |
|----------|-----------|----------------|
| Mobile (< 768px) | 1 column | Horizontal scroll row |
| iPad portrait (≥ 768px) | 2 columns | Horizontal scroll row |
| Desktop (≥ 1024px) | 3 columns (auto-fill) | Vertical stack |

## Dark mode

Click the toggle in the header. The theme is driven by CSS custom properties on `:root` / `.dark` — no Tailwind JIT dark variants needed.
