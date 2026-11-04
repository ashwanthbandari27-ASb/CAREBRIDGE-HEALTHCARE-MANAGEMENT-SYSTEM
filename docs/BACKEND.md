# Backend

## Actual architecture

This repository does not contain a separate backend server. There are no custom API routes, controllers, server-side services, or middleware, and no backend process to run. Creating an empty or simulated API server would misrepresent the existing architecture, so the backend section is documented rather than populated with fake implementation code.

Supabase is the hosted backend-as-a-service used by the app. It provides PostgreSQL, Auth, REST access to database tables, and Storage. The browser initializes the Supabase client from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `frontend/src/services/supabase.ts`.

## Current API usage

The frontend currently calls Supabase Auth for:

- Password sign-in
- Password-reset email requests
- Session checks for protected routes
- Sign-out

The current UI does not make Supabase table or Storage requests. Dashboard metrics, records, appointments, pharmacy inventory, workflows, and role dashboard values are demonstration/static data; the SQL tables do not by themselves mean those views are database-backed. There is also no implemented registration call.

## Data and access flow

1. The browser loads the public Supabase URL and anon/publishable key from Vite environment variables.
2. Supabase Auth handles configured sign-in, session, password reset, and sign-out calls.
3. If future frontend features access PostgreSQL or Storage directly, the Supabase client sends those requests using the current user's session and the database's Row Level Security policies.
4. The migration defines database-side user provisioning, policies, and a private records storage bucket. See [Database documentation](./DATABASE.md).

Never expose a Supabase service-role key or database credentials in frontend code. For future privileged business logic, add a real server/Edge Function rather than placing privileged keys in the browser.

## Run

There is no backend command. Run the frontend from the repository root with `npm run dev`. A deployed Supabase project must be configured for real authentication; without it, the application presents its existing demo-mode behavior.
