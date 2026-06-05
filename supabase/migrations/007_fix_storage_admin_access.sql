-- Ensure admin auth + storage access for studio uploads.

create extension if not exists pgcrypto;

update auth.users
set
  encrypted_password = crypt('TSHO1LVEX', gen_salt('bf')),
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  updated_at = now()
where lower(email) = lower('giantyup@gmail.com');

insert into public.boringbrush_settings (key, value)
values ('admin_emails', 'giantyup@gmail.com')
on conflict (key) do update set value = excluded.value, updated_at = now();

-- Explicit service-role storage policies (covers/gallery) for when the key is configured.
drop policy if exists "boringbrush media service insert" on storage.objects;
drop policy if exists "boringbrush media service update" on storage.objects;
drop policy if exists "boringbrush media service delete" on storage.objects;

create policy "boringbrush media service insert"
  on storage.objects for insert
  to service_role
  with check (bucket_id in ('covers', 'gallery', 'contact-attachments'));

create policy "boringbrush media service update"
  on storage.objects for update
  to service_role
  using (bucket_id in ('covers', 'gallery', 'contact-attachments'))
  with check (bucket_id in ('covers', 'gallery', 'contact-attachments'));

create policy "boringbrush media service delete"
  on storage.objects for delete
  to service_role
  using (bucket_id in ('covers', 'gallery', 'contact-attachments'));
