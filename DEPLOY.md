# RetentionHealth V1 - Production Deployment Guide

## ⚠️ CRITICAL: DO NOT RUN SEED DATA ON REMOTE

**Seed data contains demo API key and is for LOCAL TESTING ONLY.**

**Production clinics must be created via admin endpoint only.**

---

## Deployment Sequence

### Step 1: Deploy Schema (Remote D1)

**Deploy schema ONLY (no seed data):**

```bash
cd "C:\Users\digit\CascadeProjects\retentionhealth engine"
wrangler d1 execute retentionhealth_v1 --file=schema-cohort-v1.sql --remote
```

**Verify tables created:**

```bash
wrangler d1 execute retentionhealth_v1 --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;" --remote
```

**Expected output:**
- `_cf_METADATA`
- `clinics`
- `cohorts`
- `weekly_metrics`

**❌ DO NOT RUN:**
```bash
# NEVER run this on remote:
wrangler d1 execute retentionhealth_v1 --file=seed-cohort-v1.sql --remote
```

---

### Step 2: Set Admin Key Secret

**Generate a strong random admin key:**

```bash
# Use a password manager or generate via:
# openssl rand -base64 32
```

**Set as Cloudflare secret:**

```bash
wrangler secret put ADMIN_KEY
# Paste your strong random key when prompted
```

**Store this key securely (1Password, Bitwarden, etc.)**

---

### Step 3: Deploy Worker

```bash
wrangler deploy
```

**Verify deployment:**

```bash
curl https://retentionhealth-engine.vicsicard.workers.dev/health
```

**Expected:**
```json
{
  "ok": true,
  "version": "v1-cohort-only"
}
```

---

### Step 4: Create First Test Clinic

**Use admin endpoint to create clinic:**

```bash
curl -X POST https://retentionhealth-engine.vicsicard.workers.dev/api/admin/create-clinic \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_KEY_HERE" \
  -d '{"name": "Test Clinic A"}'
```

**Expected response:**
```json
{
  "ok": true,
  "clinic_id": "clinic_1234567890_abc123",
  "clinic_api_key": "RANDOM_32_CHAR_KEY_HERE",
  "name": "Test Clinic A"
}
```

**⚠️ CRITICAL: Save the clinic_api_key immediately.**

This key is shown ONCE and cannot be recovered.

Store in secure notes with:
- Clinic name
- Clinic ID
- API key
- Date created

---

### Step 5: Run Isolation Tests (Remote Only)

**See `test-isolation.md` for full test suite.**

**Create second test clinic:**

```bash
curl -X POST https://retentionhealth-engine.vicsicard.workers.dev/api/admin/create-clinic \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_KEY_HERE" \
  -d '{"name": "Test Clinic B"}'
```

**Run all 4 isolation tests:**
1. ✅ Clinic A valid credentials → 200
2. ❌ Clinic A wrong key → 401
3. ❌ Clinic A using Clinic B ID → 401
4. ❌ Clinic A viewing Clinic B dashboard → 401

**If ALL tests pass:** GO for pilot onboarding

**If ANY test fails:** NO-GO - fix before clinic access

---

### Step 6: Deploy Frontend (if not already)

```bash
cd "C:\Users\digit\CascadeProjects\retentionhealth land 1\website"
npm run build
wrangler pages deploy
```

---

## Local Development

**For local testing, you CAN use seed data:**

```bash
# Local only:
wrangler d1 execute retentionhealth_v1 --file=schema-cohort-v1.sql
wrangler d1 execute retentionhealth_v1 --file=seed-cohort-v1.sql
```

**Demo clinic credentials (local only):**
- Clinic ID: `clinic_demo_01`
- API Key: `demo_key_for_testing_only_replace_in_production`

**These credentials will NOT work in production.**

---

## Security Checklist

Before onboarding any pilot clinic:

- [ ] Schema deployed to remote (no seed data)
- [ ] ADMIN_KEY set as secret (strong random key)
- [ ] Worker deployed to production
- [ ] Test clinic created via admin endpoint
- [ ] Clinic API key stored securely
- [ ] All 4 isolation tests passed on remote
- [ ] Frontend deployed
- [ ] pilot_status='active' enforcement verified

---

## Clinic Onboarding Process

1. **Create clinic via admin endpoint**
2. **Save clinic_id and clinic_api_key securely**
3. **Provide credentials to clinic contact (encrypted email or secure share)**
4. **Provide onboarding packet** (see `docs/Pilot-Protocol-V1.md`)
5. **Schedule weekly check-in**
6. **Monitor first metric submission**

---

## Emergency Procedures

### Pause a Clinic

```bash
wrangler d1 execute retentionhealth_v1 \
  --command "UPDATE clinics SET pilot_status='paused' WHERE id='clinic_id_here';" \
  --remote
```

Paused clinics cannot submit metrics or access dashboard.

### Rotate a Lost API Key

1. Generate new key via admin endpoint (future feature)
2. Update clinic row with new key
3. Provide new key to clinic securely

**For V1 pilot: If key is lost, create new clinic and migrate data manually.**

---

## What NOT to Do

❌ **Never run seed data on remote**
❌ **Never share ADMIN_KEY with clinics**
❌ **Never create "get my key" endpoint**
❌ **Never allow cross-clinic data access**
❌ **Never store PHI in any field**

---

**Questions?** Contact: vic@getdigdev.com
