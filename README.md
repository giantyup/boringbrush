# BoringBrush

> Digital avatars, printed into reality.

A production-grade website for **BoringBrush**, a studio that turns digital 3D
avatars into physical, hand-painted collectibles. Built with Next.js (App
Router), TypeScript, Tailwind CSS, Framer Motion, and Supabase, with a complete
database-backed admin CMS.

- **3D printing & printer control** by [Solvex](https://x.com/_Solvex_)
- **Hand painting & finishing** by [The1](https://x.com/the1_im_here)
- **Brand** on X: [@BoringBrush](https://x.com/BoringBrush)

---

## Features

- Public site: home, collections grid (search / filter / sort), collection
  album with masonry gallery and lightbox, about/process, and contact pages.
- Premium art-gallery design system using the BoringBrush palette with recurring
  rainbow accents and tasteful Framer Motion animation.
- Database-backed admin CMS at `/admin`: dashboard stats, collection editor with
  drag-to-reorder, gallery media manager with uploads and status/feature
  controls, and a contact inquiry inbox.
- Magic-link admin auth restricted to an email allowlist, protected by
  middleware and server-side guards.
- Contact form with server-side validation, honeypot, rate limiting, database
  storage, and email delivery via Resend.
- SEO: dynamic metadata, OpenGraph/Twitter cards, `sitemap.xml`, and
  `robots.txt`.
- **Works out of the box without a backend** — public pages fall back to bundled
  sample data until Supabase is configured.

---

## Tech stack

| Area        | Choice                                   |
| ----------- | ---------------------------------------- |
| Framework   | Next.js (App Router) + TypeScript        |
| Styling     | Tailwind CSS v4 (CSS-based theme)        |
| Animation   | Framer Motion                            |
| Backend     | Supabase (Auth, Postgres, Storage, RLS)  |
| Email       | Resend                                   |
| Drag & drop | dnd-kit                                  |
| Toasts      | Sonner                                   |
| Validation  | Zod                                      |

---

## Prerequisites

- Node.js 20+ (tested on Node 22)
- A [Supabase](https://supabase.com) project (free tier is fine)
- A [Resend](https://resend.com) account for the contact form email

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local   # then fill in values (see below)

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without any environment
variables the site runs on bundled sample data; the admin area will prompt you
to configure Supabase.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable                         | Required | Description                                            |
| -------------------------------- | -------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`       | yes\*    | Supabase project URL (Settings → API)                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | yes\*    | Supabase anon/publishable key                          |
| `SUPABASE_SERVICE_ROLE_KEY`      | yes\*    | Service role key (server only) — enables admin writes  |
| `ADMIN_EMAILS`                   | yes      | Comma-separated admin allowlist for `/admin`           |
| `RESEND_API_KEY`                 | yes\*\*  | Resend API key for contact emails                      |
| `CONTACT_TO_EMAIL`               | yes      | Inbox for inquiries (default `solvex82@gmail.com`)     |
| `CONTACT_FROM_EMAIL`             | yes      | Verified sender (use `onboarding@resend.dev` for dev)  |
| `NEXT_PUBLIC_SITE_URL`           | yes      | Public base URL (e.g. `http://localhost:3000`)         |

\* Required for the database/admin/auth features. The marketing site works
without them using sample data.
\*\* Without it, contact submissions are still stored in the database; only the
email notification is skipped.

> **Never commit `.env.local` or any secret.** Only `.env.example` is tracked.

---

## Supabase setup

1. **Create a project** at [supabase.com](https://supabase.com).

2. **Run the migrations.** In the Supabase dashboard, open **SQL Editor** and run
   the files in order:
   - `supabase/migrations/001_initial_schema.sql` (tables, indexes, RLS,
     storage buckets)
   - `supabase/migrations/002_seed_data.sql` (the four starter collections and
     sample pieces)

   Or, with the [Supabase CLI](https://supabase.com/docs/guides/local-development):

   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```

3. **Enable magic-link auth.** Go to **Authentication → Providers → Email** and
   make sure email sign-in (OTP / magic link) is enabled.

4. **Add the redirect URL.** Under **Authentication → URL Configuration**, add:
   - `http://localhost:3000/auth/callback` (local)
   - `https://your-domain.com/auth/callback` (production)

5. **(Optional) Set the database admin allowlist.** The app gates admin access
   via `ADMIN_EMAILS` and uses the service-role key for admin writes, so this is
   optional. To also enforce admin access at the database (RLS) layer, run:

   ```sql
   alter database postgres set app.admin_emails = 'solvex82@gmail.com';
   ```

   (Use the same comma-separated emails as `ADMIN_EMAILS`, lowercase.)

6. **Storage** buckets `covers`, `gallery`, and `contact-attachments` are created
   by the migration. The first two are public-read for serving images.

---

## Admin access

1. Add your email to `ADMIN_EMAILS` in `.env.local` (comma-separated for
   multiple admins).
2. Visit [`/admin/login`](http://localhost:3000/admin/login), enter that email,
   and click the magic link delivered to your inbox.
3. You land on the dashboard. From there you can:
   - Create, edit, reorder, feature, publish/unpublish, and delete collections.
   - Upload gallery pieces, edit all metadata, set status
     (available / sold / archived / commission), feature pieces, reorder within
     a collection, and delete them.
   - Read, mark read/unread, archive, reply to, and delete contact inquiries.

Non-allowlisted emails are rejected even if they have a Supabase account.

---

## Replacing placeholder content

The seed data uses branded placeholder SVGs from `public/placeholders/`. To
replace them with real photos:

1. Sign in to `/admin`.
2. Edit each collection and upload a real cover image.
3. Open **Gallery**, filter by collection, and add real pieces (or edit the
   sample ones) with photos and metadata.

Everything visible on the public site is editable from the admin panel.

---

## Project structure

```
src/
  app/
    (public routes)      home, collections, about, contact, 404
    admin/
      login/             magic-link sign in (public)
      (protected)/       dashboard, collections, gallery, contacts (guarded)
    api/contact/         REST fallback for the contact form
    auth/callback/       magic-link exchange
    sitemap.ts, robots.ts
  components/
    ui/ layout/ home/ collections/ gallery/ process/ contact/ admin/
  lib/
    supabase/  auth/  email/  data/  validations/  rate-limit, site, utils
  types/database.ts
supabase/migrations/     001_initial_schema.sql, 002_seed_data.sql
public/placeholders/     branded placeholder art
```

---

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import it into [Vercel](https://vercel.com).
3. Add all environment variables from `.env.example` in the Vercel project
   settings (set `NEXT_PUBLIC_SITE_URL` to your production URL).
4. Add the production `/auth/callback` URL to Supabase redirect URLs.
5. For production email, verify a domain in Resend and set `CONTACT_FROM_EMAIL`
   to an address on that domain.
6. Deploy.

---

## Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint
```
