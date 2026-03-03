-- ============================================================================
-- RETENTION HEALTH V1 - COHORT-ONLY SCHEMA
-- ============================================================================
-- Cloudflare D1 (SQLite-compatible)
-- No PHI storage - aggregated cohort metrics only
-- No BAA required for V1 pilot
-- ============================================================================

-- ============================================================================
-- 1. CLINICS
-- ============================================================================
CREATE TABLE clinics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  patient_count_range TEXT,
  api_key TEXT,
  magic_token TEXT,
  pilot_status TEXT CHECK (pilot_status IN ('pending','active','paused','complete')) DEFAULT 'pending',
  pilot_start_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. COHORTS
-- ============================================================================
CREATE TABLE cohorts (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL,
  cohort_label TEXT CHECK (cohort_label IN ('Baseline','Stabilization')),
  start_date TEXT NOT NULL,
  patient_count INTEGER NOT NULL CHECK (patient_count >= 10),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id)
);

CREATE INDEX idx_cohorts_clinic ON cohorts(clinic_id);
CREATE UNIQUE INDEX idx_cohorts_clinic_label ON cohorts(clinic_id, cohort_label);

-- ============================================================================
-- 3. WEEKLY_METRICS
-- ============================================================================
CREATE TABLE weekly_metrics (
  id TEXT PRIMARY KEY,
  cohort_id TEXT NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 12),
  engagement_count INTEGER NOT NULL,
  volatility_event_count INTEGER NOT NULL,
  avg_refill_delta_days REAL,
  dropoff_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(cohort_id, week_number),
  FOREIGN KEY (cohort_id) REFERENCES cohorts(id)
);

CREATE INDEX idx_weekly_metrics_cohort ON weekly_metrics(cohort_id);
CREATE INDEX idx_weekly_metrics_week ON weekly_metrics(week_number);

-- ============================================================================
-- SCHEMA NOTES
-- ============================================================================
-- 
-- WHAT WE STORE:
-- - Clinic metadata (no PHI)
-- - Cohort definitions (Baseline vs Stabilization)
-- - Weekly aggregated metrics (engagement, volatility, refill timing)
--
-- WHAT WE DO NOT STORE:
-- - Patient identifiers (names, emails, MRNs, tokens)
-- - Individual patient records
-- - Daily check-ins
-- - Individual risk scores
-- - Any PHI or identifiable data
--
-- MINIMUM COHORT SIZE:
-- - ≥ 10 patients per cohort (enforced via CHECK constraint)
-- - Prevents individual identification
--
-- DATA RETENTION:
-- - 12 weeks of metrics per cohort
-- - No long-term patient-level storage
--
-- ============================================================================
