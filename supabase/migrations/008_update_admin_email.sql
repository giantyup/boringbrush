-- Keep the database admin allowlist in sync with the studio login email.

insert into public.boringbrush_settings (key, value)
values ('admin_emails', 'solvex82@gmail.com')
on conflict (key) do update set value = excluded.value, updated_at = now();
