import type { BedrockAgentInput } from "@/types";

// ─── Fleet Device Shape ───────────────────────────────────────────────────────
export interface FleetDevice {
  id: string;
  label: string;
  location: string;
  metrics: {
    uptime:      BedrockAgentInput;
    utilization: BedrockAgentInput;
    maintenance: BedrockAgentInput;
    faultRate:   BedrockAgentInput;
    compliance:  BedrockAgentInput;
  };
}

// ─── 5 Mock Devices ───────────────────────────────────────────────────────────
export const FLEET_DEVICES: FleetDevice[] = [
  {
    id: "CT-001",
    label: "CT Scanner — Suite A",
    location: "Radiology East",
    metrics: {
      uptime:      { device_id: "CT-001", uptime_pct: 92, last_maintenance: "2026-02-25", fault_logs: "sensor_error",              utilization: 0.78 },
      utilization: { device_id: "CT-001", uptime_pct: 92, last_maintenance: "2026-02-25", fault_logs: "sensor_error",              utilization: 0.78 },
      maintenance: { device_id: "CT-001", uptime_pct: 92, last_maintenance: "2026-02-25", fault_logs: "sensor_error",              utilization: 0.78 },
      faultRate:   { device_id: "CT-001", uptime_pct: 92, last_maintenance: "2026-02-25", fault_logs: "sensor_error",              utilization: 0.78 },
      compliance:  { device_id: "CT-001", uptime_pct: 92, last_maintenance: "2026-02-25", fault_logs: "sensor_error",              utilization: 0.78 },
    },
  },
  {
    id: "MRI-456",
    label: "MRI 3T — Bay 2",
    location: "Neuro Imaging",
    metrics: {
      uptime:      { device_id: "MRI-456", uptime_pct: 99, last_maintenance: "2026-03-10", fault_logs: "none",                     utilization: 0.91 },
      utilization: { device_id: "MRI-456", uptime_pct: 99, last_maintenance: "2026-03-10", fault_logs: "none",                     utilization: 0.91 },
      maintenance: { device_id: "MRI-456", uptime_pct: 99, last_maintenance: "2026-03-10", fault_logs: "none",                     utilization: 0.91 },
      faultRate:   { device_id: "MRI-456", uptime_pct: 99, last_maintenance: "2026-03-10", fault_logs: "none",                     utilization: 0.91 },
      compliance:  { device_id: "MRI-456", uptime_pct: 99, last_maintenance: "2026-03-10", fault_logs: "none",                     utilization: 0.91 },
    },
  },
  {
    id: "XRAY-789",
    label: "X-Ray DR — Room 3",
    location: "Emergency Dept.",
    metrics: {
      uptime:      { device_id: "XRAY-789", uptime_pct: 67, last_maintenance: "2025-11-20", fault_logs: "overheating,power_cycle", utilization: 0.42 },
      utilization: { device_id: "XRAY-789", uptime_pct: 67, last_maintenance: "2025-11-20", fault_logs: "overheating,power_cycle", utilization: 0.42 },
      maintenance: { device_id: "XRAY-789", uptime_pct: 67, last_maintenance: "2025-11-20", fault_logs: "overheating,power_cycle", utilization: 0.42 },
      faultRate:   { device_id: "XRAY-789", uptime_pct: 67, last_maintenance: "2025-11-20", fault_logs: "overheating,power_cycle", utilization: 0.42 },
      compliance:  { device_id: "XRAY-789", uptime_pct: 67, last_maintenance: "2025-11-20", fault_logs: "overheating,power_cycle", utilization: 0.42 },
    },
  },
  {
    id: "MAMMO-102",
    label: "Mammography — Suite C",
    location: "Women's Health",
    metrics: {
      uptime:      { device_id: "MAMMO-102", uptime_pct: 81, last_maintenance: "2026-01-15", fault_logs: "connectivity",           utilization: 0.65 },
      utilization: { device_id: "MAMMO-102", uptime_pct: 81, last_maintenance: "2026-01-15", fault_logs: "connectivity",           utilization: 0.65 },
      maintenance: { device_id: "MAMMO-102", uptime_pct: 81, last_maintenance: "2026-01-15", fault_logs: "connectivity",           utilization: 0.65 },
      faultRate:   { device_id: "MAMMO-102", uptime_pct: 81, last_maintenance: "2026-01-15", fault_logs: "connectivity",           utilization: 0.65 },
      compliance:  { device_id: "MAMMO-102", uptime_pct: 81, last_maintenance: "2026-01-15", fault_logs: "connectivity",           utilization: 0.65 },
    },
  },
  {
    id: "FLUORO-55",
    label: "Fluoroscopy — OR 5",
    location: "Interventional",
    metrics: {
      uptime:      { device_id: "FLUORO-55", uptime_pct: 88, last_maintenance: "2026-02-01", fault_logs: "calibration_drift",      utilization: 0.70 },
      utilization: { device_id: "FLUORO-55", uptime_pct: 88, last_maintenance: "2026-02-01", fault_logs: "calibration_drift",      utilization: 0.70 },
      maintenance: { device_id: "FLUORO-55", uptime_pct: 88, last_maintenance: "2026-02-01", fault_logs: "calibration_drift",      utilization: 0.70 },
      faultRate:   { device_id: "FLUORO-55", uptime_pct: 88, last_maintenance: "2026-02-01", fault_logs: "calibration_drift",      utilization: 0.70 },
      compliance:  { device_id: "FLUORO-55", uptime_pct: 88, last_maintenance: "2026-02-01", fault_logs: "calibration_drift",      utilization: 0.70 },
    },
  },
];

/** Display configuration for each metric dimension */
export const METRIC_CONFIG = [
  { key: "uptime"      as const, label: "Uptime",      icon: "⬆" },
  { key: "utilization" as const, label: "Utilization",  icon: "◈" },
  { key: "maintenance" as const, label: "Maintenance",  icon: "⚙" },
  { key: "faultRate"   as const, label: "Fault Rate",   icon: "⚡" },
  { key: "compliance"  as const, label: "Compliance",   icon: "✓" },
] as const;

export type MetricKey = typeof METRIC_CONFIG[number]["key"];
