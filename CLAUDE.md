# RyanERP

Multi-tenant ERP system built on Next.js 16, Supabase, and Drizzle ORM.

## Architecture

- **Auth**: Supabase SSR (`@supabase/ssr`) with cookie-based sessions
- **Data**: Drizzle ORM with direct Postgres connection (bypasses PostgREST/RLS)
- **Tenant isolation**: Application-level via `getTenantContext()` in `src/lib/auth/tenant.ts`. RLS policies exist as defense-in-depth.
- **UI**: shadcn/ui + Tailwind CSS 4 + Base UI

## Database

6 PostgreSQL schemas: `system`, `finance`, `inventory`, `purchasing`, `sales`, `production`

Migrations in `supabase/migrations/`. Push with `npx supabase db push`.

## Key Patterns

- **Server actions**: Each module has `actions.ts` with `ActionResult<T>` return type
- **Tenant context**: `getTenantContext()` returns `{ tenantId, defaultCompanyCode }`, cached per-request
- **Soft deletes**: Tables with `deleted_at` column use soft delete
- **Validation**: Zod schemas in `src/lib/validations/`
- **State**: Zustand for client state (company selector), TanStack Query for server state

## Deployment

- **Vercel**: https://ryanerp.ryanbrents.com
- **Supabase**: Project ref `pqkrugqbiwrnkzfavbcb` (West US Oregon)
- **Env vars**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL`

## Commands

```
npm run dev          # Local dev server
npm run build        # Production build
npm run db:push      # Push Drizzle schema to DB
npm run db:generate  # Generate Drizzle migrations
npm run db:studio    # Open Drizzle Studio
```
