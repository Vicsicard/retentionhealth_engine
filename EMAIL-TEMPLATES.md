# EMAIL TEMPLATES - PATH A PILOT

## Template 1: Signup Notification (To You)

**Subject:** New Pilot Signup - [Clinic Name]

```
New clinic has applied for the pilot program:

CLINIC DETAILS:
- Clinic Name: [Name]
- Contact: [Contact Name]
- Email: [Email]
- Phone: [Phone]
- Active Patients: [Range]

CLINIC ID: [clinic_id]
STATUS: PENDING

TO APPROVE THIS CLINIC:

curl -X POST https://retentionhealth.com/api/admin/approve-clinic \
  -H "x-admin-key: rh_pilot_admin_2026_secure_key_v1" \
  -H "Content-Type: application/json" \
  -d '{"clinic_id": "[clinic_id]"}'

This will generate credentials and return them for you to send to the clinic.
```

---

## Template 2: Onboarding Email (To Clinic)

**Subject:** Welcome to RetentionHealth Pilot - Your Dashboard Access

```
Hi [Contact Name],

Welcome to the RetentionHealth 8-week pilot program!

YOUR DASHBOARD ACCESS:

Quick Login Link (Bookmark This):
[MAGIC_LINK]

Or login manually at:
https://retentionhealth.com/clinic/login

Clinic ID: [CLINIC_ID]
API Key: [API_KEY]

NEXT STEPS:

1. Click the quick login link above
2. Submit Week 1 data (takes 2 minutes)
3. View your cohort comparison dashboard

WHAT TO SUBMIT WEEKLY:

Every Monday by 10am, submit:
- Baseline cohort metrics (4 numbers)
- Stabilization cohort metrics (4 numbers)

The form is simple - just 8 numbers total. No spreadsheets, no complex data entry.

WHAT YOU'LL GET:

- Weekly cohort comparison dashboard
- Engagement delta tracking
- Volatility reduction metrics
- Drop-off rate comparison
- Monday summary emails (starting Week 2)

PILOT TIMELINE:

- Duration: 8 weeks
- Start Date: [PILOT_START_DATE]
- Weekly submissions due: Mondays by 10am
- Final review: Week 8

Questions? Reply to this email anytime.

Best,
[Your Name]
RetentionHealth
[Your Email]
[Your Phone]
```

---

## Template 3: Monday Summary Email (Weeks 2-8)

**Subject:** Week [N] Retention Summary - [Clinic Name]

```
Hi [Contact Name],

Here's your Week [N] cohort performance summary:

BASELINE COHORT (Control)
- Patients: [count]
- Engagement: [rate]%
- Volatility events: [count]
- Avg refill delta: +[days] days

STABILIZATION COHORT (Structured Protocol)
- Patients: [count]
- Engagement: [rate]%
- Volatility events: [count]
- Avg refill delta: +[days] days

KEY DELTAS:
✓ +[X]% engagement lift
✓ [X]% volatility reduction
✓ [X]% refill timing improvement

OPERATOR WIN:
[Specific observation about what's working]

NEXT STEPS:
- Week [N+1] data due Monday 10am
- [Any specific recommendations based on data]

View full dashboard: https://retentionhealth.com/clinic/dashboard

Questions? Reply anytime.

Best,
[Your Name]
```

---

## Template 4: Week 8 Final Review Invitation

**Subject:** Week 8 Final Review - [Clinic Name] Pilot Results

```
Hi [Contact Name],

Congratulations on completing the 8-week RetentionHealth pilot!

PILOT RESULTS SUMMARY:

Over 8 weeks, your stabilization cohort showed:
- [X]% better retention than baseline
- [X]% engagement lift
- [X]% volatility reduction
- [X]% drop-off improvement

ECONOMIC IMPACT:

Based on your cohort data:
- Patients retained: [count]
- Preserved monthly revenue: $[amount]
- Annualized impact: $[amount]

NEXT STEPS:

Let's schedule a 30-minute call to review:
1. Full 8-week outcomes
2. What worked best for your clinic
3. Options for continuing the structure

Available times:
- [Option 1]
- [Option 2]
- [Option 3]

Or suggest a time that works for you.

Thank you for being a pilot partner. Your data has been invaluable.

Best,
[Your Name]
RetentionHealth
[Your Email]
[Your Phone]
```

---

## Template 5: Reminder Email (If Submission Missed)

**Subject:** Week [N] Data Submission Reminder - [Clinic Name]

```
Hi [Contact Name],

Quick reminder: Week [N] cohort data was due Monday 10am.

No worries if you got busy - you can still submit:
https://retentionhealth.com/clinic/submit

Takes 2 minutes. Just 8 numbers.

Need help or have questions? Reply to this email.

Best,
[Your Name]
```

---

## APPROVAL WORKFLOW

### When Clinic Signs Up:

1. Check your email or database for new pending clinics
2. Review clinic details (name, contact, patient count)
3. Decide: approve or reject

### To Approve:

```bash
curl -X POST https://retentionhealth.com/api/admin/approve-clinic \
  -H "x-admin-key: rh_pilot_admin_2026_secure_key_v1" \
  -H "Content-Type: application/json" \
  -d '{"clinic_id": "clinic_XXXXX"}'
```

### Response Will Include:

```json
{
  "ok": true,
  "clinic_id": "clinic_XXXXX",
  "clinic_name": "ABC Clinic",
  "api_key": "generated_key_here",
  "magic_link": "https://retentionhealth.com/clinic/login?token=JWT",
  "pilot_start_date": "2026-03-02"
}
```

### Then:

1. Copy Template 2 (Onboarding Email)
2. Replace placeholders with values from API response
3. Send to clinic contact email
4. Done!

---

## WEEKLY WORKFLOW

### Monday Morning:

1. Check which clinics submitted data
2. For each clinic that submitted:
   - Pull dashboard data
   - Copy Template 3 (Monday Summary)
   - Fill in metrics
   - Send email

### If Clinic Missed Submission:

1. Wait until Tuesday
2. Send Template 5 (Reminder)
3. Follow up if still no submission by Wednesday

---

## WEEK 8 WORKFLOW

### After Final Submission:

1. Calculate full 8-week outcomes
2. Copy Template 4 (Final Review)
3. Fill in results
4. Schedule close call
5. Decide: Move to Path B or pivot
