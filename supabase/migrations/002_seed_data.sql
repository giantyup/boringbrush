-- ===========================================================================
-- BoringBrush — seed data
-- Inserts the four starter collections and sample gallery items using branded
-- placeholder SVGs that ship in /public. Replace via the admin panel.
-- Safe to re-run: uses fixed UUIDs with upserts.
-- ===========================================================================

insert into public.collections
  (id, title, slug, description, cover_image_url, tags, is_featured, is_published, sort_order)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'Yuppie Apes',
    'yuppie-apes',
    'Sharp suits, sharper attitudes. Boardroom primates rendered in crisp resin and finished with a glossy, corporate sheen.',
    '/placeholders/collection-yuppie-apes.svg',
    array['apes', 'yuppie', 'premium'],
    true, true, 0
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Bored Apes',
    'bored-apes',
    'The originals, unbothered and iconic. Hand-painted fur texture and that famous half-lidded stare.',
    '/placeholders/collection-bored-apes.svg',
    array['apes', 'classic', 'iconic'],
    true, true, 1
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Mutants',
    'mutants',
    'Glitched, dripping, and gloriously strange. A series for collectors who like their art a little radioactive.',
    '/placeholders/collection-mutants.svg',
    array['mutant', 'experimental', 'neon'],
    false, true, 2
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Dengs',
    'dengs',
    'Playful, rounded, and full of charm. The friendliest faces in the BoringBrush studio.',
    '/placeholders/collection-dengs.svg',
    array['deng', 'cute', 'colorful'],
    false, true, 3
  )
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  description = excluded.description,
  cover_image_url = excluded.cover_image_url,
  tags = excluded.tags,
  is_featured = excluded.is_featured,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order;

-- Sample gallery items: 4 per collection with varied statuses.
insert into public.gallery_items
  (collection_id, title, slug, description, image_url, thumbnail_url, artist_notes,
   size, material, paint_finish, status, is_featured, sort_order, completed_at)
select
  c.id,
  c.title || ' #' || g.n,
  c.slug || '-' || g.n,
  'A hand-painted ' || lower(c.title) || ' print, finished in the BoringBrush studio.',
  c.cover_image_url,
  c.cover_image_url,
  'Layered base coat, dry-brushed highlights, and a satin sealant for shelf-ready durability.',
  '4.5" tall',
  'Resin + PLA core',
  'Hand-painted acrylic, satin seal',
  (array['available', 'sold', 'commission', 'available'])[g.n],
  (g.n = 1 and c.is_featured),
  g.n - 1,
  now() - (g.n || ' days')::interval
from public.collections c
cross join generate_series(1, 4) as g(n)
on conflict do nothing;
