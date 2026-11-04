# Database

## Technology and source files

The configured database is PostgreSQL provided by Supabase. Supabase Auth stores identities in `auth.users`; application profile and domain data are defined in the SQL migration. The authoritative migration remains at `supabase/migrations/20261030000000_carebridge_schema.sql`, and sample data remains at `supabase/seed.sql`. These canonical locations are preserved for Supabase tooling. The `database/` directory documents and points to those resources rather than maintaining duplicate SQL copies.

No live database connection could be tested from this repository environment. The frontend client is configured with the Supabase URL and public anon/publishable key, but current application code does not query the application tables.

## Schema overview

The migration creates 27 public tables:

- **Identity and care relationships:** `users`, `patients`, `doctors`, `donors`, `family_members`
- **Appointments and care delivery:** `appointments`, `consultations`, `prescriptions`, `prescription_items`, `medical_records`, `lab_reports`, `care_plans`, `care_gaps`, `follow_ups`
- **Emergency and donation coordination:** `emergency_profiles`, `emergency_access_logs`, `blood_requests`, `blood_donors`, `blood_request_responses`, `organ_donors`, `organ_requests`
- **Pharmacy and medication:** `pharmacy_products`, `medicine_orders`, `medicine_order_items`, `medicine_history`
- **Platform support:** `notifications`, `consents`, `audit_logs`

The schema links `users.id` to Supabase `auth.users.id`. Patient and doctor profiles reference `users`; appointments reference patients and doctors; consultations can reference appointments; prescriptions reference consultations and patients/doctors; prescription items reference prescriptions. Medical records, lab reports, plans, gaps, follow-ups, orders, requests, and emergency profiles are associated with their relevant patient/care entities. Foreign keys, uniqueness constraints, checks, indexes, timestamps, helper functions, and an auth-user trigger are defined in the migration.

## Security and storage

The migration enables Row Level Security on `users`, `patients`, `appointments`, `consultations`, `prescriptions`, `medical_records`, `lab_reports`, `care_plans`, `care_gaps`, `notifications`, and `blood_requests`; it defines role- and user-aware policies for those resources. It also creates a private `carebridge-records` Storage bucket with authenticated select/insert policies. Review the migration for the exact policy coverage before connecting additional tables or deploying sensitive workflows.

The auth trigger creates an application `users` row and, for patient/doctor roles, a corresponding profile. The SQL seed adds four pharmacy products and, where a matching patient exists, sample notifications and a care gap.

## Connection flow

```text
React app in browser
  -> Supabase client (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)
  -> Supabase Auth (currently used)
  -> Supabase PostgreSQL / Storage (schema and policies exist; current UI does not query them)
```

Vite-prefixed variables are bundled for browser use. Use only a publishable/anon key there; never use a service-role key or database password. Apply and manage the migration/seed through the configured Supabase project workflow after reviewing them; no Supabase CLI configuration file is currently present in this repository.

## Resource map

- `database/migrations/README.md` points to the canonical migration location.
- `database/schema/README.md` describes the source of the schema.
- `database/seed/README.md` points to the canonical sample-data script.
- `supabase/migrations/` and `supabase/seed.sql` contain the actual SQL.
