# Rate Limiting Recommendations

## Current Status (V1 Pilot)

**No rate limiting implemented yet.**

For 5-6 pilot clinics submitting weekly metrics, this is acceptable.

---

## Why Rate Limiting Matters

**Risks without rate limiting:**
- Accidental script loops flooding database
- Malicious writes corrupting pilot dataset
- API abuse if credentials leaked

**For pilot scale:** Low risk, but should add before scaling.

---

## Recommended Implementation (Post-Pilot)

### Option 1: Cloudflare Rate Limiting Rules (Easiest)

**In Cloudflare Dashboard:**
1. Go to Security → WAF → Rate limiting rules
2. Create rule for `/api/clinic/metrics`
3. Set threshold: 100 requests per 10 minutes per clinic_id
4. Action: Block with 429 status

**Cost:** Free tier includes 10K requests/month

**Pros:**
- No code changes
- Managed by Cloudflare
- Automatic 429 responses

**Cons:**
- Requires Cloudflare dashboard access
- Not version-controlled

---

### Option 2: Worker-Based Rate Limiting (More Control)

**Using Cloudflare Durable Objects:**

```typescript
// Simple in-memory rate limiter (resets on Worker restart)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(clinicId: string, maxRequests = 100, windowMs = 600000): boolean {
  const now = Date.now();
  const limit = rateLimits.get(clinicId);

  if (!limit || now > limit.resetAt) {
    rateLimits.set(clinicId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (limit.count >= maxRequests) {
    return false;
  }

  limit.count++;
  return true;
}

// In routeSubmitMetrics:
if (!checkRateLimit(clinicId)) {
  return json({ ok: false, error: 'Rate limit exceeded' }, 429);
}
```

**Limits:**
- 100 requests per 10 minutes per clinic
- Resets on Worker restart (acceptable for pilot)

**Pros:**
- Version-controlled
- Customizable per route
- No additional cost

**Cons:**
- In-memory (not persistent)
- Resets on deployment

---

### Option 3: Durable Objects (Production-Grade)

**For V2 or enterprise scale:**

Use Cloudflare Durable Objects for persistent rate limiting across Worker instances.

**Cost:** $0.15 per million requests

**When to use:** After pilot, if scaling to 50+ clinics

---

## Recommended Timeline

**V1 Pilot (Now):**
- No rate limiting
- Monitor for abuse
- 5-6 clinics, weekly submissions = ~30 requests/week

**Post-Pilot (After validation):**
- Add Option 1 (Cloudflare rules) or Option 2 (Worker-based)
- Set conservative limits (100 req/10min per clinic)

**V2 (Patient-level):**
- Implement Option 3 (Durable Objects)
- Per-patient rate limits
- More granular controls

---

## Monitoring

**For pilot, monitor via:**
- Cloudflare Analytics dashboard
- Worker logs (check for unusual patterns)
- Weekly metric review (detect duplicate submissions)

**Red flags:**
- Same clinic submitting same week multiple times
- Submissions outside business hours
- Sudden spike in requests

---

## Emergency Response

**If abuse detected:**

1. **Pause clinic immediately:**
   ```bash
   wrangler d1 execute retentionhealth_v1 \
     --command "UPDATE clinics SET pilot_status='paused' WHERE id='clinic_id_here';" \
     --remote
   ```

2. **Review logs:**
   ```bash
   wrangler tail
   ```

3. **Contact clinic to verify legitimate use**

4. **Rotate API key if compromised**

---

## Conclusion

**For V1 pilot:** Rate limiting is optional but recommended post-launch.

**Priority:** Low (5-6 clinics, weekly cadence)

**Action:** Add Cloudflare rate limiting rule after first 2-3 weeks of pilot data collection.
