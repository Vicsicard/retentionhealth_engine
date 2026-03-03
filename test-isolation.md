# Per-Clinic Isolation Tests

## Prerequisites
1. Deploy schema to remote D1
2. Deploy Worker
3. Create two test clinics via admin endpoint

## Test 1: Clinic A Valid Credentials ✅ MUST PASS

**Request:**
```bash
curl -X POST https://retentionhealth-engine.vicsicard.workers.dev/api/clinic/metrics \
  -H "Content-Type: application/json" \
  -H "x-clinic-id: clinic_a_id" \
  -H "x-clinic-key: clinic_a_api_key" \
  -d '{
    "cohort_label": "Baseline",
    "week_number": 1,
    "patient_count": 15,
    "engagement_count": 12,
    "volatility_events": 3,
    "avg_refill_delta_days": 2.1
  }'
```

**Expected:** `200 OK` with success message

**Result:** [ ] PASS [ ] FAIL

---

## Test 2: Clinic A Wrong Key ❌ MUST FAIL

**Request:**
```bash
curl -X POST https://retentionhealth-engine.vicsicard.workers.dev/api/clinic/metrics \
  -H "Content-Type: application/json" \
  -H "x-clinic-id: clinic_a_id" \
  -H "x-clinic-key: wrong_random_key_12345" \
  -d '{
    "cohort_label": "Baseline",
    "week_number": 1,
    "patient_count": 15,
    "engagement_count": 12,
    "volatility_events": 3,
    "avg_refill_delta_days": 2.1
  }'
```

**Expected:** `401 Unauthorized` with "Invalid clinic credentials"

**Result:** [ ] PASS [ ] FAIL

---

## Test 3: Clinic A Using Clinic B's ID ❌ MUST FAIL

**Request:**
```bash
curl -X POST https://retentionhealth-engine.vicsicard.workers.dev/api/clinic/metrics \
  -H "Content-Type: application/json" \
  -H "x-clinic-id: clinic_b_id" \
  -H "x-clinic-key: clinic_a_api_key" \
  -d '{
    "cohort_label": "Baseline",
    "week_number": 1,
    "patient_count": 15,
    "engagement_count": 12,
    "volatility_events": 3,
    "avg_refill_delta_days": 2.1
  }'
```

**Expected:** `401 Unauthorized` with "Invalid clinic credentials"

**Result:** [ ] PASS [ ] FAIL

---

## Test 4: Dashboard Isolation ❌ MUST FAIL

**Request (Clinic A tries to view Clinic B dashboard):**
```bash
curl -X GET https://retentionhealth-engine.vicsicard.workers.dev/api/clinic/dashboard \
  -H "x-clinic-id: clinic_b_id" \
  -H "x-clinic-key: clinic_a_api_key"
```

**Expected:** `401 Unauthorized` with "Invalid clinic credentials"

**Result:** [ ] PASS [ ] FAIL

---

**Request (Clinic A views own dashboard):**
```bash
curl -X GET https://retentionhealth-engine.vicsicard.workers.dev/api/clinic/dashboard \
  -H "x-clinic-id: clinic_a_id" \
  -H "x-clinic-key: clinic_a_api_key"
```

**Expected:** `200 OK` with only Clinic A's data

**Result:** [ ] PASS [ ] FAIL

---

## GO/NO-GO Decision

**If ALL tests pass:** ✅ GO for pilot onboarding

**If ANY test fails:** 🔴 NO-GO - fix isolation breach before any clinic access

---

## Admin Clinic Creation Test

**Create Clinic A:**
```bash
curl -X POST https://retentionhealth-engine.vicsicard.workers.dev/api/admin/create-clinic \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_KEY" \
  -d '{"name": "Test Clinic A"}'
```

**Expected Response:**
```json
{
  "ok": true,
  "clinic_id": "clinic_...",
  "clinic_api_key": "...",
  "name": "Test Clinic A"
}
```

**Save the clinic_api_key securely - it's only shown once.**

---

## Deployment Sequence

1. **Deploy Schema (Remote D1)**
   ```bash
   cd "C:\Users\digit\CascadeProjects\retentionhealth engine"
   wrangler d1 execute retentionhealth_v1 --file=schema-cohort-v1.sql --remote
   wrangler d1 execute retentionhealth_v1 --file=seed-cohort-v1.sql --remote
   ```

2. **Set Admin Key Secret**
   ```bash
   wrangler secret put ADMIN_KEY
   # Enter a secure random key when prompted
   ```

3. **Deploy Worker**
   ```bash
   wrangler deploy
   ```

4. **Create Test Clinics**
   - Use admin endpoint to create Clinic A
   - Use admin endpoint to create Clinic B
   - Save both API keys

5. **Run Isolation Tests**
   - Execute all 4 tests above
   - Verify all pass/fail as expected

6. **If all tests pass:**
   - Create first pilot clinic
   - Provide onboarding packet
   - Begin weekly metric collection
