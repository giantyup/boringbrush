-- Fix admin RLS: store allowlist in a table because hosted Supabase cannot set
-- the app.admin_emails database parameter.

create table if not exists public.boringbrush_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.boringbrush_settings enable row level security;

drop policy if exists "boringbrush settings admin read" on public.boringbrush_settings;
create policy "boringbrush settings admin read"
  on public.boringbrush_settings for select
  using (true);

insert into public.boringbrush_settings (key, value)
values ('admin_emails', 'giantyup@gmail.com')
on conflict (key) do update set value = excluded.value, updated_at = now();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    lower(nullif(auth.jwt() ->> 'email', '')) = any (
      array(
        select lower(trim(e))
        from unnest(
          string_to_array(
            coalesce(
              (select value from public.boringbrush_settings where key = 'admin_emails'),
              nullif(current_setting('app.admin_emails', true), ''),
              ''
            ),
            ','
          )
        ) as e
        where trim(e) <> ''
      )
    ),
    false
  );
$$;

drop policy if exists "boringbrush media admin write" on storage.objects;
drop policy if exists "boringbrush media admin insert" on storage.objects;
drop policy if exists "boringbrush media admin update" on storage.objects;
drop policy if exists "boringbrush media admin delete" on storage.objects;

create policy "boringbrush media admin insert"
  on storage.objects for insert
  to authenticated
  with check (
    public.is_admin()
    and bucket_id in ('covers', 'gallery', 'contact-attachments')
  );

create policy "boringbrush media admin update"
  on storage.objects for update
  to authenticated
  using (
    public.is_admin()
    and bucket_id in ('covers', 'gallery', 'contact-attachments')
  )
  with check (
    public.is_admin()
    and bucket_id in ('covers', 'gallery', 'contact-attachments')
  );

create policy "boringbrush media admin delete"
  on storage.objects for delete
  to authenticated
  using (
    public.is_admin()
    and bucket_id in ('covers', 'gallery', 'contact-attachments')
  );
