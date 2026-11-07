# Bite & Beans — 2D Cafe House

Guwahati's first 2D-themed cafe website, now a Next.js app with a Supabase content
studio at `/admin`.

## Pages

| Route | Description |
|---|---|
| `/` | Hero, space teaser, menu highlights, amenities, visit snapshot |
| `/menu` | Filterable menu, price variants, add-ons, menu image carousel + lightbox |
| `/experience` | Interior gallery |
| `/visit` | Address, hours, contact, amenities, reservations |
| `/admin` | Content studio (Supabase Auth, admin-only) |

## Stack

- **Next.js 16** (App Router, Server Actions, Proxy for auth cookie refresh)
- **React 19**
- **Supabase** Postgres + Auth + Storage
- Existing vanilla CSS, migrated intact from the original static site

## Quick start

```bash
npm install
cp .env.local.example .env.local   # then fill in Supabase values
npm run dev
```

Node 20.9+ is required for builds. **Use npm as this project's package manager.**
Bun is fine to keep installed for other tools, but do not run `bun install` in this
project: it rewrites `node_modules/.bin` with Bun shims and can make Next run
under the Bun runtime, which currently crashes on production builds.

Then open <http://localhost:3000>. For the admin, follow **[SETUP.md](./SETUP.md)**.
The easiest database setup is: open a new Supabase SQL query, paste the entire
`supabase/setup.sql`, press **Ctrl+A**, and Run. Then create an Auth user and
grant that user admin access via `public.admin_users`.

Without Supabase credentials, the public site still renders the bundled content
from `data/content.json`; the admin shows setup instructions.

## Project layout

```
app/
  (site)/             public pages + site layout
  admin/              content studio, login, Server Actions
  layout.tsx          html/body, fonts, global CSS
  not-found.tsx
components/
  admin/              reusable admin UI (collections, image upload, forms)
  MenuExplorer.tsx    menu filters, tabs, carousel, lightbox
  Header.tsx          navigation + mobile menu
  ScrollReveal.tsx    scroll animations
lib/
  content.ts          public content loader + fallback
  types.ts            content types
  supabase/           public, server and config clients
  admin/              auth guard, collection definitions, action state
data/content.json     default content + source for the SQL seed
supabase/
  setup.sql           complete schema + seed (recommended one-step setup)
  schema.sql          tables, triggers, RLS, RPC, storage bucket
  seed.sql            generated seed data
  verify.sql          table/row-count check
scripts/
  extract-legacy-content.mjs   one-time import from the old router.js
  generate-seed.mjs            data/content.json → supabase/seed.sql
public/assets/        original images (still referenced by the seed)
legacy/               archived original static site (not served)
styles/               original CSS + admin.css
proxy.ts              Supabase auth session refresh for /admin
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Start the production server |
| `npm run seed:generate` | Regenerate `supabase/seed.sql` from `data/content.json` |
| `npm run content:extract` | Re-import content from `legacy/js/router.js` (one-time migration helper) |

## Security

- Public reads use the anon key; RLS exposes published rows only.
- Only users in `public.admin_users` can write; enforced both in the UI and in Postgres.
- The `service_role` key is never used client-side.
- Supabase Storage uploads are restricted to admins; the bucket is public for reads.
