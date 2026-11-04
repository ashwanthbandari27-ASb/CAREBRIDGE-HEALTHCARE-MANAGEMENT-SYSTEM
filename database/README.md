# Database resources

The application database is Supabase PostgreSQL. Supabase's expected SQL paths remain the source of truth:

- Migration: `../supabase/migrations/20261030000000_carebridge_schema.sql`
- Seed: `../supabase/seed.sql`

This directory is an organized guide and does not duplicate or replace the migration/seed. See [`../docs/DATABASE.md`](../docs/DATABASE.md) for tables, relationships, policies, and the connection flow.
