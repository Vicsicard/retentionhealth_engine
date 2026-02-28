# **RETENTION HEALTH V1 — API CONTRACT**

**Base URL (MVP):** `https://your-worker-domain.workers.dev`

---

## **🔷 AUTHENTICATION**

### **Patient Token**
- Obtained via `/api/patient/login`
- Expires: 14 days
- Format: `Authorization: Bearer {token}`
- Payload: `{ t: "patient", clinic_id, seat_id, exp }`

### **Clinic Token**
- Obtained via `/api/clinic/login`
- Expires: 12 hours
- Format: `Authorization: Bearer {token}`
- Payload: `{ t: "clinic", clinic_id, exp }`

### **Admin Key (MVP Alternative)**
- Header: `x-admin-key: YOUR_ADMIN_KEY`
- Header: `x-clinic-id: clinic_demo_01`
- Used for clinic dashboard access without login

---

## **🔷 PATIENT ENDPOINTS**

### **1. Patient Login**

```http
POST /api/patient/login
Content-Type: application/json
```

**Request:**
```json
{
  "clinic_id": "clinic_demo_01",
  "patient_external_id": "EXT001"
}
```

**Success Response (200):**
```json
{
  "ok": true,
  "token": "eyJ0Ijoi...",
  "seat_id": "seat_01",
  "clinic_id": "clinic_demo_01"
}
```

**Error Response (400):**
```json
{
  "ok": false,
  "error": "Invalid clinic_id"
}
```

---

### **2. Get Daily Output**

```http
GET /api/patient/daily-output
Authorization: Bearer {token}
```

#### **Case A: PRE_CHECKIN (No check-in today)**

**Response (200):**
```json
{
  "ok": true,
  "mode": "PRE_CHECKIN",
  "clinic_id": "clinic_demo_01",
  "seat_id": "seat_01",
  "date": "2026-01-07",
  "cycle_day": 2,
  "phase": "PEAK_SUPPRESSION",
  "header": "Day 2 Post-Injection",
  "subtext": "Consistency reduces decision fatigue.",
  "focus": [
    "Maintain smaller portions",
    "Simple protein options",
    "Avoid heavy meals",
    "Hydrate consistently"
  ],
  "context_line": "You are in Day 2 post-injection. Appetite fluctuation is common during this window.",
  "protein_examples": [
    "Greek yogurt",
    "Protein shake",
    "Egg whites",
    "Cottage cheese",
    "Soft tofu"
  ]
}
```

**UI Flow:**
- Render Screen 1 (Nausea input)
- Render Screen 2 (Protein input)
- Submit via `/api/patient/checkin`
- Fetch daily output again (will return POST_CHECKIN mode)

---

#### **Case B: POST_CHECKIN (Already checked in today)**

**Response (200):**
```json
{
  "ok": true,
  "mode": "POST_CHECKIN",
  "clinic_id": "clinic_demo_01",
  "seat_id": "seat_01",
  "date": "2026-01-07",
  "cycle_day": 2,
  "phase": "PEAK_SUPPRESSION",
  "guidance_template_id": "D2_N3_P0",
  "header": "Day 2 Post-Injection",
  "subtext": "Consistency reduces decision fatigue.",
  "focus": [],
  "nausea_protocol": {
    "title": "Stabilization Protocol – High Discomfort",
    "bullets": [
      "Soft or liquid protein only",
      "Very small intake",
      "Avoid fats entirely",
      "Sip fluids consistently",
      "Pause heavy meals"
    ]
  },
  "safety_line": "If symptoms persist or worsen, contact your clinic.",
  "protein_modifier": {
    "title": "Protein Priority",
    "bullets": [
      "Start with protein early",
      "Choose easiest digestible options",
      "Keep portions small but consistent"
    ]
  },
  "protein_examples": [
    "Greek yogurt",
    "Protein shake",
    "Egg whites",
    "Cottage cheese",
    "Soft tofu"
  ],
  "context_line": "You are in Day 2 post-injection. Appetite fluctuation is common during this window.",
  "encouragement": "Quick check-ins help keep this week steady."
}
```

**UI Flow:**
- Render Screen 3 (Daily output)
- Display `header`, `subtext`
- Display `focus` bullets (if present)
- Display `nausea_protocol` (if present)
- Display `safety_line` (if present)
- Display `protein_modifier`
- Display `protein_examples`

---

### **3. Submit Check-In**

```http
POST /api/patient/checkin
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "nausea_level": 2,
  "protein_status": 0
}
```

**Field Constraints:**
- `nausea_level`: Integer 0-3 (0=None, 1=Mild, 2=Moderate, 3=Severe)
- `protein_status`: Integer 0-2 (0=Low, 1=Moderate, 2=OnTarget)

**Success Response (200):**
```json
{
  "ok": true,
  "seat_id": "seat_01",
  "clinic_id": "clinic_demo_01",
  "date": "2026-01-07",
  "cycle_day": 2
}
```

**Error Response (400):**
```json
{
  "ok": false,
  "error": "nausea_level must be integer 0..3"
}
```

**Idempotent Behavior:**
- If patient already checked in today, updates existing record
- Allows correction of today's check-in

**Next Step:**
- UI should immediately call `GET /api/patient/daily-output` to retrieve guidance

---

## **🔷 CLINIC ENDPOINTS**

### **4. Clinic Login**

```http
POST /api/clinic/login
Content-Type: application/json
```

**Request:**
```json
{
  "clinic_id": "clinic_demo_01",
  "admin_key": "YOUR_ADMIN_KEY"
}
```

**Success Response (200):**
```json
{
  "ok": true,
  "token": "eyJ0Ijoi...",
  "clinic_id": "clinic_demo_01"
}
```

**Error Response (401):**
```json
{
  "ok": false,
  "error": "Invalid admin key"
}
```

---

### **5. Clinic Dashboard Summary**

```http
GET /api/clinic/dashboard/summary
Authorization: Bearer {clinic_token}
```

**Alternative Auth (MVP):**
```http
GET /api/clinic/dashboard/summary
x-admin-key: YOUR_ADMIN_KEY
x-clinic-id: clinic_demo_01
```

**Success Response (200):**
```json
{
  "ok": true,
  "clinic_id": "clinic_demo_01",
  "window": {
    "from": "2026-01-01",
    "to": "2026-01-07"
  },
  "counts": {
    "total": 10,
    "STABLE": 3,
    "MONITOR": 4,
    "ELEVATED": 3
  },
  "seats": [
    {
      "seat_id": "seat_01",
      "patient_external_id": "EXT001",
      "injection_day": 0,
      "last_check_in_date": "2026-01-07",
      "last_nausea": 0,
      "last_protein": 2,
      "engagement_rate": 100,
      "consecutive_missed_days": 0,
      "flags": [],
      "risk_tier": "STABLE"
    },
    {
      "seat_id": "seat_04",
      "patient_external_id": "EXT004",
      "injection_day": 3,
      "last_check_in_date": "2026-01-07",
      "last_nausea": 0,
      "last_protein": 2,
      "engagement_rate": 100,
      "consecutive_missed_days": 0,
      "flags": [
        "COMBINED_VOLATILITY"
      ],
      "risk_tier": "ELEVATED"
    },
    {
      "seat_id": "seat_06",
      "patient_external_id": "EXT006",
      "injection_day": 5,
      "last_check_in_date": "2026-01-07",
      "last_nausea": 0,
      "last_protein": 2,
      "engagement_rate": 57,
      "consecutive_missed_days": 0,
      "flags": [
        "ENGAGEMENT_DROP"
      ],
      "risk_tier": "ELEVATED"
    }
  ]
}
```

---

## **🔷 RISK TIER DEFINITIONS**

### **🟢 STABLE**
- Engagement ≥ 80%
- No active risk flags

### **🟡 MONITOR**
- Engagement 60-79%
- OR 1 active risk flag

### **🔴 ELEVATED**
- Engagement < 60%
- OR 2+ active flags
- OR `COMBINED_VOLATILITY` flag present
- OR 3+ consecutive missed days

---

## **🔷 RISK FLAGS**

| Flag | Trigger Condition |
|------|-------------------|
| `ENGAGEMENT_DROP` | 2+ consecutive missed days |
| `GI_INSTABILITY` | 2+ consecutive check-ins with nausea ≥2 OR nausea =3 |
| `LOW_PROTEIN` | 2+ consecutive check-ins with protein =0 |
| `COMBINED_VOLATILITY` | 2+ consecutive check-ins with nausea ≥2 AND protein ≤1 |

**Note:** Consecutive streaks are **submission-based** (not calendar-based). Missed days break the streak.

---

## **🔷 CURL TEST EXAMPLES**

### **1. Patient Login**
```bash
curl -X POST https://your-worker-domain.workers.dev/api/patient/login \
  -H "Content-Type: application/json" \
  -d '{
    "clinic_id": "clinic_demo_01",
    "patient_external_id": "EXT001"
  }'
```

### **2. Submit Check-In**
```bash
curl -X POST https://your-worker-domain.workers.dev/api/patient/checkin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN_HERE" \
  -d '{
    "nausea_level": 2,
    "protein_status": 1
  }'
```

### **3. Get Daily Output**
```bash
curl https://your-worker-domain.workers.dev/api/patient/daily-output \
  -H "Authorization: Bearer PATIENT_TOKEN_HERE"
```

### **4. Clinic Login**
```bash
curl -X POST https://your-worker-domain.workers.dev/api/clinic/login \
  -H "Content-Type: application/json" \
  -d '{
    "clinic_id": "clinic_demo_01",
    "admin_key": "YOUR_ADMIN_KEY"
  }'
```

### **5. Clinic Dashboard**
```bash
curl https://your-worker-domain.workers.dev/api/clinic/dashboard/summary \
  -H "Authorization: Bearer CLINIC_TOKEN_HERE"
```

**Alternative (Admin Key):**
```bash
curl https://your-worker-domain.workers.dev/api/clinic/dashboard/summary \
  -H "x-admin-key: YOUR_ADMIN_KEY" \
  -H "x-clinic-id: clinic_demo_01"
```

---

## **🔷 TEMPLATE ID FORMAT**

All guidance outputs include a `guidance_template_id` in the format:

```
D{cycle_day}_N{nausea_level}_P{protein_status}
```

**Examples:**
- `D0_N0_P2` = Day 0, No nausea, On target protein
- `D2_N3_P0` = Day 2, Severe nausea, Low protein
- `D5_N1_P1` = Day 5, Mild nausea, Moderate protein

**Total possible states:** 7 × 4 × 3 = 84 templates

---

## **🔷 PHASE MAPPING**

| Cycle Day | Phase | Intensity |
|-----------|-------|-----------|
| 0 | Suppression Initiation | Moderate |
| 1 | Peak Suppression | High |
| 2 | Peak Suppression | High |
| 3 | Adjustment | Moderate |
| 4 | Adjustment | Moderate |
| 5 | Stabilization | Controlled |
| 6 | Stabilization | Controlled |

---

## **🔷 ERROR RESPONSES**

All error responses follow this format:

```json
{
  "ok": false,
  "error": "Error message here",
  "details": {} // Optional
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found (invalid endpoint)

---

## **🔷 ARCHITECTURE NOTES**

### **Stateless Design**
- All risk calculations performed live on dashboard load
- No stored risk tiers or flags
- Template IDs calculated from `(cycle_day, nausea_level, protein_status)`

### **Multi-Tenant Isolation**
- All queries filtered by `clinic_id` from authenticated token
- Patient cannot access data from other clinics
- Clinic cannot access data from other clinics

### **Idempotent Operations**
- Check-in submission is idempotent (updates if already exists today)
- Allows patient to correct today's check-in

### **Rolling 7-Day Window**
- Dashboard always shows last 7 calendar days
- Engagement calculated as `(check-ins / 7) * 100`
- Risk flags based on consecutive submission patterns

---

## **🔷 PRODUCTION CHECKLIST**

Before going live:

- [ ] Set `AUTH_SECRET` (32+ random bytes)
- [ ] Set `ADMIN_KEY` (strong random string)
- [ ] Create D1 database
- [ ] Run schema.sql
- [ ] Run seed.sql (for testing)
- [ ] Deploy Worker
- [ ] Test all endpoints with curl
- [ ] Verify dashboard matches seed oracle
- [ ] Remove seed data before production use

---

**End of API Contract**
