export interface Env {
  DB: D1Database;
  AUTH_SECRET: string; // used to sign tokens
  ADMIN_KEY: string;   // MVP admin auth for clinic dashboard access
}

/** ---------------------------
 *  Helpers: Response + Utils
 *  --------------------------*/
function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
      "access-control-allow-headers": "Content-Type, Authorization, x-admin-key, x-clinic-id",
    },
  });
}

function badRequest(message: string, details?: unknown): Response {
  return json({ ok: false, error: message, details }, 400);
}

function unauthorized(message = "Unauthorized"): Response {
  return json({ ok: false, error: message }, 401);
}

function notFound(): Response {
  return json({ ok: false, error: "Not Found" }, 404);
}

function base64UrlEncode(bytes: Uint8Array): string {
  let str = btoa(String.fromCharCode(...bytes));
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecodeToBytes(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacSha256(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return new Uint8Array(sig);
}

type TokenPayload =
  | { t: "patient"; clinic_id: string; seat_id: string; exp: number }
  | { t: "clinic"; clinic_id: string; exp: number };

async function signToken(env: Env, payload: TokenPayload): Promise<string> {
  const body = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sigBytes = await hmacSha256(env.AUTH_SECRET, body);
  const sig = base64UrlEncode(sigBytes);
  return `${body}.${sig}`;
}

async function verifyToken(env: Env, token: string): Promise<TokenPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = base64UrlEncode(await hmacSha256(env.AUTH_SECRET, body));
  if (sig !== expected) return null;

  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecodeToBytes(body))) as TokenPayload;
  if (!payload?.exp || Date.now() > payload.exp) return null;
  return payload;
}

function getAuthToken(req: Request): string | null {
  const h = req.headers.get("authorization");
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

function isoDateUTC(d = new Date()): string {
  // YYYY-MM-DD in UTC
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayOfWeekUTC(d = new Date()): number {
  // 0=Sunday..6=Saturday (UTC)
  return d.getUTCDay();
}

/** ----------------------------------------
 *  V1: Base 7-day behavior matrix (locked)
 *  ---------------------------------------*/
type PhaseKey = "SUPPRESSION_INIT" | "PEAK_SUPPRESSION" | "ADJUSTMENT" | "STABILIZATION";

const basePhaseByCycleDay: Record<number, { phase: PhaseKey; intensity: "moderate" | "high" | "controlled" }> = {
  0: { phase: "SUPPRESSION_INIT", intensity: "moderate" },
  1: { phase: "PEAK_SUPPRESSION", intensity: "high" },
  2: { phase: "PEAK_SUPPRESSION", intensity: "high" },
  3: { phase: "ADJUSTMENT", intensity: "moderate" },
  4: { phase: "ADJUSTMENT", intensity: "moderate" },
  5: { phase: "STABILIZATION", intensity: "controlled" },
  6: { phase: "STABILIZATION", intensity: "controlled" },
};

function baseCopy(cycleDay: number) {
  switch (cycleDay) {
    case 0:
      return {
        header: `Day 0 Post-Injection`,
        subtext: `Early appetite shifts may begin during this window.`,
        focus: ["Moderate portions", "Protein first", "Eat slowly", "Avoid heavy meals"],
      };
    case 1:
      return {
        header: `Day 1 Post-Injection`,
        subtext: `Appetite fluctuation is common during this phase.`,
        focus: ["Smaller, structured intake", "Protein priority", "Avoid high-fat foods", "Hydrate steadily"],
      };
    case 2:
      return {
        header: `Day 2 Post-Injection`,
        subtext: `Consistency reduces decision fatigue.`,
        focus: ["Maintain smaller portions", "Simple protein options", "Avoid heavy meals", "Hydrate consistently"],
      };
    case 3:
      return {
        header: `Day 3 Post-Injection`,
        subtext: `Appetite patterns may begin stabilizing.`,
        focus: ["Resume structured portions", "Maintain protein priority", "Avoid rebound overeating", "Maintain consistency"],
      };
    case 4:
      return {
        header: `Day 4 Post-Injection`,
        subtext: `Consistency supports behavioral continuity.`,
        focus: ["Balanced portions", "Protein first", "Avoid skipping meals", "Hydrate steadily"],
      };
    case 5:
      return {
        header: `Day 5 Post-Injection`,
        subtext: `Structured intake supports continuity.`,
        focus: ["Balanced meals", "Protein priority", "Avoid reactive eating", "Maintain steady intake"],
      };
    case 6:
    default:
      return {
        header: `Day 6 Post-Injection`,
        subtext: `Consistency reinforces structured eating patterns.`,
        focus: ["Maintain structured portions", "Protein first", "Avoid overcompensation", "Hydrate consistently"],
      };
  }
}

/** ---------------------------
 *  V1 Overrides (locked)
 *  - nausea wins
 *  - protein modifies within nausea constraints
 *  Protein scale: 0..2 (Low, Moderate, OnTarget)
 *  --------------------------*/
type NauseaLevel = 0 | 1 | 2 | 3;
type ProteinStatus = 0 | 1 | 2;

const proteinExamples = [
  "Greek yogurt",
  "Protein shake",
  "Egg whites",
  "Cottage cheese",
  "Soft tofu",
];

function applyNauseaOverride(nausea: NauseaLevel, base: { focus: string[] }) {
  // returns: additionalSections + focus override (if any)
  if (nausea === 0) return { focus: base.focus, protocol: null as null | { title: string; bullets: string[] }, safetyLine: null as null | string };

  if (nausea === 1) {
    return {
      focus: base.focus,
      protocol: {
        title: "Additional Guidance",
        bullets: ["Prioritize lighter protein sources", "Reduce portion size slightly", "Avoid greasy foods"],
      },
      safetyLine: null,
    };
  }

  if (nausea === 2) {
    const focus = base.focus.map((f) => (f.toLowerCase().includes("balanced") ? "Smaller, more frequent intake" : f));
    return {
      focus,
      protocol: {
        title: "Stabilization Protocol",
        bullets: ["Soft protein options", "Avoid high-fat meals", "Hydrate steadily", "Separate liquids from meals"],
      },
      safetyLine: null,
    };
  }

  // nausea === 3
  return {
    focus: [],
    protocol: {
      title: "Stabilization Protocol – High Discomfort",
      bullets: ["Soft or liquid protein only", "Very small intake", "Avoid fats entirely", "Sip fluids consistently", "Pause heavy meals"],
    },
    safetyLine: "If symptoms persist or worsen, contact your clinic.",
  };
}

function applyProteinModifier(protein: ProteinStatus) {
  if (protein === 2) {
    return { title: "Protein Continuity", bullets: ["Maintain protein-first structure today."] };
  }
  if (protein === 1) {
    return { title: "Protein Support", bullets: ["Increase protein at first intake", "Add a simple protein snack mid-day"] };
  }
  // protein === 0
  return {
    title: "Protein Priority",
    bullets: ["Start with protein early", "Choose easiest digestible options", "Keep portions small but consistent"],
  };
}

/** ---------------------------
 *  Template ID (B) = granular
 *  D{cycle}_N{n}_P{p}
 *  --------------------------*/
function templateId(cycleDay: number, nausea: number, protein: number): string {
  return `D${cycleDay}_N${nausea}_P${protein}`;
}

/** ---------------------------
 *  Cycle day calc
 *  injection_day is 0..6 (Sun..Sat)
 *  cycle_day = (todayDow - injection_day + 7) % 7
 *  --------------------------*/
function calculateCycleDay(injectionDay: number, now = new Date()): number {
  const today = dayOfWeekUTC(now); // 0..6
  return (today - injectionDay + 7) % 7;
}

/** ---------------------------
 *  Risk Engine (live on dashboard load)
 *  Rolling 7-day window
 *  Rules locked earlier
 *  --------------------------*/
type RiskFlag = "ENGAGEMENT_DROP" | "GI_INSTABILITY" | "LOW_PROTEIN" | "COMBINED_VOLATILITY";

function calculateEngagement(last7: Array<{ check_in_date: string }>): number {
  // engagement = check-in count / 7 * 100
  const count = last7.length;
  return (count / 7) * 100;
}

function toDate(s: string): Date {
  // s = YYYY-MM-DD (assume UTC)
  return new Date(`${s}T00:00:00.000Z`);
}

function dateAddDays(d: Date, days: number): Date {
  const x = new Date(d.getTime());
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

function sameISODate(d: Date): string {
  return isoDateUTC(d);
}

function computeConsecutiveMissedDays(last7Dates: string[], todayISO: string): number {
  // last7Dates are the check-in dates that exist (descending or any order)
  // We compute consecutive missed days counting back from todayISO.
  const set = new Set(last7Dates);
  let missed = 0;
  let cursor = toDate(todayISO);
  for (let i = 0; i < 7; i++) {
    const iso = sameISODate(cursor);
    if (set.has(iso)) break;
    missed++;
    cursor = dateAddDays(cursor, -1);
  }
  return missed;
}

function computeRiskFlags(
  last7Rows: Array<{ check_in_date: string; nausea_level: number; protein_status: number }>,
  todayISO: string
): { flags: RiskFlag[]; engagementRate: number; consecutiveMissedDays: number } {
  const flags: RiskFlag[] = [];
  const engagementRate = calculateEngagement(last7Rows);

  // consecutive missed
  const dates = last7Rows.map((r) => r.check_in_date);
  const consecutiveMissedDays = computeConsecutiveMissedDays(dates, todayISO);

  // Engagement flags
  if (consecutiveMissedDays >= 2) flags.push("ENGAGEMENT_DROP");

  // streak checks require ordering by date asc
  const asc = [...last7Rows].sort((a, b) => a.check_in_date.localeCompare(b.check_in_date));

  // Build consecutive streaks from asc list (only days with check-ins)
  let nauseaModStreak = 0; // nausea >=2 consecutive check-in days (not calendar days)
  let nauseaSevStreak = 0; // nausea ==3 consecutive check-in days
  let proteinLowStreak = 0; // protein ==0 consecutive check-in days
  let volatilityStreak = 0; // nausea>=2 AND protein<=1 consecutive check-in days

  // We evaluate consecutive submissions (V1). This matches engagement reality and avoids calendar-gap complexity.
  for (const r of asc) {
    if (r.nausea_level >= 2) nauseaModStreak++;
    else nauseaModStreak = 0;

    if (r.nausea_level === 3) nauseaSevStreak++;
    else nauseaSevStreak = 0;

    if (r.protein_status === 0) proteinLowStreak++;
    else proteinLowStreak = 0;

    const vol = r.nausea_level >= 2 && r.protein_status <= 1;
    if (vol) volatilityStreak++;
    else volatilityStreak = 0;
  }

  // GI
  if (nauseaSevStreak >= 2 || nauseaModStreak >= 2) flags.push("GI_INSTABILITY");

  // Protein
  if (proteinLowStreak >= 2) flags.push("LOW_PROTEIN");

  // Volatility is strongest
  if (volatilityStreak >= 2) flags.push("COMBINED_VOLATILITY");

  return { flags: Array.from(new Set(flags)), engagementRate, consecutiveMissedDays };
}

function calculateRiskTier(flags: RiskFlag[], engagementRate: number, consecutiveMissedDays: number): "STABLE" | "MONITOR" | "ELEVATED" {
  if (flags.includes("COMBINED_VOLATILITY")) return "ELEVATED";
  if (consecutiveMissedDays >= 3) return "ELEVATED";
  if (engagementRate < 60) return "ELEVATED";

  if (flags.length === 0 && engagementRate >= 80) return "STABLE";
  if (flags.length >= 2) return "ELEVATED";
  if (engagementRate >= 60 && engagementRate < 80) return "MONITOR";
  if (flags.length === 1) return "MONITOR";

  // fallback
  return "MONITOR";
}

/** ---------------------------
 *  DB helpers
 *  --------------------------*/
async function getSeatByExternal(env: Env, clinicId: string, externalId: string) {
  const stmt = env.DB.prepare(
    `SELECT id, clinic_id, patient_external_id, injection_day, active
     FROM seats
     WHERE clinic_id = ? AND patient_external_id = ? AND active = 1
     LIMIT 1`
  ).bind(clinicId, externalId);

  const row = await stmt.first();
  return row as null | { id: string; clinic_id: string; patient_external_id: string; injection_day: number; active: number };
}

async function clinicExists(env: Env, clinicId: string) {
  const row = await env.DB.prepare(`SELECT id FROM clinics WHERE id = ? LIMIT 1`).bind(clinicId).first();
  return !!row;
}

/** ---------------------------
 *  Routes
 *  --------------------------*/
async function routePatientLogin(req: Request, env: Env): Promise<Response> {
  const body = await req.json().catch(() => null) as null | { clinic_id?: string; patient_external_id?: string };
  if (!body?.clinic_id || !body?.patient_external_id) return badRequest("clinic_id and patient_external_id required");

  const clinicId = body.clinic_id.trim();
  const extId = body.patient_external_id.trim();

  if (!(await clinicExists(env, clinicId))) return badRequest("Invalid clinic_id");

  const seat = await getSeatByExternal(env, clinicId, extId);
  if (!seat) return badRequest("Invalid patient_external_id for clinic");

  const exp = Date.now() + 1000 * 60 * 60 * 24 * 14; // 14 days
  const token = await signToken(env, { t: "patient", clinic_id: clinicId, seat_id: seat.id, exp });

  return json({
    ok: true,
    token,
    seat_id: seat.id,
    clinic_id: clinicId,
  });
}

async function routeClinicLogin(req: Request, env: Env): Promise<Response> {
  const body = await req.json().catch(() => null) as null | { clinic_id?: string; admin_key?: string };
  if (!body?.clinic_id || !body?.admin_key) return badRequest("clinic_id and admin_key required");

  if (body.admin_key !== env.ADMIN_KEY) return unauthorized("Invalid admin key");
  if (!(await clinicExists(env, body.clinic_id))) return badRequest("Invalid clinic_id");

  const exp = Date.now() + 1000 * 60 * 60 * 12; // 12 hours
  const token = await signToken(env, { t: "clinic", clinic_id: body.clinic_id, exp });

  return json({ ok: true, token, clinic_id: body.clinic_id });
}

async function routePatientDailyOutput(req: Request, env: Env): Promise<Response> {
  const token = getAuthToken(req);
  if (!token) return unauthorized();
  const payload = await verifyToken(env, token);
  if (!payload || payload.t !== "patient") return unauthorized();

  // get seat injection_day
  const seat = await env.DB.prepare(
    `SELECT id, clinic_id, injection_day FROM seats WHERE id = ? AND clinic_id = ? AND active = 1 LIMIT 1`
  ).bind(payload.seat_id, payload.clinic_id).first() as null | { id: string; clinic_id: string; injection_day: number };

  if (!seat) return unauthorized("Seat not found");

  const cycleDay = calculateCycleDay(seat.injection_day, new Date());
  const base = baseCopy(cycleDay);

  // If patient already checked in today, we can show the computed output from stored nausea/protein (latest row)
  const today = isoDateUTC(new Date());
  const existing = await env.DB.prepare(
    `SELECT nausea_level, protein_status FROM check_ins
     WHERE clinic_id = ? AND seat_id = ? AND check_in_date = ?
     LIMIT 1`
  ).bind(payload.clinic_id, payload.seat_id, today).first() as null | { nausea_level: number; protein_status: number };

  // If no check-in yet, return base context and tell UI to ask screens 1 & 2
  if (!existing) {
    return json({
      ok: true,
      mode: "PRE_CHECKIN",
      clinic_id: payload.clinic_id,
      seat_id: payload.seat_id,
      date: today,
      cycle_day: cycleDay,
      phase: basePhaseByCycleDay[cycleDay].phase,
      header: base.header,
      subtext: base.subtext,
      focus: base.focus,
      context_line: `You are in Day ${cycleDay} post-injection. Appetite fluctuation is common during this window.`,
      protein_examples: proteinExamples,
    });
  }

  const nausea = Math.max(0, Math.min(3, existing.nausea_level)) as NauseaLevel;
  const protein = Math.max(0, Math.min(2, existing.protein_status)) as ProteinStatus;

  const nauseaLayer = applyNauseaOverride(nausea, base);
  const proteinLayer = applyProteinModifier(protein);

  return json({
    ok: true,
    mode: "POST_CHECKIN",
    clinic_id: payload.clinic_id,
    seat_id: payload.seat_id,
    date: today,
    cycle_day: cycleDay,
    phase: basePhaseByCycleDay[cycleDay].phase,
    guidance_template_id: templateId(cycleDay, nausea, protein),
    header: base.header,
    subtext: base.subtext,
    focus: nauseaLayer.focus.length ? nauseaLayer.focus : base.focus, // if nausea=3, focus suppressed
    nausea_protocol: nauseaLayer.protocol,
    safety_line: nauseaLayer.safetyLine,
    protein_modifier: proteinLayer,
    protein_examples: proteinExamples,
    context_line: `You are in Day ${cycleDay} post-injection. Appetite fluctuation is common during this window.`,
    encouragement: `Quick check-ins help keep this week steady.`,
  });
}

async function routePatientCheckin(req: Request, env: Env): Promise<Response> {
  const token = getAuthToken(req);
  if (!token) return unauthorized();
  const payload = await verifyToken(env, token);
  if (!payload || payload.t !== "patient") return unauthorized();

  const body = await req.json().catch(() => null) as null | { nausea_level?: number; protein_status?: number };
  if (body == null) return badRequest("Invalid JSON body");

  const nausea = Number(body.nausea_level);
  const protein = Number(body.protein_status);

  if (!Number.isInteger(nausea) || nausea < 0 || nausea > 3) return badRequest("nausea_level must be integer 0..3");
  if (!Number.isInteger(protein) || protein < 0 || protein > 2) return badRequest("protein_status must be integer 0..2");

  // fetch injection_day to compute cycle_day
  const seat = await env.DB.prepare(
    `SELECT id, clinic_id, injection_day, first_check_in_at FROM seats
     WHERE id = ? AND clinic_id = ? AND active = 1 LIMIT 1`
  ).bind(payload.seat_id, payload.clinic_id).first() as null | { id: string; clinic_id: string; injection_day: number; first_check_in_at: string | null };

  if (!seat) return unauthorized("Seat not found");

  const now = new Date();
  const today = isoDateUTC(now);
  const cycleDay = calculateCycleDay(seat.injection_day, now);

  // insert check-in (id can be deterministic-ish)
  const id = crypto.randomUUID();
  try {
    await env.DB.prepare(
      `INSERT INTO check_ins (id, clinic_id, seat_id, check_in_date, cycle_day, nausea_level, protein_status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, payload.clinic_id, payload.seat_id, today, cycleDay, nausea, protein).run();
  } catch (e: any) {
    // if unique constraint hit (already checked in today), update instead (idempotent)
    await env.DB.prepare(
      `UPDATE check_ins
       SET nausea_level = ?, protein_status = ?, cycle_day = ?, created_at = CURRENT_TIMESTAMP
       WHERE clinic_id = ? AND seat_id = ? AND check_in_date = ?`
    ).bind(nausea, protein, cycleDay, payload.clinic_id, payload.seat_id, today).run();
  }

  // set first_check_in_at if null
  if (!seat.first_check_in_at) {
    await env.DB.prepare(
      `UPDATE seats SET first_check_in_at = CURRENT_TIMESTAMP WHERE id = ? AND clinic_id = ?`
    ).bind(payload.seat_id, payload.clinic_id).run();
  }

  return json({ ok: true, seat_id: payload.seat_id, clinic_id: payload.clinic_id, date: today, cycle_day: cycleDay });
}

/** ---------------------------
 *  Clinic Dashboard: live risk summary
 *  - MVP auth: clinic token OR ADMIN_KEY header
 *  --------------------------*/
async function requireClinicAuth(req: Request, env: Env): Promise<{ clinic_id: string } | Response> {
  // Option 1: Bearer token clinic
  const token = getAuthToken(req);
  if (token) {
    const payload = await verifyToken(env, token);
    if (payload && payload.t === "clinic") return { clinic_id: payload.clinic_id };
  }

  // Option 2: Admin key header (MVP)
  const adminKey = req.headers.get("x-admin-key");
  const clinicId = req.headers.get("x-clinic-id");
  if (adminKey && clinicId && adminKey === env.ADMIN_KEY) {
    if (await clinicExists(env, clinicId)) return { clinic_id: clinicId };
  }

  return unauthorized();
}

async function routeClinicDashboardSummary(req: Request, env: Env): Promise<Response> {
  const auth = await requireClinicAuth(req, env);
  if (auth instanceof Response) return auth;
  const clinicId = auth.clinic_id;

  // list active seats
  const seats = await env.DB.prepare(
    `SELECT id AS seat_id, patient_external_id, injection_day
     FROM seats
     WHERE clinic_id = ? AND active = 1`
  ).bind(clinicId).all();

  const seatRows = (seats.results || []) as Array<{ seat_id: string; patient_external_id: string; injection_day: number }>;

  const today = isoDateUTC(new Date());
  const from = isoDateUTC(dateAddDays(toDate(today), -6)); // 7-day window inclusive

  // Pull all checkins for clinic in last 7 days, group in-memory by seat_id
  const checkinsAll = await env.DB.prepare(
    `SELECT seat_id, check_in_date, nausea_level, protein_status
     FROM check_ins
     WHERE clinic_id = ? AND check_in_date >= ?
     ORDER BY check_in_date ASC`
  ).bind(clinicId, from).all();

  const grouped = new Map<string, Array<{ check_in_date: string; nausea_level: number; protein_status: number }>>();
  for (const r of (checkinsAll.results || []) as any[]) {
    const arr = grouped.get(r.seat_id) || [];
    arr.push({ check_in_date: r.check_in_date, nausea_level: r.nausea_level, protein_status: r.protein_status });
    grouped.set(r.seat_id, arr);
  }

  // compute per-seat risk live
  const perSeat = seatRows.map((s) => {
    const last7 = grouped.get(s.seat_id) || [];
    const { flags, engagementRate, consecutiveMissedDays } = computeRiskFlags(last7, today);
    const tier = calculateRiskTier(flags, engagementRate, consecutiveMissedDays);

    // lightweight trends (last value)
    const last = last7.length ? last7[last7.length - 1] : null;

    return {
      seat_id: s.seat_id,
      patient_external_id: s.patient_external_id,
      injection_day: s.injection_day,
      last_check_in_date: last ? last.check_in_date : null,
      last_nausea: last ? last.nausea_level : null,
      last_protein: last ? last.protein_status : null,
      engagement_rate: Math.round(engagementRate),
      consecutive_missed_days: consecutiveMissedDays,
      flags,
      risk_tier: tier,
    };
  });

  // summary counts
  const counts = perSeat.reduce(
    (acc, s) => {
      acc.total++;
      acc[s.risk_tier]++;
      return acc;
    },
    { total: 0, STABLE: 0, MONITOR: 0, ELEVATED: 0 } as any
  );

  return json({
    ok: true,
    clinic_id: clinicId,
    window: { from, to: today },
    counts,
    seats: perSeat,
  });
}

/** ---------------------------
 *  Router
 *  --------------------------*/
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method.toUpperCase();

    // Handle CORS preflight requests
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
          "access-control-allow-headers": "Content-Type, Authorization, x-admin-key, x-clinic-id",
          "access-control-max-age": "86400",
        },
      });
    }

    // Health checks
    if (path === "/health" || path === "/api/health") return json({ ok: true });

    // Patient auth + flow
    if (path === "/api/patient/login" && method === "POST") return routePatientLogin(req, env);
    if (path === "/api/patient/checkin" && method === "POST") return routePatientCheckin(req, env);
    if (path === "/api/patient/daily-output" && method === "GET") return routePatientDailyOutput(req, env);

    // Clinic auth + dashboard
    if (path === "/api/clinic/login" && method === "POST") return routeClinicLogin(req, env);
    if (path === "/api/clinic/dashboard/summary" && method === "GET") return routeClinicDashboardSummary(req, env);

    return notFound();
  },
};
