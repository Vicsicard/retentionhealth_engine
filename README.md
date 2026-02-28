# Retention Health V1 - GLP-1 Patient Retention Engine

A behavioral retention infrastructure system for GLP-1 medication adherence clinics.

## 🎯 Overview

Retention Health provides:
- **Patient Portal**: Mobile-first 3-screen daily check-in flow
- **Clinic Dashboard**: Real-time risk monitoring and engagement metrics
- **Rule Engine**: Deterministic 7-day behavior matrix with nausea/protein overrides
- **Risk Scoring**: Live calculation of patient retention risk (STABLE/MONITOR/ELEVATED)

## 🏗️ Architecture

```
Next.js Frontend → Cloudflare Worker (API + Engine) → Cloudflare D1 (SQLite)
```

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Cloudflare Worker with TypeScript
- **Database**: Cloudflare D1 (multi-tenant, PHI-free)
- **Auth**: JWT tokens (stateless)

## 🚀 Deployed Worker

**Live URL**: `https://retentionhealth-engine.vicsicard.workers.dev`

**Account ID**: `92961c9ccdd20e5a8ff4456fd7c9800d`

**Database**: `retentionhealth_v1` (c58bb0e6-9f19-49f4-8f59-6aa5702e4ba8)

## 📁 Project Structure

```
/
├── src/
│   └── index.ts              # Cloudflare Worker (API + Rule Engine)
├── schema.sql                # Database schema
├── seed.sql                  # Demo data (10 test seats)
├── wrangler.toml             # Cloudflare configuration
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── API.md                    # API documentation
├── FRONTEND.md               # Next.js architecture guide
└── README.md                 # This file
```

## 🔧 Setup & Deployment

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI

### Installation

```bash
npm install
```

### Local Development

```bash
# Run Worker locally
npm run dev

# Execute SQL on local D1
npx wrangler d1 execute retentionhealth_v1 --file=schema.sql
npx wrangler d1 execute retentionhealth_v1 --file=seed.sql
```

### Deployment

```bash
# Create D1 database
npm run db:create

# Deploy schema to remote
npx wrangler d1 execute retentionhealth_v1 --remote --file=schema.sql

# Deploy seed data (optional, for testing)
npx wrangler d1 execute retentionhealth_v1 --remote --file=seed.sql

# Set secrets
echo "your_secret_here" | npx wrangler secret put AUTH_SECRET
echo "your_admin_key" | npx wrangler secret put ADMIN_KEY

# Deploy Worker
npm run deploy
```

## 🧪 Testing

### Test Patient Login
```bash
curl -X POST https://retentionhealth-engine.vicsicard.workers.dev/api/patient/login \
  -H "Content-Type: application/json" \
  -d '{"clinic_id":"clinic_demo_01","patient_external_id":"EXT001"}'
```

### Test Clinic Dashboard
```bash
curl https://retentionhealth-engine.vicsicard.workers.dev/api/clinic/dashboard/summary \
  -H "x-admin-key: retention_admin_mvp_2026" \
  -H "x-clinic-id: clinic_demo_01"
```

## 📊 Demo Data

The seed data includes:
- 1 demo clinic (`clinic_demo_01`)
- 10 test seats (EXT001-EXT010)
- 7 days of check-in data (2026-01-01 to 2026-01-07)

**Expected Risk Distribution:**
- 🟢 STABLE: 3 seats (30%)
- 🟡 MONITOR: 4 seats (40%)
- 🔴 ELEVATED: 3 seats (30%)

## 🔐 Credentials

**Admin Key**: `retention_admin_mvp_2026`

**Demo Clinic**: `clinic_demo_01`

**Demo Patients**: `EXT001` through `EXT010`

## 📖 Documentation

- **API Contract**: See `API.md`
- **Frontend Guide**: See `FRONTEND.md`
- **Database Schema**: See `schema.sql`

## 🔒 Security Notes

- No PHI stored (patient_external_id provided by clinic)
- JWT-based authentication
- Multi-tenant isolation via clinic_id
- All secrets managed via Wrangler

## 🛠️ Tech Stack

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **Database**: Cloudflare D1 (SQLite)
- **Auth**: JWT (HMAC-SHA256)
- **API**: RESTful JSON

## 📝 License

MIT

## 👥 Contact

For questions or support, contact: vic@getdigdev.com
