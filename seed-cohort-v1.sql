-- ============================================================================
-- RETENTION HEALTH V1 - COHORT SEED DATA
-- ============================================================================
-- Demo clinic with two cohorts for testing
-- ============================================================================

-- ============================================================================
-- 1. DEMO CLINIC
-- ============================================================================
INSERT INTO clinics (id, name, api_key, pilot_status)
VALUES ('clinic_demo_01', 'Demo GLP-1 Clinic', 'demo_key_for_testing_only_replace_in_production', 'active');

-- ============================================================================
-- 2. COHORTS (Baseline and Stabilization)
-- ============================================================================
INSERT INTO cohorts (id, clinic_id, cohort_label, start_date, patient_count)
VALUES 
('cohort_baseline_01', 'clinic_demo_01', 'Baseline', '2026-01-01', 20),
('cohort_stabilization_01', 'clinic_demo_01', 'Stabilization', '2026-01-01', 22);

-- ============================================================================
-- 3. WEEKLY METRICS (12 weeks of sample data)
-- ============================================================================

-- Baseline Cohort (showing typical instability pattern)
INSERT INTO weekly_metrics (id, cohort_id, week_number, engagement_count, volatility_event_count, avg_refill_delta_days, dropoff_count) VALUES
('wm_b_01', 'cohort_baseline_01', 1, 18, 2, 1.5, 0),
('wm_b_02', 'cohort_baseline_01', 2, 16, 4, 2.1, 1),
('wm_b_03', 'cohort_baseline_01', 3, 15, 5, 2.8, 0),
('wm_b_04', 'cohort_baseline_01', 4, 14, 7, 2.8, 1),
('wm_b_05', 'cohort_baseline_01', 5, 13, 6, 3.2, 1),
('wm_b_06', 'cohort_baseline_01', 6, 12, 8, 3.5, 1),
('wm_b_07', 'cohort_baseline_01', 7, 11, 7, 3.8, 0),
('wm_b_08', 'cohort_baseline_01', 8, 11, 9, 4.1, 1),
('wm_b_09', 'cohort_baseline_01', 9, 10, 8, 4.2, 0),
('wm_b_10', 'cohort_baseline_01', 10, 9, 7, 4.5, 1),
('wm_b_11', 'cohort_baseline_01', 11, 9, 6, 4.3, 0),
('wm_b_12', 'cohort_baseline_01', 12, 8, 5, 4.0, 0);

-- Stabilization Cohort (showing improvement from behavioral reinforcement)
INSERT INTO weekly_metrics (id, cohort_id, week_number, engagement_count, volatility_event_count, avg_refill_delta_days, dropoff_count) VALUES
('wm_s_01', 'cohort_stabilization_01', 1, 20, 2, 1.2, 0),
('wm_s_02', 'cohort_stabilization_01', 2, 19, 3, 1.4, 0),
('wm_s_03', 'cohort_stabilization_01', 3, 19, 3, 1.3, 0),
('wm_s_04', 'cohort_stabilization_01', 4, 19, 3, 1.2, 0),
('wm_s_05', 'cohort_stabilization_01', 5, 18, 4, 1.5, 1),
('wm_s_06', 'cohort_stabilization_01', 6, 18, 3, 1.4, 0),
('wm_s_07', 'cohort_stabilization_01', 7, 17, 4, 1.6, 0),
('wm_s_08', 'cohort_stabilization_01', 8, 17, 3, 1.5, 0),
('wm_s_09', 'cohort_stabilization_01', 9, 17, 2, 1.3, 0),
('wm_s_10', 'cohort_stabilization_01', 10, 16, 3, 1.4, 1),
('wm_s_11', 'cohort_stabilization_01', 11, 16, 2, 1.2, 0),
('wm_s_12', 'cohort_stabilization_01', 12, 16, 2, 1.1, 0);

-- ============================================================================
-- EXPECTED RESULTS (Week 4 comparison)
-- ============================================================================
-- 
-- Baseline (Week 4):
-- - Engagement: 14/20 = 70%
-- - Volatility: 7/20 = 35%
-- - Avg Refill Delta: 2.8 days
-- - Dropoff: 3/20 = 15%
--
-- Stabilization (Week 4):
-- - Engagement: 19/22 = 86%
-- - Volatility: 3/22 = 14%
-- - Avg Refill Delta: 1.2 days
-- - Dropoff: 1/22 = 5%
--
-- DELTA:
-- - Engagement: +16%
-- - Volatility: -21%
-- - Refill Delta: -1.6 days
-- - Dropoff: -10%
--
-- ============================================================================
