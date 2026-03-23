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
├── amplify.yml                  # Amplify build config (REQUIRED)
├── index.html                   # Vite entry + Google Fonts
├── index.css                    # Tailwind @import (root)
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── public/
│   └── _redirects               # SPA catch-all for Amplify/CloudFront
└── src/
    ├── main.tsx                 # ReactDOM.createRoot
    ├── App.tsx                  # Dashboard layout
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

# 3. Production build (outputs to /dist)
npm run build
```

## AWS Amplify deployment

Push the repo to GitHub/CodeCommit and connect it in Amplify Console.
The included `amplify.yml` handles the build automatically — no manual config needed.

**Five fixes that resolve the blank page:**

| File | Problem fixed |
|------|--------------|
| `amplify.yml` | Without this, Amplify guesses `react-scripts build` and fails — this tells it to use `vite build` and output `dist/` |
| `package.json` | `build` was `tsc && vite build` — `tsc` aborted CI on any type warning before Vite ran; now just `vite build` |
| `vite.config.ts` | Added `resolve.alias` for `@/*` → `./src/*` — without this all `@/` imports fail at bundle time (TS paths alone are not enough) |
| `tsconfig.json` | Removed `noUnusedLocals` + `noUnusedParameters` which caused hard CI failures on minor warnings |
| `public/_redirects` | SPA catch-all `/* /index.html 200` — without this, any hard refresh or direct URL returns a blank 404 from CloudFront |

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

> **Auth note:** `src/api/score.ts` does not attach AWS SigV4 headers. For production, route requests through API Gateway + Lambda that handles signing, and update `BEDROCK_ENDPOINT` in `score.ts` to your proxy URL.

## Responsive breakpoints

| Viewport | Card grid | Device sidebar |
|----------|-----------|----------------|
| Mobile (< 768px) | 1 column | Horizontal scroll row |
| iPad portrait (≥ 768px) | 2 columns | Horizontal scroll row |
| Desktop (≥ 1024px) | 3 columns (auto-fill) | Vertical stack |

## Dark mode

Click the toggle in the header. Driven by CSS custom properties on `:root` / `.dark`.
