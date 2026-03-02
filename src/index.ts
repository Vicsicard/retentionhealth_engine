// ============================================================================
// RETENTION HEALTH V1 - COHORT-ONLY ENGINE
// ============================================================================
// No PHI storage - aggregated cohort metrics only
// No BAA required for V1 pilot
// ============================================================================

export interface Env {
  DB: D1Database;
  ADMIN_KEY: string;
}

// ============================================================================
// HELPERS
// ============================================================================

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "Content-Type, x-admin-key, x-clinic-id, x-clinic-key",
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

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function generateApiKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function signJWT(payload: any, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');
  const data = `${encodedHeader}.${encodedPayload}`;
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );
  
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return `${data}.${encodedSignature}`;
}

async function verifyJWT(token: string, secret: string): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signature = Uint8Array.from(
      atob(encodedSignature.replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0)
    );
    
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      encoder.encode(data)
    );
    
    if (!valid) return null;
    
    const payload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check expiration
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateMetricPayload(data: any): { valid: boolean; error?: string } {
  // Required fields
  if (!data.cohort_label || !['Baseline', 'Stabilization'].includes(data.cohort_label)) {
    return { valid: false, error: 'cohort_label must be "Baseline" or "Stabilization"' };
  }

  if (typeof data.week_number !== 'number' || data.week_number < 1 || data.week_number > 12) {
    return { valid: false, error: 'week_number must be between 1 and 12' };
  }

  if (typeof data.patient_count !== 'number' || data.patient_count < 10) {
    return { valid: false, error: 'patient_count must be >= 10 (minimum cohort size)' };
  }

  if (typeof data.engagement_count !== 'number' || data.engagement_count < 0) {
    return { valid: false, error: 'engagement_count must be >= 0' };
  }

  if (data.engagement_count > data.patient_count) {
    return { valid: false, error: 'engagement_count cannot exceed patient_count' };
  }

  if (typeof data.volatility_events !== 'number' || data.volatility_events < 0) {
    return { valid: false, error: 'volatility_events must be >= 0' };
  }

  // Optional fields
  if (data.avg_refill_delta_days !== undefined && typeof data.avg_refill_delta_days !== 'number') {
    return { valid: false, error: 'avg_refill_delta_days must be a number' };
  }

  if (data.dropoff_count !== undefined && typeof data.dropoff_count !== 'number') {
    return { valid: false, error: 'dropoff_count must be a number' };
  }

  // Block any suspicious fields that might contain PHI
  const suspiciousFields = ['name', 'email', 'phone', 'patient_id', 'mrn', 'patient_external_id'];
  for (const field of suspiciousFields) {
    if (field in data) {
      return { valid: false, error: `Field "${field}" not allowed - no patient identifiers permitted` };
    }
  }

  return { valid: true };
}

// ============================================================================
// ROUTES
// ============================================================================

async function handleCORS(request: Request): Promise<Response | null> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-admin-key, x-clinic-id, x-clinic-key',
      },
    });
  }
  return null;
}

function verifyAdminKey(request: Request, env: Env): boolean {
  const adminKey = request.headers.get('x-admin-key');
  return adminKey === env.ADMIN_KEY;
}

function getClinicId(request: Request): string | null {
  return request.headers.get('x-clinic-id');
}

function getClinicKey(request: Request): string | null {
  return request.headers.get('x-clinic-key');
}

async function verifyClinicCredentials(request: Request, env: Env): Promise<{ valid: boolean; clinicId?: string; error?: string }> {
  const clinicId = getClinicId(request);
  const clinicKey = getClinicKey(request);

  if (!clinicId || !clinicKey) {
    return { valid: false };
  }

  const clinic = await env.DB.prepare(
    'SELECT api_key, pilot_status FROM clinics WHERE id = ? LIMIT 1'
  ).bind(clinicId).first() as any;

  if (!clinic || clinic.api_key !== clinicKey) {
    return { valid: false };
  }

  if (clinic.pilot_status !== 'active') {
    return { valid: false, error: 'Clinic is not active' };
  }

  return { valid: true, clinicId };
}

// ============================================================================
// POST /api/clinic/metrics - Submit weekly metrics
// ============================================================================
async function routeSubmitMetrics(request: Request, env: Env): Promise<Response> {
  const auth = await verifyClinicCredentials(request, env);
  if (!auth.valid) {
    return auth.error 
      ? json({ ok: false, error: auth.error }, 403)
      : unauthorized('Invalid clinic credentials');
  }

  const clinicId = auth.clinicId!;

  const body = await request.json().catch(() => null);
  if (!body) {
    return badRequest('Invalid JSON body');
  }

  // Validate payload
  const validation = validateMetricPayload(body);
  if (!validation.valid) {
    return badRequest(validation.error!);
  }

  // Check if clinic exists
  const clinic = await env.DB.prepare(
    'SELECT id FROM clinics WHERE id = ? LIMIT 1'
  ).bind(clinicId).first();

  if (!clinic) {
    return badRequest('Clinic not found');
  }

  // Get or create cohort
  let cohort = await env.DB.prepare(
    'SELECT id, patient_count FROM cohorts WHERE clinic_id = ? AND cohort_label = ? LIMIT 1'
  ).bind(clinicId, body.cohort_label).first() as any;

  if (!cohort) {
    // Create cohort
    const cohortId = generateId('cohort');
    await env.DB.prepare(
      `INSERT INTO cohorts (id, clinic_id, cohort_label, start_date, patient_count)
       VALUES (?, ?, ?, date('now'), ?)`
    ).bind(cohortId, clinicId, body.cohort_label, body.patient_count).run();
    
    cohort = { id: cohortId, patient_count: body.patient_count };
  }

  // Insert or update weekly metric
  const metricId = generateId('wm');
  await env.DB.prepare(
    `INSERT INTO weekly_metrics 
     (id, cohort_id, week_number, engagement_count, volatility_event_count, avg_refill_delta_days, dropoff_count)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(cohort_id, week_number) DO UPDATE SET
       engagement_count = excluded.engagement_count,
       volatility_event_count = excluded.volatility_event_count,
       avg_refill_delta_days = excluded.avg_refill_delta_days,
       dropoff_count = excluded.dropoff_count,
       created_at = CURRENT_TIMESTAMP`
  ).bind(
    metricId,
    cohort.id,
    body.week_number,
    body.engagement_count,
    body.volatility_events,
    body.avg_refill_delta_days || null,
    body.dropoff_count || 0
  ).run();

  return json({
    ok: true,
    message: 'Metrics submitted successfully',
    cohort_id: cohort.id,
    week_number: body.week_number,
  });
}

// ============================================================================
// GET /api/clinic/dashboard - Get cohort comparison
// ============================================================================
async function routeGetDashboard(request: Request, env: Env): Promise<Response> {
  const auth = await verifyClinicCredentials(request, env);
  if (!auth.valid) {
    return auth.error 
      ? json({ ok: false, error: auth.error }, 403)
      : unauthorized('Invalid clinic credentials');
  }

  const clinicId = auth.clinicId!;

  // Get clinic info
  const clinic = await env.DB.prepare(
    'SELECT id, name, pilot_status FROM clinics WHERE id = ? LIMIT 1'
  ).bind(clinicId).first();

  if (!clinic) {
    return badRequest('Clinic not found');
  }

  // Get cohorts
  const cohorts = await env.DB.prepare(
    'SELECT id, cohort_label, start_date, patient_count FROM cohorts WHERE clinic_id = ?'
  ).bind(clinicId).all();

  if (!cohorts.results || cohorts.results.length === 0) {
    return json({
      ok: true,
      clinic,
      cohorts: [],
      message: 'No cohorts found. Submit metrics to create cohorts.',
    });
  }

  // Get metrics for each cohort
  const cohortsWithMetrics = await Promise.all(
    cohorts.results.map(async (cohort: any) => {
      const metrics = await env.DB.prepare(
        `SELECT week_number, engagement_count, volatility_event_count, 
                avg_refill_delta_days, dropoff_count
         FROM weekly_metrics
         WHERE cohort_id = ?
         ORDER BY week_number ASC`
      ).bind(cohort.id).all();

      // Calculate aggregated stats
      const totalEngagement = metrics.results.reduce((sum: number, m: any) => sum + m.engagement_count, 0);
      const totalVolatility = metrics.results.reduce((sum: number, m: any) => sum + m.volatility_event_count, 0);
      const totalDropoff = metrics.results.reduce((sum: number, m: any) => sum + (m.dropoff_count || 0), 0);
      const avgRefillDeltas = metrics.results.filter((m: any) => m.avg_refill_delta_days !== null);
      const avgRefillDelta = avgRefillDeltas.length > 0
        ? avgRefillDeltas.reduce((sum: number, m: any) => sum + m.avg_refill_delta_days, 0) / avgRefillDeltas.length
        : null;

      return {
        cohort_label: cohort.cohort_label,
        patient_count: cohort.patient_count,
        start_date: cohort.start_date,
        weeks_tracked: metrics.results.length,
        engagement_rate: totalEngagement / (cohort.patient_count * metrics.results.length) * 100,
        volatility_rate: totalVolatility / cohort.patient_count * 100,
        avg_refill_delta_days: avgRefillDelta,
        dropoff_count: totalDropoff,
        dropoff_rate: (totalDropoff / cohort.patient_count) * 100,
        weekly_data: metrics.results,
      };
    })
  );

  // Calculate deltas if both cohorts exist
  const baseline = cohortsWithMetrics.find((c: any) => c.cohort_label === 'Baseline');
  const stabilization = cohortsWithMetrics.find((c: any) => c.cohort_label === 'Stabilization');

  let comparison = null;
  if (baseline && stabilization) {
    comparison = {
      engagement_delta: stabilization.engagement_rate - baseline.engagement_rate,
      volatility_delta: stabilization.volatility_rate - baseline.volatility_rate,
      refill_delta: stabilization.avg_refill_delta_days && baseline.avg_refill_delta_days
        ? stabilization.avg_refill_delta_days - baseline.avg_refill_delta_days
        : null,
      dropoff_delta: stabilization.dropoff_rate - baseline.dropoff_rate,
    };
  }

  return json({
    ok: true,
    clinic,
    cohorts: cohortsWithMetrics,
    comparison,
  });
}

// ============================================================================
// POST /api/pilot/signup - Clinic pilot signup (creates pending clinic)
// ============================================================================
async function routePilotSignup(request: Request, env: Env): Promise<Response> {
  const body = await request.json().catch(() => null) as any;
  
  if (!body?.clinic_name || !body?.contact_name || !body?.email) {
    return badRequest('clinic_name, contact_name, and email are required');
  }
  
  // Check capacity
  const activeCount = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM clinics WHERE pilot_status = "active"'
  ).first() as any;
  
  if (activeCount && activeCount.count >= 6) {
    return json({
      ok: false,
      error: 'Pilot capacity reached. We are currently full.',
    }, 403);
  }
  
  const clinicId = generateId('clinic');
  
  await env.DB.prepare(
    'INSERT INTO clinics (id, name, contact_name, email, phone, patient_count_range, pilot_status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    clinicId,
    body.clinic_name,
    body.contact_name,
    body.email,
    body.phone || null,
    body.patient_count_range || null,
    'pending'
  ).run();
  
  return json({
    ok: true,
    clinic_id: clinicId,
    message: 'Application received. We\'ll contact you within 24 hours.',
  });
}

// ============================================================================
// POST /api/admin/approve-clinic - Approve pending clinic and generate credentials
// ============================================================================
async function routeApproveClinic(request: Request, env: Env): Promise<Response> {
  if (!verifyAdminKey(request, env)) {
    return unauthorized('Invalid admin key');
  }
  
  const body = await request.json().catch(() => null) as any;
  if (!body?.clinic_id) {
    return badRequest('clinic_id required');
  }
  
  // Get clinic
  const clinic = await env.DB.prepare(
    'SELECT id, name, pilot_status FROM clinics WHERE id = ? LIMIT 1'
  ).bind(body.clinic_id).first() as any;
  
  if (!clinic) {
    return badRequest('Clinic not found');
  }
  
  if (clinic.pilot_status !== 'pending') {
    return badRequest(`Clinic is already ${clinic.pilot_status}`);
  }
  
  // Generate credentials
  const apiKey = generateApiKey();
  const pilotStartDate = new Date().toISOString().split('T')[0];
  
  // Generate 90-day magic token
  const magicPayload = {
    clinic_id: body.clinic_id,
    type: 'magic_login',
    exp: Date.now() + (90 * 24 * 60 * 60 * 1000), // 90 days
  };
  const magicToken = await signJWT(magicPayload, env.ADMIN_KEY);
  
  // Update clinic
  await env.DB.prepare(
    'UPDATE clinics SET api_key = ?, magic_token = ?, pilot_status = ?, pilot_start_date = ? WHERE id = ?'
  ).bind(apiKey, magicToken, 'active', pilotStartDate, body.clinic_id).run();
  
  const magicLink = `https://retentionhealth.com/clinic/login?token=${magicToken}`;
  
  return json({
    ok: true,
    clinic_id: body.clinic_id,
    clinic_name: clinic.name,
    api_key: apiKey,
    magic_link: magicLink,
    pilot_start_date: pilotStartDate,
  });
}

// ============================================================================
// POST /api/clinic/magic-login - Validate magic token and return session token
// ============================================================================
async function routeMagicLogin(request: Request, env: Env): Promise<Response> {
  const body = await request.json().catch(() => null) as any;
  if (!body?.token) {
    return badRequest('token required');
  }
  
  // Verify JWT
  const payload = await verifyJWT(body.token, env.ADMIN_KEY);
  if (!payload || payload.type !== 'magic_login') {
    return unauthorized('Invalid or expired token');
  }
  
  // Verify clinic is active
  const clinic = await env.DB.prepare(
    'SELECT id, name, pilot_status FROM clinics WHERE id = ? LIMIT 1'
  ).bind(payload.clinic_id).first() as any;
  
  if (!clinic || clinic.pilot_status !== 'active') {
    return unauthorized('Clinic not found or not active');
  }
  
  // Generate short-lived session token (2 hours)
  const sessionPayload = {
    clinic_id: payload.clinic_id,
    type: 'session',
    exp: Date.now() + (2 * 60 * 60 * 1000), // 2 hours
  };
  const sessionToken = await signJWT(sessionPayload, env.ADMIN_KEY);
  
  return json({
    ok: true,
    session_token: sessionToken,
    clinic_id: payload.clinic_id,
    clinic_name: clinic.name,
    expires_in: 7200,
  });
}

// ============================================================================
// GET /api/pilot/capacity - Check pilot capacity
// ============================================================================
async function routePilotCapacity(request: Request, env: Env): Promise<Response> {
  const activeCount = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM clinics WHERE pilot_status = "active"'
  ).first() as any;
  
  const count = activeCount?.count || 0;
  
  return json({
    ok: true,
    active_clinics: count,
    capacity: 6,
    accepting_signups: count < 6,
  });
}

// ============================================================================
// POST /api/admin/create-clinic - Create new clinic
// ============================================================================
async function routeCreateClinic(request: Request, env: Env): Promise<Response> {
  if (!verifyAdminKey(request, env)) {
    return unauthorized('Invalid admin key');
  }

  const body = await request.json().catch(() => null) as any;
  if (!body?.name) {
    return badRequest('Clinic name required');
  }

  const clinicId = generateId('clinic');
  const apiKey = generateApiKey();
  
  await env.DB.prepare(
    'INSERT INTO clinics (id, name, api_key, pilot_status) VALUES (?, ?, ?, ?)'
  ).bind(clinicId, body.name, apiKey, 'active').run();

  return json({
    ok: true,
    clinic_id: clinicId,
    clinic_api_key: apiKey,
    name: body.name,
  });
}

// ============================================================================
// MAIN HANDLER
// ============================================================================
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const corsResponse = await handleCORS(request);
    if (corsResponse) return corsResponse;

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // API Routes
      if (path === '/api/clinic/metrics' && request.method === 'POST') {
        return await routeSubmitMetrics(request, env);
      }

      if (path === '/api/clinic/dashboard' && request.method === 'GET') {
        return await routeGetDashboard(request, env);
      }

      if (path === '/api/admin/create-clinic' && request.method === 'POST') {
        return await routeCreateClinic(request, env);
      }

      if (path === '/api/pilot/signup' && request.method === 'POST') {
        return await routePilotSignup(request, env);
      }

      if (path === '/api/admin/approve-clinic' && request.method === 'POST') {
        return await routeApproveClinic(request, env);
      }

      if (path === '/api/clinic/magic-login' && request.method === 'POST') {
        return await routeMagicLogin(request, env);
      }

      if (path === '/api/pilot/capacity' && request.method === 'GET') {
        return await routePilotCapacity(request, env);
      }

      // Health check
      if (path === '/health') {
        return json({ ok: true, version: 'v1-cohort-only' });
      }

      return notFound();

    } catch (error) {
      console.error('Error:', error);
      return json({
        ok: false,
        error: 'Internal server error',
      }, 500);
    }
  },
};
