# Backend architecture

There is no separate backend application in this project. The hosted Supabase project provides backend-as-a-service capabilities, and the React app currently uses Supabase Auth directly from the browser. Table and Storage SQL is defined in `../supabase/`; current dashboard/domain screens mostly use demo data rather than database queries.

See [`../docs/BACKEND.md`](../docs/BACKEND.md) for the API usage and connection flow.
