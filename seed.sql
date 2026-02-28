-- ============================================================================
-- RETENTION HEALTH V1 - SEED DATA
-- ============================================================================
-- Purpose: Demo clinic with 10 seats showing all risk tier patterns
-- Date Range: 2026-01-01 to 2026-01-07 (7-day rolling window)
-- Test Oracle: Validates risk engine logic against expected outcomes
-- ============================================================================

-- ============================================================================
-- 1. DEMO CLINIC
-- ============================================================================
INSERT INTO clinics (id, name, seat_limit, billing_status)
VALUES ('clinic_demo_01', 'Demo GLP-1 Clinic', 50, 'active');

-- ============================================================================
-- 2. SEATS (10 Seats, Staggered Injection Days)
-- ============================================================================
-- injection_day: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
INSERT INTO seats (id, clinic_id, patient_external_id, injection_day, first_check_in_at)
VALUES
('seat_01','clinic_demo_01','EXT001',0,'2026-01-01 08:00:00'),
('seat_02','clinic_demo_01','EXT002',1,'2026-01-01 08:15:00'),
('seat_03','clinic_demo_01','EXT003',2,'2026-01-01 08:30:00'),
('seat_04','clinic_demo_01','EXT004',3,'2026-01-01 08:45:00'),
('seat_05','clinic_demo_01','EXT005',4,'2026-01-01 09:00:00'),
('seat_06','clinic_demo_01','EXT006',5,'2026-01-01 09:15:00'),
('seat_07','clinic_demo_01','EXT007',6,'2026-01-01 09:30:00'),
('seat_08','clinic_demo_01','EXT008',0,'2026-01-01 09:45:00'),
('seat_09','clinic_demo_01','EXT009',1,'2026-01-05 10:00:00'),
('seat_10','clinic_demo_01','EXT010',2,'2026-01-01 10:15:00');

-- ============================================================================
-- 3. CHECK-INS (Pattern-Based Test Data)
-- ============================================================================
-- Nausea Scale: 0=None, 1=Mild, 2=Moderate, 3=Severe
-- Protein Scale: 0=Low, 1=Moderate, 2=OnTarget
-- ============================================================================

-- ----------------------------------------------------------------------------
-- seat_01 - FULLY STABLE
-- Pattern: Perfect adherence, low nausea, good protein
-- Expected: 🟢 STABLE, No flags, 100% engagement
-- ----------------------------------------------------------------------------
INSERT INTO check_ins (id, clinic_id, seat_id, check_in_date, cycle_day, nausea_level, protein_status, created_at) VALUES
('c1','clinic_demo_01','seat_01','2026-01-01',0,0,2,'2026-01-01 08:00:00'),
('c2','clinic_demo_01','seat_01','2026-01-02',1,1,2,'2026-01-02 08:00:00'),
('c3','clinic_demo_01','seat_01','2026-01-03',2,0,2,'2026-01-03 08:00:00'),
('c4','clinic_demo_01','seat_01','2026-01-04',3,1,1,'2026-01-04 08:00:00'),
('c5','clinic_demo_01','seat_01','2026-01-05',4,0,2,'2026-01-05 08:00:00'),
('c6','clinic_demo_01','seat_01','2026-01-06',5,1,2,'2026-01-06 08:00:00'),
('c7','clinic_demo_01','seat_01','2026-01-07',6,0,2,'2026-01-07 08:00:00');

-- ----------------------------------------------------------------------------
-- seat_02 - PROTEIN LOW (2 Consecutive Days)
-- Pattern: Days 2-3 have P=0 (consecutive low protein)
-- Expected: 🟡 MONITOR, LOW_PROTEIN flag, 100% engagement
-- ----------------------------------------------------------------------------
INSERT INTO check_ins (id, clinic_id, seat_id, check_in_date, cycle_day, nausea_level, protein_status, created_at) VALUES
('c8','clinic_demo_01','seat_02','2026-01-01',0,0,2,'2026-01-01 08:15:00'),
('c9','clinic_demo_01','seat_02','2026-01-02',1,0,0,'2026-01-02 08:15:00'),
('c10','clinic_demo_01','seat_02','2026-01-03',2,1,0,'2026-01-03 08:15:00'),
('c11','clinic_demo_01','seat_02','2026-01-04',3,0,2,'2026-01-04 08:15:00'),
('c12','clinic_demo_01','seat_02','2026-01-05',4,0,2,'2026-01-05 08:15:00'),
('c13','clinic_demo_01','seat_02','2026-01-06',5,1,1,'2026-01-06 08:15:00'),
('c14','clinic_demo_01','seat_02','2026-01-07',6,0,2,'2026-01-07 08:15:00');

-- ----------------------------------------------------------------------------
-- seat_03 - MODERATE NAUSEA (2 Consecutive Days)
-- Pattern: Days 2-3 have N=2 (consecutive moderate nausea)
-- Expected: 🟡 MONITOR, GI_INSTABILITY flag, 100% engagement
-- ----------------------------------------------------------------------------
INSERT INTO check_ins (id, clinic_id, seat_id, check_in_date, cycle_day, nausea_level, protein_status, created_at) VALUES
('c15','clinic_demo_01','seat_03','2026-01-01',0,0,2,'2026-01-01 08:30:00'),
('c16','clinic_demo_01','seat_03','2026-01-02',1,2,2,'2026-01-02 08:30:00'),
('c17','clinic_demo_01','seat_03','2026-01-03',2,2,2,'2026-01-03 08:30:00'),
('c18','clinic_demo_01','seat_03','2026-01-04',3,1,2,'2026-01-04 08:30:00'),
('c19','clinic_demo_01','seat_03','2026-01-05',4,0,2,'2026-01-05 08:30:00'),
('c20','clinic_demo_01','seat_03','2026-01-06',5,0,2,'2026-01-06 08:30:00'),
('c21','clinic_demo_01','seat_03','2026-01-07',6,0,2,'2026-01-07 08:30:00');

-- ----------------------------------------------------------------------------
-- seat_04 - COMBINED VOLATILITY (CRITICAL TEST)
-- Pattern: Days 1-2 have N≥2 AND P≤1 (combined volatility pattern)
-- Expected: 🔴 ELEVATED, COMBINED_VOLATILITY flag (auto-red), 100% engagement
-- ----------------------------------------------------------------------------
INSERT INTO check_ins (id, clinic_id, seat_id, check_in_date, cycle_day, nausea_level, protein_status, created_at) VALUES
('c22','clinic_demo_01','seat_04','2026-01-01',0,2,0,'2026-01-01 08:45:00'),
('c23','clinic_demo_01','seat_04','2026-01-02',1,2,1,'2026-01-02 08:45:00'),
('c24','clinic_demo_01','seat_04','2026-01-03',2,1,2,'2026-01-03 08:45:00'),
('c25','clinic_demo_01','seat_04','2026-01-04',3,0,2,'2026-01-04 08:45:00'),
('c26','clinic_demo_01','seat_04','2026-01-05',4,0,2,'2026-01-05 08:45:00'),
('c27','clinic_demo_01','seat_04','2026-01-06',5,0,2,'2026-01-06 08:45:00'),
('c28','clinic_demo_01','seat_04','2026-01-07',6,0,2,'2026-01-07 08:45:00');

-- ----------------------------------------------------------------------------
-- seat_05 - SEVERE NAUSEA (2 Consecutive Days)
-- Pattern: Days 1-2 have N=3 (consecutive severe nausea)
-- Expected: 🔴 ELEVATED, HIGH_GI_INSTABILITY flag, 100% engagement
-- ----------------------------------------------------------------------------
INSERT INTO check_ins (id, clinic_id, seat_id, check_in_date, cycle_day, nausea_level, protein_status, created_at) VALUES
('c29','clinic_demo_01','seat_05','2026-01-01',0,3,2,'2026-01-01 09:00:00'),
('c30','clinic_demo_01','seat_05','2026-01-02',1,3,2,'2026-01-02 09:00:00'),
('c31','clinic_demo_01','seat_05','2026-01-03',2,1,2,'2026-01-03 09:00:00'),
('c32','clinic_demo_01','seat_05','2026-01-04',3,0,2,'2026-01-04 09:00:00'),
('c33','clinic_demo_01','seat_05','2026-01-05',4,0,2,'2026-01-05 09:00:00'),
('c34','clinic_demo_01','seat_05','2026-01-06',5,0,2,'2026-01-06 09:00:00'),
('c35','clinic_demo_01','seat_05','2026-01-07',6,0,2,'2026-01-07 09:00:00');

-- ----------------------------------------------------------------------------
-- seat_06 - DISENGAGEMENT (3 Consecutive Missed Days)
-- Pattern: Missed days 4, 5, 6 (3 consecutive)
-- Expected: 🔴 ELEVATED, HIGH_DISENGAGEMENT flag, 57% engagement (4/7)
-- ----------------------------------------------------------------------------
INSERT INTO check_ins (id, clinic_id, seat_id, check_in_date, cycle_day, nausea_level, protein_status, created_at) VALUES
('c36','clinic_demo_01','seat_06','2026-01-01',0,0,2,'2026-01-01 09:15:00'),
('c37','clinic_demo_01','seat_06','2026-01-02',1,0,2,'2026-01-02 09:15:00'),
('c38','clinic_demo_01','seat_06','2026-01-03',2,0,2,'2026-01-03 09:15:00'),
-- MISSED: 2026-01-04, 2026-01-05, 2026-01-06
('c39','clinic_demo_01','seat_06','2026-01-07',6,0,2,'2026-01-07 09:15:00');

-- ----------------------------------------------------------------------------
-- seat_07 - PROTEIN RECOVERY (Single Low Day, Then Recovery)
-- Pattern: Day 1 has P=0, but no consecutive pattern (recovered immediately)
-- Expected: 🟢 STABLE, No flags (pattern broken), 100% engagement
-- ----------------------------------------------------------------------------
INSERT INTO check_ins (id, clinic_id, seat_id, check_in_date, cycle_day, nausea_level, protein_status, created_at) VALUES
('c40','clinic_demo_01','seat_07','2026-01-01',0,0,0,'2026-01-01 09:30:00'),
('c41','clinic_demo_01','seat_07','2026-01-02',1,0,2,'2026-01-02 09:30:00'),
('c42','clinic_demo_01','seat_07','2026-01-03',2,0,2,'2026-01-03 09:30:00'),
('c43','clinic_demo_01','seat_07','2026-01-04',3,0,2,'2026-01-04 09:30:00'),
('c44','clinic_demo_01','seat_07','2026-01-05',4,0,2,'2026-01-05 09:30:00'),
('c45','clinic_demo_01','seat_07','2026-01-06',5,0,2,'2026-01-06 09:30:00'),
('c46','clinic_demo_01','seat_07','2026-01-07',6,0,2,'2026-01-07 09:30:00');

-- ----------------------------------------------------------------------------
-- seat_08 - ENGAGEMENT 60-79% (Non-Consecutive Misses)
-- Pattern: Missed days 3 and 6 (non-consecutive), 5/7 check-ins = 71%
-- Expected: 🟡 MONITOR, ENGAGEMENT_DROP flag, 71% engagement
-- ----------------------------------------------------------------------------
INSERT INTO check_ins (id, clinic_id, seat_id, check_in_date, cycle_day, nausea_level, protein_status, created_at) VALUES
('c47','clinic_demo_01','seat_08','2026-01-01',0,0,2,'2026-01-01 09:45:00'),
('c48','clinic_demo_01','seat_08','2026-01-02',1,0,2,'2026-01-02 09:45:00'),
-- MISSED: 2026-01-03
('c49','clinic_demo_01','seat_08','2026-01-04',3,0,2,'2026-01-04 09:45:00'),
('c50','clinic_demo_01','seat_08','2026-01-05',4,0,2,'2026-01-05 09:45:00'),
-- MISSED: 2026-01-06
('c51','clinic_demo_01','seat_08','2026-01-07',6,0,2,'2026-01-07 09:45:00');

-- ----------------------------------------------------------------------------
-- seat_09 - NEW SEAT (Only 3 Days Active)
-- Pattern: First check-in on 2026-01-05, only 3 days of data
-- Expected: 🟢 STABLE, No flags (insufficient pattern), 43% engagement (3/7)
-- ----------------------------------------------------------------------------
INSERT INTO check_ins (id, clinic_id, seat_id, check_in_date, cycle_day, nausea_level, protein_status, created_at) VALUES
('c52','clinic_demo_01','seat_09','2026-01-05',4,0,2,'2026-01-05 10:00:00'),
('c53','clinic_demo_01','seat_09','2026-01-06',5,0,2,'2026-01-06 10:00:00'),
('c54','clinic_demo_01','seat_09','2026-01-07',6,0,2,'2026-01-07 10:00:00');

-- ----------------------------------------------------------------------------
-- seat_10 - BORDERLINE (Mixed Signals, No Consecutive Patterns)
-- Pattern: 1 moderate nausea (day 2), protein below target but not low (P=1)
-- Expected: 🟡 MONITOR, GI_INSTABILITY flag (1 moderate nausea), 86% engagement (6/7)
-- ----------------------------------------------------------------------------
INSERT INTO check_ins (id, clinic_id, seat_id, check_in_date, cycle_day, nausea_level, protein_status, created_at) VALUES
('c55','clinic_demo_01','seat_10','2026-01-01',0,1,2,'2026-01-01 10:15:00'),
('c56','clinic_demo_01','seat_10','2026-01-02',1,2,1,'2026-01-02 10:15:00'),
('c57','clinic_demo_01','seat_10','2026-01-03',2,1,1,'2026-01-03 10:15:00'),
('c58','clinic_demo_01','seat_10','2026-01-04',3,0,2,'2026-01-04 10:15:00'),
('c59','clinic_demo_01','seat_10','2026-01-05',4,0,2,'2026-01-05 10:15:00'),
('c60','clinic_demo_01','seat_10','2026-01-06',5,0,2,'2026-01-06 10:15:00');
-- MISSED: 2026-01-07

-- ============================================================================
-- 4. SEAT_STATUS (Initial State)
-- ============================================================================
-- Updated on each check-in submission in production
-- Initialized here with current state as of 2026-01-07
-- ============================================================================
INSERT INTO seat_status (seat_id, clinic_id, last_check_in_date, consecutive_missed_days, total_check_ins, updated_at) VALUES
('seat_01','clinic_demo_01','2026-01-07',0,7,'2026-01-07 08:00:00'),
('seat_02','clinic_demo_01','2026-01-07',0,7,'2026-01-07 08:15:00'),
('seat_03','clinic_demo_01','2026-01-07',0,7,'2026-01-07 08:30:00'),
('seat_04','clinic_demo_01','2026-01-07',0,7,'2026-01-07 08:45:00'),
('seat_05','clinic_demo_01','2026-01-07',0,7,'2026-01-07 09:00:00'),
('seat_06','clinic_demo_01','2026-01-07',0,4,'2026-01-07 09:15:00'),
('seat_07','clinic_demo_01','2026-01-07',0,7,'2026-01-07 09:30:00'),
('seat_08','clinic_demo_01','2026-01-07',0,5,'2026-01-07 09:45:00'),
('seat_09','clinic_demo_01','2026-01-07',0,3,'2026-01-07 10:00:00'),
('seat_10','clinic_demo_01','2026-01-06',1,6,'2026-01-06 10:15:00');

-- ============================================================================
-- EXPECTED RISK ENGINE OUTCOMES (Test Oracle)
-- ============================================================================
-- Use this table to validate your risk engine implementation
-- If dashboard output doesn't match, risk logic is incorrect
-- ============================================================================
--
-- Seat     | Pattern                  | Risk Tier  | Flags                    | Engagement
-- ---------|--------------------------|------------|--------------------------|------------
-- seat_01  | Fully stable             | STABLE     | none                     | 100%
-- seat_02  | 2 low protein days       | MONITOR    | LOW_PROTEIN              | 100%
-- seat_03  | 2 moderate nausea        | MONITOR    | GI_INSTABILITY           | 100%
-- seat_04  | Combined volatility      | ELEVATED   | COMBINED_VOLATILITY      | 100%
-- seat_05  | Severe nausea 2 days     | ELEVATED   | HIGH_GI_INSTABILITY      | 100%
-- seat_06  | Missed 3 consecutive     | ELEVATED   | HIGH_DISENGAGEMENT       | 57%
-- seat_07  | Protein recovery         | STABLE     | none                     | 100%
-- seat_08  | 5/7 check-ins            | MONITOR    | ENGAGEMENT_DROP          | 71%
-- seat_09  | New seat (3 days)        | STABLE     | none (insufficient data) | 43%
-- seat_10  | Borderline mix           | MONITOR    | GI_INSTABILITY           | 86%
--
-- ============================================================================
-- CRITICAL TEST CASES
-- ============================================================================
-- 1. seat_04: MUST show ELEVATED (combined volatility auto-red)
-- 2. seat_06: MUST show ELEVATED (3+ consecutive missed)
-- 3. seat_07: MUST show STABLE (single low protein, no consecutive pattern)
-- 4. seat_10: MUST show MONITOR (single moderate nausea triggers flag)
-- ============================================================================
