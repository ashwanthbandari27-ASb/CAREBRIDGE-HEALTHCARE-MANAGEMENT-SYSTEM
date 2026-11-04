# CAREBRIDGE-HEALTHCARE-MANAGEMENT-SYSTEM

A Healthcare Management System to manage patient records, appointments, treatments, and departments with interactive dashboards, charts, reports, and automatic data synchronization.

CAREBRIDGE is a React and TypeScript healthcare management project presented as a Vite application. The repository has separated frontend and database resources. Authentication is connected directly to Supabase, while most screens currently display demonstration data.

## Project layout

- `frontend/` - React application source, reusable UI components, styles, assets, and static public files.
- `backend/` - architecture note documenting that there is no separate application server.
- `database/` - database guide and pointers to the canonical Supabase SQL resources.
- `supabase/` - Supabase migration and seed files kept in their expected locations.
- `docs/` - frontend, backend, and database documentation.
- `index.html`, `vite.config.ts`, `package.json`, and TypeScript configuration stay at the repository root because Vite and the package scripts use them there.

See [Frontend documentation](./docs/FRONTEND.md), [Backend documentation](./docs/BACKEND.md), and [Database documentation](./docs/DATABASE.md).

## Requirements and environment

Install Node.js and npm, then from the repository root:

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the project's Supabase URL and publishable/anon key. Never put a service-role key or database password in frontend variables.
3. Run `npm install` if dependencies are not already installed.

## Run and verify

- `npm run dev` starts the Vite development server.
- `npm run build` runs the TypeScript project build and creates the production frontend in `dist/`.
- `npm run lint` runs Oxlint.
- `npm run preview` serves the production build locally.

There is no separate backend process to start. The database migration and seed remain under `supabase/`; see [Database documentation](./docs/DATABASE.md) before applying them to a Supabase project.
