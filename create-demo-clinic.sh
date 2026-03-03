#!/bin/bash
# Create demo clinic in D1 database

# You'll need to run this with your ADMIN_KEY
# Replace YOUR_ADMIN_KEY with the actual admin key from your environment

curl -X POST https://retentionhealth.com/api/admin/create-clinic \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_KEY" \
  -d '{
    "name": "Demo Clinic",
    "clinic_id": "demo-clinic",
    "api_key": "demo-key-2024"
  }'
