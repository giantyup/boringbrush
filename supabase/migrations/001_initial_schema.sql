-- ===========================================================================
-- BoringBrush — initial schema, indexes, and row-level security
-- Run in the Supabase SQL editor, or via `supabase db push` with the CLI.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Admin helper: returns true when the current JWT email is in the allowlist.
-- The allowlist is stored as a Postgres custom setting so it can be managed
-- without code changes. Set it once (replace with your admins):
--   alter database postgres set app.admin_emails = 'solvex82@gmail.com';
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() ->> 'email') = any (
      string_to_array(
        lower(coalesce(current_setting('app.admin_emails', true), '')),
        ','
      )
    ),
    false
  );
$$;

-- Keep updated_at fresh on row changes.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- collections
-- ---------------------------------------------------------------------------
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  cover_image_url text,
  tags text[] default '{}',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists collections_published_order_idx
  on public.collections (is_published, sort_order);
create index if not exists collections_featured_idx
  on public.collections (is_featured);

drop trigger if exists collections_set_updated_at on public.collections;
create trigger collections_set_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- gallery_items
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections (id) on delete cascade,
  title text,
  slug text,
  description text,
  image_url text not null,
  thumbnail_url text,
  before_image_url text,
  artist_notes text,
  size text,
  material text,
  paint_finish text,
  status text not null default 'available'
    check (status in ('available', 'sold', 'archived', 'commission')),
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_items_collection_order_idx
  on public.gallery_items (collection_id, sort_order);
create index if not exists gallery_items_featured_idx
  on public.gallery_items (is_featured);
create index if not exists gallery_items_status_idx
  on public.gallery_items (status);

drop trigger if exists gallery_items_set_updated_at on public.gallery_items;
create trigger gallery_items_set_updated_at
  before update on public.gallery_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- contact_requests
-- ---------------------------------------------------------------------------
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  twitter_handle text,
  collection_interest text,
  budget text,
  message text not null,
  attachment_url text,
  is_read boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_requests_created_idx
  on public.contact_requests (created_at desc);
create index if not exists contact_requests_read_idx
  on public.contact_requests (is_read);

-- ===========================================================================
-- Row level security
-- ===========================================================================
alter table public.collections enable row level security;
alter table public.gallery_items enable row level security;
alter table public.contact_requests enable row level security;

-- collections: public reads published rows; admins do everything.
drop policy if exists "collections public read" on public.collections;
create policy "collections public read"
  on public.collections for select
  using (is_published = true or public.is_admin());

drop policy if exists "collections admin write" on public.collections;
create policy "collections admin write"
  on public.collections for all
  using (public.is_admin())
  with check (public.is_admin());

-- gallery_items: public reads items whose collection is published; admins all.
drop policy if exists "gallery public read" on public.gallery_items;
create policy "gallery public read"
  on public.gallery_items for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.collections c
      where c.id = gallery_items.collection_id and c.is_published = true
    )
  );

drop policy if exists "gallery admin write" on public.gallery_items;
create policy "gallery admin write"
  on public.gallery_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- contact_requests: anyone may submit; only admins may read/update/delete.
drop policy if exists "contact anon insert" on public.contact_requests;
create policy "contact anon insert"
  on public.contact_requests for insert
  with check (true);

drop policy if exists "contact admin read" on public.contact_requests;
create policy "contact admin read"
  on public.contact_requests for select
  using (public.is_admin());

drop policy if exists "contact admin update" on public.contact_requests;
create policy "contact admin update"
  on public.contact_requests for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "contact admin delete" on public.contact_requests;
create policy "contact admin delete"
  on public.contact_requests for delete
  using (public.is_admin());

-- ===========================================================================
-- Storage buckets (public read for media; private for contact attachments)
-- ===========================================================================
insert into storage.buckets (id, name, public)
values
  ('covers', 'covers', true),
  ('gallery', 'gallery', true),
  ('contact-attachments', 'contact-attachments', false)
on conflict (id) do nothing;

-- Public read for media buckets.
drop policy if exists "media public read" on storage.objects;
create policy "media public read"
  on storage.objects for select
  using (bucket_id in ('covers', 'gallery'));

-- Admins manage all media.
drop policy if exists "media admin write" on storage.objects;
create policy "media admin write"
  on storage.objects for all
  using (public.is_admin() and bucket_id in ('covers', 'gallery', 'contact-attachments'))
  with check (public.is_admin() and bucket_id in ('covers', 'gallery', 'contact-attachments'));
