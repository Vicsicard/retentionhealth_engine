# **🔷 RETENTION HEALTH — V1 SYSTEM OUTLINE**

---

# **I. PATIENT WEB APP (Mobile-First)**

Accessed via:

clinicname.retentionhealth.com  
 or  
 retentionhealth.com/clinicID

Clinic provides:

* Clinic\_ID

* Seat\_ID

No app download.  
 No personal account.

---

## **A. Login Flow**

Patient enters:

* Clinic\_ID

* Seat\_ID

System validates against DB.

Session token issued (stores clinic\_id \+ seat\_id).

Future access does NOT require re-entry daily.

---

# **II. DAILY PATIENT FLOW (7-Day Recurring Cycle)**

Exactly 3 screens.

Cycle resets every 7 days.

---

## **1️⃣ Screen 1 — Nausea Input**

Question:

“How was nausea in the last 24 hours?”

Options:

* None

* Mild

* Moderate

* Severe

Submit → Next

---

## **2️⃣ Screen 2 — Protein Input**

Question:

“Did you hit your protein target yesterday?”

Options:

* On Target

* Moderate

* Low

Submit → Generate Output

---

## **3️⃣ Screen 3 — Daily Stabilization Output**

Generated from:

* Injection Day offset (0–6)

* Nausea input

* Protein input

---

### **Output Structure**

### **A. Phase Context Header**

Example:

Day 2 Post-Injection  
 Peak Suppression Window

“Appetite fluctuation is common during this phase.”

---

### **B. Today’s Focus**

Protocol-driven bullet list (max 4 items)

---

### **C. Protein Suggestions (Static List)**

Max 5–6 options.

---

### **D. Support Foods (if nausea moderate/severe)**

Max 5 options.

---

### **E. Continuity Indicator**

“Check-in Day 5”

---

### **F. Stabilization Reinforcement Line**

“Consistency during this window supports program continuity.”

No weight talk.  
 No clinical claims.

---

# **III. RULE ENGINE (Backend — Cloudflare Worker)**

Inputs:

* Injection Day

* Current date

* Nausea level

* Protein status

Processing:

1. Calculate Cycle Day (0–6)

2. Assign Phase Window:

   * Day 0 \= Injection

   * Day 1–2 \= Peak Suppression

   * Day 3–4 \= Adjustment

   * Day 5–6 \= Stabilization

3. Apply Base Protocol

4. Apply Nausea Override (if moderate/severe)

5. Apply Protein Recovery (if low)

6. Assign:

   * Protocol\_Type\_ID

   * Guidance\_Template\_ID

   * Risk\_Flag (if triggered)

Output returned to patient screen.

All deterministic.

---

# **IV. DATA STORED (Per Check-In)**

Stored in clinic-partitioned DB:

Clinic\_ID  
 Seat\_ID  
 Date  
 Cycle\_Day  
 Nausea\_Level  
 Protein\_Status  
 Protocol\_Type  
 Guidance\_Template\_ID  
 Risk\_Flag  
 Timestamp

No PHI.  
 No medical data.

---

# **V. CLINIC DASHBOARD**

Accessed via:

clinicname.retentionhealth.com/admin

Authenticated access tied to clinic\_id.

BUT for mvp v1 we will keep the demo patient site and the clinic dash all sub path, we will add these prob to the main site for demo purpose only once first paid clinic we set them up as sub domian.

# **Why This Is Clean**

For MVP:

Perception doesn’t matter.  
 Speed does.

For Paid:

Perception matters.  
 Architecture matters.

You avoid:

Premature DevOps complexity.

---

# **🔷 Important: Build for Migration Now**

Even if you use subpaths initially:

Your internal routing must still be tenant-driven by:

clinic\_id

Not by URL parsing logic only.

So design it like this:

Extract clinic\_id from path  
 But internally treat it exactly like a subdomain-based tenant.

That way migration later is:

DNS change \+ routing config change  
 Not database rewrite.

---

## **A. Seat Management**

Clinic sees:

* Total subscribed seats

* Active seats (logged at least once in billing period)

* Seat utilization %

---

## **B. Daily Overview**

Program-level metrics:

* Daily Check-In Rate %

* % Moderate/Severe Nausea

* % Low Protein

* % Protocol Activations

* **Elevated Risk Seats**

---

## **C. Per-Seat View**

For each Seat\_ID:

* Check-in completion (0–7 days)

* Nausea counts

* Protein counts

* Protocol triggers

* Risk flag

* Guidance Template history

No patient names.  
 Seat\_ID only.

---

## **D. Weekly Patient Summary (Auto-Generated)**

For each Seat\_ID:

* Total check-ins (0–7)

* **Moderate/Severe nausea days**

* **Low protein days**

* **Protocol activations**

* Risk classification:

  * Low

  * Monitor

  * Elevated

Exportable CSV.

---

# **VI. BILLING MODEL**

Seat-based billing.

Active seat \= ≥1 check-in in billing period.

Stripe subscription tied to clinic\_id.

Dashboard displays:

* Subscribed seat count

* Active seat count

* Billing period summary

---

# **VII. SYSTEM ARCHITECTURE**

Cloudflare Pages:

* Patient UI

* Clinic Dashboard UI

Cloudflare Worker:

* Rule engine

* Auth layer

* API layer

* Tenant enforcement

Cloudflare D1:

* Single DB

* Strict clinic\_id partitioning

---

# **VIII. CORE VALUE LOOP**

Patient:  
 Daily 20-second ritual  
 → Structured guidance  
 → Reduced confusion  
 → Higher adherence

Clinic:  
 Visibility into instability  
 → Early intervention  
 → Reduced avoidable churn  
 → Revenue protection

