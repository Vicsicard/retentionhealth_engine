export type RiskTier = "STABLE" | "MONITOR" | "ELEVATED";
export type RiskFlag = "ENGAGEMENT_DROP" | "GI_INSTABILITY" | "LOW_PROTEIN" | "COMBINED_VOLATILITY";

export interface DailyOutputPreCheckin {
  ok: true;
  mode: "PRE_CHECKIN";
  clinic_id: string;
  seat_id: string;
  date: string;
  cycle_day: number;
  phase: string;
  header: string;
  subtext: string;
  focus: string[];
  context_line: string;
  protein_examples: string[];
}

export interface DailyOutputPostCheckin {
  ok: true;
  mode: "POST_CHECKIN";
  clinic_id: string;
  seat_id: string;
  date: string;
  cycle_day: number;
  phase: string;
  guidance_template_id: string;
  header: string;
  subtext: string;
  normalization: string;
  todayGoal: string;
  focus: string[];
  nausea_protocol: { title: string; bullets: string[] } | null;
  safety_line: string | null;
  protein_modifier: { title: string; bullets: string[] };
  protein_examples: string[];
  context_line: string;
  encouragement: string;
}

export interface DashboardSeat {
  seat_id: string;
  patient_external_id: string;
  injection_day: number;
  last_check_in_date: string | null;
  last_nausea: number | null;
  last_protein: number | null;
  engagement_rate: number;
  consecutive_missed_days: number;
  flags: RiskFlag[];
  risk_tier: RiskTier;
}

export interface DashboardSummary {
  ok: true;
  clinic_id: string;
  window: { from: string; to: string };
  counts: {
    total: number;
    STABLE: number;
    MONITOR: number;
    ELEVATED: number;
  };
  seats: DashboardSeat[];
}
