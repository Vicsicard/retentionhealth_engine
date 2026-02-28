# **RETENTION HEALTH V1 — FRONTEND ARCHITECTURE**

---

## **🔷 ARCHITECTURE OVERVIEW**

### **Base Domain (MVP)**
```
retentionhealth.com
```

### **Routes**
```
/                → Marketing landing
/patient         → Patient login
/patient/app     → Patient 3-screen flow

/clinic          → Clinic login
/clinic/app      → Clinic dashboard
```

### **Future Migration Path**
```
clinicname.retentionhealth.com
```
Internal app structure remains unchanged. Only routing configuration changes.

---

## **🔷 TECH STACK**

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Fetching:** React Query (optional but recommended)
- **Auth Storage:** LocalStorage (MVP)
- **Server-Side Auth:** None (client-side MVP)

---

## **🔷 PROJECT STRUCTURE**

```
/app
  layout.tsx
  page.tsx                      # Marketing landing

  /patient
    page.tsx                    # Patient login
    /app
      layout.tsx
      page.tsx                  # Main flow container
      /components
        NauseaScreen.tsx
        ProteinScreen.tsx
        SummaryScreen.tsx
        ProgressMeter.tsx

  /clinic
    page.tsx                    # Clinic login
    /app
      layout.tsx
      page.tsx                  # Dashboard container
      /components
        StatsBar.tsx
        SeatTable.tsx
        RiskBadge.tsx
        SeatDrawer.tsx

/lib
  api.ts                        # Fetch wrapper
  auth.ts                       # Token helpers
  types.ts                      # Shared API types

/styles
  globals.css
```

---

## **🔷 SHARED UTILITIES**

### **`/lib/api.ts`** - API Fetch Wrapper

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {})
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "API error");
  }

  return res.json();
}
```

### **`/lib/auth.ts`** - Token Helpers

```typescript
export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function clearToken() {
  localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
```

### **`/lib/types.ts`** - Shared Types

```typescript
export type RiskTier = "STABLE" | "MONITOR" | "ELEVATED";
export type RiskFlag = "ENGAGEMENT_DROP" | "GI_INSTABILITY" | "LOW_PROTEIN" | "COMBINED_VOLATILITY";

export interface DailyOutputPreCheckin {
  ok: true;
  mode: "PRE_CHECKIN";
  clinic_id: string;
  seat_id: string;
  date: string;
  cycle_day: number;
  phase: string;
  header: string;
  subtext: string;
  focus: string[];
  context_line: string;
  protein_examples: string[];
}

export interface DailyOutputPostCheckin {
  ok: true;
  mode: "POST_CHECKIN";
  clinic_id: string;
  seat_id: string;
  date: string;
  cycle_day: number;
  phase: string;
  guidance_template_id: string;
  header: string;
  subtext: string;
  focus: string[];
  nausea_protocol: { title: string; bullets: string[] } | null;
  safety_line: string | null;
  protein_modifier: { title: string; bullets: string[] };
  protein_examples: string[];
  context_line: string;
  encouragement: string;
}

export interface DashboardSeat {
  seat_id: string;
  patient_external_id: string;
  injection_day: number;
  last_check_in_date: string | null;
  last_nausea: number | null;
  last_protein: number | null;
  engagement_rate: number;
  consecutive_missed_days: number;
  flags: RiskFlag[];
  risk_tier: RiskTier;
}

export interface DashboardSummary {
  ok: true;
  clinic_id: string;
  window: { from: string; to: string };
  counts: {
    total: number;
    STABLE: number;
    MONITOR: number;
    ELEVATED: number;
  };
  seats: DashboardSeat[];
}
```

---

## **🔷 PATIENT PORTAL**

### **`/app/patient/page.tsx`** - Login

```typescript
"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function PatientLogin() {
  const [clinicId, setClinicId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    setError("");
    
    try {
      const data = await apiFetch("/api/patient/login", {
        method: "POST",
        body: JSON.stringify({
          clinic_id: clinicId,
          patient_external_id: patientId
        })
      });

      localStorage.setItem("token", data.token);
      router.push("/patient/app");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-gray-50">
      <div className="max-w-md mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-6">Patient Login</h1>
        
        <input
          className="input"
          placeholder="Clinic ID"
          value={clinicId}
          onChange={(e) => setClinicId(e.target.value)}
        />
        
        <input
          className="input mt-3"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        
        {error && (
          <div className="mt-3 text-red-600 text-sm">{error}</div>
        )}
        
        <button 
          className="btn-primary mt-6" 
          onClick={handleLogin}
          disabled={loading || !clinicId || !patientId}
        >
          {loading ? "Loading..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
```

### **`/app/patient/app/page.tsx`** - Main Flow

```typescript
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import NauseaScreen from "./components/NauseaScreen";
import ProteinScreen from "./components/ProteinScreen";
import SummaryScreen from "./components/SummaryScreen";

export default function PatientApp() {
  const [mode, setMode] = useState<"loading" | "pre" | "post">("loading");
  const [data, setData] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [nauseaLevel, setNauseaLevel] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await apiFetch("/api/patient/daily-output");
    setData(res);
    setMode(res.mode === "PRE_CHECKIN" ? "pre" : "post");
  }

  async function handleProteinSubmit(proteinStatus: number) {
    await apiFetch("/api/patient/checkin", {
      method: "POST",
      body: JSON.stringify({
        nausea_level: nauseaLevel,
        protein_status: proteinStatus
      })
    });
    await load();
  }

  if (mode === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (mode === "post") {
    return <SummaryScreen data={data} reload={load} />;
  }

  // PRE_CHECKIN flow
  if (step === 1) {
    return (
      <NauseaScreen 
        onNext={(level) => {
          setNauseaLevel(level);
          setStep(2);
        }} 
      />
    );
  }

  if (step === 2) {
    return <ProteinScreen onSubmit={handleProteinSubmit} />;
  }

  return null;
}
```

### **Patient Components**

**`/app/patient/app/components/NauseaScreen.tsx`**

```typescript
"use client";

interface Props {
  onNext: (level: number) => void;
}

export default function NauseaScreen({ onNext }: Props) {
  const options = [
    { value: 0, label: "None", desc: "No nausea" },
    { value: 1, label: "Mild", desc: "Slight discomfort" },
    { value: 2, label: "Moderate", desc: "Noticeable discomfort" },
    { value: 3, label: "Severe", desc: "Significant discomfort" }
  ];

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-50">
      <div className="max-w-md mx-auto w-full">
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-2">Step 1 of 2</div>
          <h1 className="text-2xl font-semibold">How was nausea in the last 24 hours?</h1>
        </div>

        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onNext(opt.value)}
              className="w-full p-4 border-2 rounded-lg text-left hover:border-black transition"
            >
              <div className="font-medium">{opt.label}</div>
              <div className="text-sm text-gray-600">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**`/app/patient/app/components/ProteinScreen.tsx`**

```typescript
"use client";

import { useState } from "react";

interface Props {
  onSubmit: (status: number) => Promise<void>;
}

export default function ProteinScreen({ onSubmit }: Props) {
  const [loading, setLoading] = useState(false);

  const options = [
    { value: 0, label: "Low", desc: "Below target" },
    { value: 1, label: "Moderate", desc: "Close to target" },
    { value: 2, label: "On Target", desc: "Met protein goal" }
  ];

  async function handleSelect(value: number) {
    setLoading(true);
    await onSubmit(value);
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-50">
      <div className="max-w-md mx-auto w-full">
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-2">Step 2 of 2</div>
          <h1 className="text-2xl font-semibold">Did you hit your protein target yesterday?</h1>
        </div>

        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              disabled={loading}
              className="w-full p-4 border-2 rounded-lg text-left hover:border-black transition disabled:opacity-50"
            >
              <div className="font-medium">{opt.label}</div>
              <div className="text-sm text-gray-600">{opt.desc}</div>
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-6 text-center text-gray-600">Submitting...</div>
        )}
      </div>
    </div>
  );
}
```

**`/app/patient/app/components/SummaryScreen.tsx`**

```typescript
"use client";

import type { DailyOutputPostCheckin } from "@/lib/types";

interface Props {
  data: DailyOutputPostCheckin;
  reload: () => void;
}

export default function SummaryScreen({ data }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">{data.phase}</div>
          <h1 className="text-2xl font-semibold">{data.header}</h1>
          <p className="text-gray-600 mt-2">{data.subtext}</p>
        </div>

        {/* Today's Focus */}
        {data.focus.length > 0 && (
          <div className="bg-white rounded-lg p-6 mb-4">
            <h2 className="font-semibold mb-3">Today's Focus</h2>
            <ul className="space-y-2">
              {data.focus.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nausea Protocol */}
        {data.nausea_protocol && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
            <h2 className="font-semibold mb-3">{data.nausea_protocol.title}</h2>
            <ul className="space-y-2">
              {data.nausea_protocol.bullets.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safety Line */}
        {data.safety_line && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm">{data.safety_line}</p>
          </div>
        )}

        {/* Protein Modifier */}
        <div className="bg-white rounded-lg p-6 mb-4">
          <h2 className="font-semibold mb-3">{data.protein_modifier.title}</h2>
          <ul className="space-y-2">
            {data.protein_modifier.bullets.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Protein Examples */}
        <div className="bg-white rounded-lg p-6 mb-4">
          <h2 className="font-semibold mb-3">Protein Options</h2>
          <div className="flex flex-wrap gap-2">
            {data.protein_examples.map((item, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Context */}
        <div className="text-center text-sm text-gray-600 mt-6">
          {data.encouragement}
        </div>
      </div>
    </div>
  );
}
```

---

## **🔷 CLINIC PORTAL**

### **`/app/clinic/page.tsx`** - Login

```typescript
"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ClinicLogin() {
  const [clinicId, setClinicId] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function login() {
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/api/clinic/login", {
        method: "POST",
        body: JSON.stringify({
          clinic_id: clinicId,
          admin_key: adminKey
        })
      });

      localStorage.setItem("token", data.token);
      router.push("/clinic/app");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-gray-50">
      <div className="max-w-md mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-6">Clinic Login</h1>
        
        <input
          className="input"
          placeholder="Clinic ID"
          value={clinicId}
          onChange={(e) => setClinicId(e.target.value)}
        />
        
        <input
          className="input mt-3"
          type="password"
          placeholder="Admin Key"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
        />
        
        {error && (
          <div className="mt-3 text-red-600 text-sm">{error}</div>
        )}
        
        <button 
          className="btn-primary mt-6" 
          onClick={login}
          disabled={loading || !clinicId || !adminKey}
        >
          {loading ? "Loading..." : "Enter Dashboard"}
        </button>
      </div>
    </div>
  );
}
```

### **`/app/clinic/app/page.tsx`** - Dashboard

```typescript
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { DashboardSummary } from "@/lib/types";
import SeatTable from "./components/SeatTable";
import StatsBar from "./components/StatsBar";

export default function ClinicDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await apiFetch("/api/clinic/dashboard/summary");
    setData(res);
    setLoading(false);
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Patient Dashboard</h1>
        <StatsBar counts={data.counts} window={data.window} />
        <SeatTable seats={data.seats} />
      </div>
    </div>
  );
}
```

### **Clinic Components**

**`/app/clinic/app/components/StatsBar.tsx`**

```typescript
interface Props {
  counts: {
    total: number;
    STABLE: number;
    MONITOR: number;
    ELEVATED: number;
  };
  window: { from: string; to: string };
}

export default function StatsBar({ counts, window }: Props) {
  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="text-sm text-gray-500 mb-4">
        {window.from} to {window.to}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-2xl font-semibold">{counts.total}</div>
          <div className="text-sm text-gray-600">Total Seats</div>
        </div>
        
        <div>
          <div className="text-2xl font-semibold text-green-600">{counts.STABLE}</div>
          <div className="text-sm text-gray-600">Stable</div>
        </div>
        
        <div>
          <div className="text-2xl font-semibold text-yellow-600">{counts.MONITOR}</div>
          <div className="text-sm text-gray-600">Monitor</div>
        </div>
        
        <div>
          <div className="text-2xl font-semibold text-red-600">{counts.ELEVATED}</div>
          <div className="text-sm text-gray-600">Elevated Risk</div>
        </div>
      </div>
    </div>
  );
}
```

**`/app/clinic/app/components/SeatTable.tsx`**

```typescript
import type { DashboardSeat } from "@/lib/types";
import RiskBadge from "./RiskBadge";

interface Props {
  seats: DashboardSeat[];
}

export default function SeatTable({ seats }: Props) {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Check-In</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flags</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {seats.map((seat) => (
            <tr key={seat.seat_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm">{seat.patient_external_id}</td>
              <td className="px-6 py-4">
                <RiskBadge tier={seat.risk_tier} />
              </td>
              <td className="px-6 py-4 text-sm">{seat.engagement_rate}%</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {seat.last_check_in_date || "Never"}
              </td>
              <td className="px-6 py-4 text-sm">
                {seat.flags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {seat.flags.map((flag) => (
                      <span key={flag} className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {flag.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**`/app/clinic/app/components/RiskBadge.tsx`**

```typescript
import type { RiskTier } from "@/lib/types";

interface Props {
  tier: RiskTier;
}

export default function RiskBadge({ tier }: Props) {
  const styles = {
    STABLE: "bg-green-100 text-green-800",
    MONITOR: "bg-yellow-100 text-yellow-800",
    ELEVATED: "bg-red-100 text-red-800"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[tier]}`}>
      {tier}
    </span>
  );
}
```

---

## **🔷 GLOBAL STYLES**

**`/styles/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .input {
    @apply w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent;
  }

  .btn-primary {
    @apply w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed;
  }
}
```

---

## **🔷 ENVIRONMENT VARIABLES**

**`.env.local`**

```
NEXT_PUBLIC_API_BASE=https://your-worker-domain.workers.dev
```

---

## **🔷 MVP SECURITY NOTES**

### **Current Approach (MVP)**
- Client-side token storage (LocalStorage)
- Acceptable for pilot/demo
- Simple implementation

### **Production Migration Path**
- Migrate to HttpOnly cookies
- Add Next.js middleware for auth
- Server-side token validation
- CSRF protection

---

## **🔷 DEPLOYMENT CHECKLIST**

- [ ] Set `NEXT_PUBLIC_API_BASE` environment variable
- [ ] Deploy Next.js app (Vercel/Cloudflare Pages)
- [ ] Test patient login flow
- [ ] Test clinic dashboard
- [ ] Verify API integration
- [ ] Test on mobile devices (patient portal)
- [ ] Test on desktop (clinic dashboard)

---

**End of Frontend Architecture**
