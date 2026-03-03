-- ============================================================================
-- RETENTION HEALTH V1 - DATABASE SCHEMA
-- ============================================================================
-- Cloudflare D1 (SQLite-compatible)
-- Multi-tenant architecture with clinic-based isolation
-- ============================================================================

-- ============================================================================
-- 1. CLINICS
-- ============================================================================
CREATE TABLE clinics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  branding_color TEXT,
  seat_limit INTEGER NOT NULL,
  billing_status TEXT NOT NULL DEFAULT 'active'
    CHECK (billing_status IN ('active', 'suspended', 'cancelled')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. SEATS
-- ============================================================================
CREATE TABLE seats (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL,
  patient_external_id TEXT NOT NULL,
  injection_day INTEGER NOT NULL
    CHECK (injection_day BETWEEN 0 AND 6),
  active BOOLEAN NOT NULL DEFAULT 1,
  first_check_in_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id)
);

CREATE INDEX idx_seats_clinic ON seats(clinic_id);
CREATE UNIQUE INDEX idx_seats_clinic_external 
  ON seats(clinic_id, patient_external_id);

-- ============================================================================
-- 3. CHECK_INS
-- ============================================================================
CREATE TABLE check_ins (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL,
  seat_id TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  cycle_day INTEGER NOT NULL
    CHECK (cycle_day BETWEEN 0 AND 6),
  nausea_level INTEGER NOT NULL
    CHECK (nausea_level BETWEEN 0 AND 3),
  protein_status INTEGER NOT NULL
    CHECK (protein_status BETWEEN 0 AND 2),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id),
  FOREIGN KEY (seat_id) REFERENCES seats(id)
);

-- One check-in per seat per day
CREATE UNIQUE INDEX idx_checkins_unique_seat_date
  ON check_ins(seat_id, check_in_date);

-- Rolling 7-day queries per seat
CREATE INDEX idx_checkins_seat_date
  ON check_ins(seat_id, check_in_date DESC);

-- Clinic-level dashboard queries
CREATE INDEX idx_checkins_clinic_date
  ON check_ins(clinic_id, check_in_date DESC);

-- Optional: Clinic + seat combo scans
CREATE INDEX idx_checkins_clinic_seat_date
  ON check_ins(clinic_id, seat_id, check_in_date DESC);

-- ============================================================================
-- 4. SEAT_STATUS (Minimal V1)
-- ============================================================================
CREATE TABLE seat_status (
  seat_id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL,
  last_check_in_date DATE,
  consecutive_missed_days INTEGER NOT NULL DEFAULT 0,
  total_check_ins INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seat_id) REFERENCES seats(id),
  FOREIGN KEY (clinic_id) REFERENCES clinics(id)
);

CREATE INDEX idx_seat_status_clinic
  ON seat_status(clinic_id);

-- ============================================================================
-- SCHEMA NOTES
-- ============================================================================
-- 
-- WHAT WE STORE:
-- - Clinic metadata (no PHI)
-- - Seat assignments (patient_external_id provided by clinic)
-- - Daily check-in inputs (nausea_level, protein_status)
-- - Light derived state (consecutive_missed_days, total_check_ins)
--
-- WHAT WE DO NOT STORE:
-- - Risk tiers (calculated live)
-- - Risk flags (calculated live)
-- - Guidance templates (generated dynamically)
-- - Patient names, DOB, email, diagnosis
-- - Any PHI or medical identifiers
--
-- MULTI-TENANT ISOLATION:
-- - All queries filtered by clinic_id from authenticated token
-- - patient_external_id unique per clinic (not globally)
-- - Denormalized clinic_id in check_ins for query performance
--
-- ============================================================================
